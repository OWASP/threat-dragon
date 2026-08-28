#!/usr/bin/env bash

script_name="td-repo-access-review.sh"
script_dir="$(CDPATH='' cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
repository="OWASP/threat-dragon"
output_file=".repo-access-review.yaml"

# shellcheck source=scripts/td-repo-root.sh
. "$script_dir/td-repo-root.sh"

usage() {
    cat <<'EOF'
Usage: scripts/td-repo-access-review.sh [options]

Create an editable YAML review of every OWASP/threat-dragon collaborator whose
effective repository role is greater than Read. The output includes the latest
GitHub-attributed authored commit in this repository only; it does not inspect
global GitHub activity. The output file is gitignored.

The authenticated GitHub CLI account must be permitted to view repository
collaborators (GitHub generally requires Push access or higher).

Options:
  --output PATH      Write the review to PATH. Defaults to
                     .repo-access-review.yaml.
  -h, --help         Show this help.
EOF
}

die() {
    echo "$script_name: $*" >&2
    exit 2
}

need_command() {
    command -v "$1" >/dev/null 2>&1 || die "required command not found: $1"
}

last_commit() {
    login="$1"

    gh api "repos/$repository/commits?author=$login&per_page=1" \
        --jq 'if length == 0 then empty else .[0] | [.sha, .commit.author.date, .html_url] | @tsv end'
}

write_user() {
    login="$1"
    permission="$2"
    commit="$(last_commit "$login")" || die "unable to find the last commit for $login"

    printf '  - login: "%s"\n' "$login"
    printf '    current_permission: "%s"\n' "$permission"
    if [ -n "$commit" ]; then
        IFS="$(printf '\t')" read -r commit_sha commit_date commit_url <<EOF
$commit
EOF
        printf '    last_contribution:\n'
        printf '      commit: "%s"\n' "$commit_sha"
        printf '      date: "%s"\n' "$commit_date"
        printf '      url: "%s"\n' "$commit_url"
    else
        printf '    last_contribution: null\n'
    fi
    printf '    demote_to_read: true\n'
}

while [ "$#" -gt 0 ]; do
    case "$1" in
        --output)
            shift
            [ "$#" -gt 0 ] || die "--output requires a path"
            output_file="$1"
            ;;
        -h|--help)
            usage
            exit 0
            ;;
        *)
            die "unknown option: $1"
            ;;
    esac
    shift
done

need_command gh
td_require_repo_root "$script_name"

case "$output_file" in
    /*) ;;
    *) output_file="$(pwd)/$output_file" ;;
esac

output_dir="$(dirname "$output_file")"
[ -d "$output_dir" ] || die "output directory does not exist: $output_dir"
tmp_file="${output_file}.tmp.$$"
trap 'rm -f "$tmp_file"' EXIT HUP INT TERM

collaborators="$(
    gh api --paginate "repos/$repository/collaborators?affiliation=all&per_page=100" \
        --jq '.[] | select(.role_name == "triage" or .role_name == "write" or .role_name == "maintain" or .role_name == "admin") | [.login, .role_name] | @tsv'
)" || die "unable to list repository collaborators"

{
    printf '# Review the entries below before applying changes.\n'
    printf '# Set demote_to_read to false, or remove an entry, to retain access.\n'
    printf '# last_contribution is the latest GitHub-attributed authored commit in this repository.\n'
    printf 'repository: %s\n' "$repository"
    printf 'generated_at: "%s"\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
    printf 'users:\n'

    if [ -n "$collaborators" ]; then
        while IFS="$(printf '\t')" read -r login permission; do
            write_user "$login" "$permission"
        done <<EOF
$collaborators
EOF
    else
        printf '  []\n'
    fi
} > "$tmp_file" || die "unable to write review output"

mv "$tmp_file" "$output_file" || die "unable to save review output"
trap - EXIT HUP INT TERM

echo "Wrote repository access review to $output_file"
