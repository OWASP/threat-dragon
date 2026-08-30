#!/usr/bin/env bash

script_name="td-repo-access-demote.sh"
script_dir="$(CDPATH='' cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
repository="OWASP/threat-dragon"
input_file=".repo-access-review.yaml"
dry_run="false"

# shellcheck source=scripts/td-repo-root.sh
. "$script_dir/td-repo-root.sh"

usage() {
    cat <<'EOF'
Usage: scripts/td-repo-access-demote.sh [options]

Change selected OWASP/threat-dragon collaborators to Read using the editable
YAML review created by td-repo-access-review.sh. Set demote_to_read to false,
or remove an entry, to retain access. The script verifies the current role
before each change and does not add users who no longer have repository access.

The authenticated GitHub CLI account must have permission to manage repository
collaborators.

Options:
  --input PATH       Read the review from PATH. Defaults to
                     .repo-access-review.yaml.
  --dry-run          Print the changes that would be made without changing
                     GitHub state.
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

valid_login() {
    echo "$1" | grep -Eq '^[A-Za-z0-9][A-Za-z0-9-]{0,38}$'
}

selected_users() {
    awk '
        /^[[:space:]]*-[[:space:]]+login:[[:space:]]*/ {
            if (login != "") {
                print login "\t" demote
            }
            login = $0
            sub(/^[[:space:]]*-[[:space:]]+login:[[:space:]]*/, "", login)
            sub(/^"/, "", login)
            sub(/"$/, "", login)
            demote = "true"
            next
        }
        /^[[:space:]]+demote_to_read:[[:space:]]*/ {
            demote = $0
            sub(/^[[:space:]]+demote_to_read:[[:space:]]*/, "", demote)
            next
        }
        END {
            if (login != "") {
                print login "\t" demote
            }
        }
    ' "$input_file"
}

while [ "$#" -gt 0 ]; do
    case "$1" in
        --input)
            shift
            [ "$#" -gt 0 ] || die "--input requires a path"
            input_file="$1"
            ;;
        --dry-run)
            dry_run="true"
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
[ -f "$input_file" ] || die "review file not found: $input_file"

review_repository="$(awk '/^repository:[[:space:]]*/ { sub(/^repository:[[:space:]]*/, ""); print; exit }' "$input_file")"
[ "$review_repository" = "$repository" ] \
    || die "review file must identify repository $repository"

users="$(selected_users)" || die "unable to read review file: $input_file"
[ -n "$users" ] || {
    echo "No users selected for demotion."
    exit 0
}

while IFS="$(printf '\t')" read -r login demote; do
    valid_login "$login" || die "invalid GitHub login in review file: $login"
    case "$demote" in
        true) ;;
        false)
            echo "Skipped $login (demote_to_read is false)"
            continue
            ;;
        *) die "demote_to_read for $login must be true or false" ;;
    esac

    current_permission="$(gh api "repos/$repository/collaborators/$login/permission" --jq '.role_name')" \
        || die "unable to get current permission for $login"

    if [ "$current_permission" = "read" ]; then
        echo "Skipped $login (already Read)"
        continue
    fi

    case "$current_permission" in
        triage|write|maintain|admin) ;;
        *) die "unexpected current permission for $login: $current_permission" ;;
    esac

    if [ "$dry_run" = "true" ]; then
        echo "Would change $login from $current_permission to Read"
        continue
    fi

    gh api --method PUT "repos/$repository/collaborators/$login" -f permission=read >/dev/null \
        || die "unable to change $login from $current_permission to Read"
    echo "Changed $login from $current_permission to Read"
done <<EOF
$users
EOF
