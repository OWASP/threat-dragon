#!/usr/bin/env bash

script_name="td-post-release.sh"
script_dir="$(CDPATH='' cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"

# shellcheck source=scripts/td-repo-root.sh
. "$script_dir/td-repo-root.sh"

usage() {
    echo "Usage: $script_name vMAJOR.MINOR.PATCH"
    echo
    echo "Reset all package versions to the final version and restore the desktop build state."
    echo "This script does not commit or push changes."
}

die() {
    echo "$script_name: $*" >&2
    exit 2
}

if [ "$#" -eq 1 ] && { [ "$1" = "-h" ] || [ "$1" = "--help" ]; }; then
    usage
    exit 0
fi

[ "$#" -eq 1 ] || die "provide one final version, such as v2.6.3"

release_tag="$1"
[[ "$release_tag" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]] \
    || die "version must match vMAJOR.MINOR.PATCH"

td_require_repo_root "$script_name"
command -v npm >/dev/null 2>&1 || die "required command not found: npm"

version="${release_tag#v}"

npm version "$version" --no-git-tag-version --allow-same-version \
    || die "could not update the root package version"
npm --prefix td.vue version "$version" --no-git-tag-version --allow-same-version \
    || die "could not update the desktop package version"
npm --prefix td.server version "$version" --no-git-tag-version --allow-same-version \
    || die "could not update the server package version"
npm --prefix td.vue pkg set 'buildState="-latest"' --json \
    || die "could not restore the desktop build state"

echo "Restored development state for $release_tag. Review the package and lock file changes before committing."
