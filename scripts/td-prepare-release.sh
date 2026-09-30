#!/usr/bin/env bash

script_name="td-prepare-release.sh"
script_dir="$(CDPATH='' cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"

# shellcheck source=scripts/td-repo-root.sh
. "$script_dir/td-repo-root.sh"

usage() {
    echo "Usage: $script_name vMAJOR.MINOR.PATCH[-RCNUMBER]"
    echo
    echo "Update all package versions and clear the desktop build state."
    echo "For a final release, also update the documentation version."
    echo "This script does not commit, tag, or push changes."
}

die() {
    echo "$script_name: $*" >&2
    exit 2
}

if [ "$#" -eq 1 ] && { [ "$1" = "-h" ] || [ "$1" = "--help" ]; }; then
    usage
    exit 0
fi

[ "$#" -eq 1 ] || die "provide one version, such as v2.6.3 or v2.6.3-RC1"

release_tag="$1"
[[ "$release_tag" =~ ^v[0-9]+\.[0-9]+\.[0-9]+(-RC[1-9][0-9]*)?$ ]] \
    || die "version must match vMAJOR.MINOR.PATCH or vMAJOR.MINOR.PATCH-RCNUMBER"

td_require_repo_root "$script_name"
command -v npm >/dev/null 2>&1 || die "required command not found: npm"

version="${release_tag#v}"

if [[ "$release_tag" != *-RC* ]]; then
    docs_config="docs/_config.yml"
    docs_title_pattern='^title: Threat Dragon version [0-9]+\.[0-9]+\.[0-9]+ Documentation$'
    [ "$(grep -Ec "$docs_title_pattern" "$docs_config")" -eq 1 ] \
        || die "could not find the documentation version in $docs_config"
fi

npm version "$version" --no-git-tag-version --allow-same-version \
    || die "could not update the root package version"
npm --prefix td.vue version "$version" --no-git-tag-version --allow-same-version \
    || die "could not update the desktop package version"
npm --prefix td.server version "$version" --no-git-tag-version --allow-same-version \
    || die "could not update the server package version"
npm --prefix td.vue pkg set 'buildState=""' --json \
    || die "could not clear the desktop build state"

if [[ "$release_tag" != *-RC* ]]; then
    docs_config_temp="${docs_config}.tmp"
    sed -E "s/$docs_title_pattern/title: Threat Dragon version $version Documentation/" \
        "$docs_config" > "$docs_config_temp" \
        || die "could not update the documentation version"
    mv "$docs_config_temp" "$docs_config" \
        || die "could not replace $docs_config"
fi

echo "Prepared $release_tag. Review the changes before committing."
