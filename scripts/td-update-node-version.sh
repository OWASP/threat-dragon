#!/usr/bin/env bash

script_name="td-update-node-version.sh"
minimum_release_age_days=10
minimum_release_age_seconds=$((minimum_release_age_days * 24 * 60 * 60))

usage() {
    cat <<'EOF'
Usage: td-update-node-version.sh [options] v24.16.0

Update Threat Dragon's Dockerfile NODE_VERSION and GitHub Actions setup-node
versions after checking that the Node.js release exists and is old enough.

Options:
  --repo-dir PATH   Threat Dragon checkout. Defaults to TD_REPO_DIR,
                    the current git checkout, or the current directory.
  --force          Skip the 10-day release age check.
  -h, --help       Show this help.
EOF
}

die() {
    echo "$script_name: $*" >&2
    exit 2
}

need_command() {
    command -v "$1" >/dev/null 2>&1 || die "required command not found: $1"
}

resolve_repo_dir() {
    if [ -n "$repo_dir" ]; then
        printf '%s\n' "$repo_dir"
        return
    fi

    if [ -n "$TD_REPO_DIR" ]; then
        printf '%s\n' "$TD_REPO_DIR"
        return
    fi

    current_repo_dir="$(git rev-parse --show-toplevel 2>/dev/null)"
    if [ -n "$current_repo_dir" ]; then
        printf '%s\n' "$current_repo_dir"
        return
    fi

    pwd
}

validate_repo() {
    repo="$1"

    [ -d "$repo" ] || die "repo directory does not exist: $repo"
    git -C "$repo" rev-parse --is-inside-work-tree >/dev/null 2>&1 || die "not a git checkout: $repo"
    [ -f "$repo/Dockerfile" ] || die "missing Dockerfile in $repo"
    [ -d "$repo/.github/workflows" ] || die "missing .github/workflows in $repo"
}

validate_version() {
    version="$1"

    echo "$version" | grep -Eq '^v[0-9]+\.[0-9]+\.[0-9]+$' || die "version must look like v24.16.0"
}

node_release_date_from_gh() {
    version="$1"

    command -v gh >/dev/null 2>&1 || return 1
    gh release view "$version" \
        --repo nodejs/node \
        --json tagName,isDraft,isPrerelease,publishedAt \
        --jq 'select(.tagName == "'"$version"'" and (.isDraft | not) and (.isPrerelease | not)) | .publishedAt' \
        2>/dev/null \
        | sed 's/T.*//'
}

node_release_date_from_curl() {
    version="$1"

    command -v curl >/dev/null 2>&1 || return 1
    curl -fsSL https://nodejs.org/dist/index.json \
        | awk -v version="$version" '
            BEGIN { RS = "\\{"; FS = "," }
            index($0, "\"version\":\"" version "\"") {
                for (i = 1; i <= NF; i++) {
                    if ($i ~ /"date":/) {
                        gsub(/.*"date":"|".*/, "", $i)
                        print $i
                        exit
                    }
                }
            }
        '
}

node_release_date() {
    version="$1"
    published_date="$(node_release_date_from_gh "$version")"

    if [ -n "$published_date" ]; then
        printf '%s\n' "$published_date"
        return
    fi

    published_date="$(node_release_date_from_curl "$version")"
    if [ -n "$published_date" ]; then
        printf '%s\n' "$published_date"
        return
    fi

    die "Node.js release not found, or install gh/curl to check it: $version"
}

validate_release_age() {
    version="$1"

    published_date="$(node_release_date "$version")"
    published_epoch="$(
        date -u -d "$published_date 00:00:00 UTC" +%s 2>/dev/null
    )" || die "unable to parse release date: $published_date"
    now_epoch="$(date -u +%s)"
    age_seconds=$((now_epoch - published_epoch))

    if [ "$force" = "true" ]; then
        return
    fi

    if [ "$age_seconds" -lt "$minimum_release_age_seconds" ]; then
        die "Node.js release $version is less than $minimum_release_age_days days old (published $published_date)"
    fi
}

rewrite_file() {
    file="$1"
    tmp_file="${file}.tmp.$$"
    shift

    "$@" < "$file" > "$tmp_file" || {
        rm -f "$tmp_file"
        return 1
    }

    mv "$tmp_file" "$file"
}

rewrite_dockerfile() {
    full_version="$1"

    awk -v full_version="$full_version" '
        /^[[:space:]]*ARG[[:space:]]+NODE_VERSION=/ {
            sub(/NODE_VERSION=[0-9]+\.[0-9]+\.[0-9]+/, "NODE_VERSION=" full_version)
        }
        { print }
    '
}

rewrite_workflow() {
    minor_version="$1"

    awk -v minor_version="$minor_version" '
        /^[[:space:]]*node-version:/ {
            sub(/v?[0-9]+\.[0-9]+(\.[0-9]+)?/, minor_version)
        }
        /^[[:space:]]*-[[:space:]]*name:[[:space:]]*Use node LTS/ {
            sub(/v?[0-9]+\.[0-9]+(\.[0-9]+)?/, minor_version)
        }
        { print }
    '
}

update_files() {
    repo="$1"
    version="$2"
    full_version="${version#v}"
    minor_version="${full_version%.*}"

    rewrite_file "$repo/Dockerfile" rewrite_dockerfile "$full_version" || die "failed to update Dockerfile"

    find "$repo/.github/workflows" -type f \( -name '*.yml' -o -name '*.yaml' \) -print \
        | sort \
        | while IFS= read -r workflow_file; do
        rewrite_file "$workflow_file" rewrite_workflow "$minor_version" || exit 2
    done

    if [ "$?" -ne 0 ]; then
        die "failed to update workflow files"
    fi

    if [ -f "$repo/.nvmrc" ]; then
        printf '%s\n' "$version" > "$repo/.nvmrc" || die "failed to update .nvmrc"
    fi

    if [ -f "$repo/.node-version" ]; then
        printf '%s\n' "$version" > "$repo/.node-version" || die "failed to update .node-version"
    fi

    echo "Updated Dockerfile NODE_VERSION to $full_version"
    echo "Updated GitHub Actions node-version values to $minor_version"
}

repo_dir=""
force="false"
node_version=""

while [ "$#" -gt 0 ]; do
    case "$1" in
        --repo-dir)
            shift
            [ "$#" -gt 0 ] || die "--repo-dir requires a path"
            repo_dir="$1"
            ;;
        --force)
            force="true"
            ;;
        -h|--help)
            usage
            exit 0
            ;;
        -*)
            die "unknown option: $1"
            ;;
        *)
            [ -z "$node_version" ] || die "expected exactly one Node.js version"
            node_version="$1"
            ;;
    esac
    shift
done

[ -n "$node_version" ] || die "expected exactly one Node.js version"

validate_version "$node_version"
need_command git
need_command grep
need_command awk
need_command sed
need_command find
need_command sort
need_command date

date -u -d '1970-01-01 00:00:00 UTC' +%s >/dev/null 2>&1 || die "date must support -d"

repo_dir="$(resolve_repo_dir)"
validate_repo "$repo_dir"
validate_release_age "$node_version"
update_files "$repo_dir" "$node_version"
