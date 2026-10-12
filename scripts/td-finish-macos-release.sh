#!/usr/bin/env bash

script_name="td-finish-macos-release.sh"
script_dir="$(CDPATH='' cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"

# shellcheck source=scripts/td-repo-root.sh
. "$script_dir/td-repo-root.sh"

usage() {
    echo "Usage: $script_name vMAJOR.MINOR.PATCH[-RCNUMBER] ARTIFACT_DIRECTORY"
    echo
    echo "Generate macOS updater files from signed packages and upload them to a draft release."
}

die() {
    echo "$script_name: $*" >&2
    exit 2
}

if [ "$#" -eq 1 ] && { [ "$1" = "-h" ] || [ "$1" = "--help" ]; }; then
    usage
    exit 0
fi

[ "$#" -eq 2 ] || { usage; die "provide a release tag and artifact directory"; }

tag="$1"
[[ "$tag" =~ ^v[0-9]+\.[0-9]+\.[0-9]+(-RC[1-9][0-9]*)?$ ]] \
    || die "tag must match vMAJOR.MINOR.PATCH or vMAJOR.MINOR.PATCH-RCNUMBER"

td_require_repo_root "$script_name"

for command in node gh codesign spctl xcrun ditto shasum; do
    command -v "$command" >/dev/null 2>&1 || die "required command not found: $command"
done

artifact_directory="$(CDPATH='' cd -- "$2" && pwd -P)" \
    || die "artifact directory not found: $2"
version="${tag#v}"

x64_zip="$artifact_directory/Threat-Dragon-ng-$version-mac.zip"
arm64_zip="$artifact_directory/Threat-Dragon-ng-$version-arm64-mac.zip"
x64_dmg="$artifact_directory/Threat-Dragon-ng-$version.dmg"
arm64_dmg="$artifact_directory/Threat-Dragon-ng-$version-arm64.dmg"
latest_file="$artifact_directory/latest-mac.yml"
checksum_x64="$artifact_directory/checksum-mac.yml"
checksum_arm64="$artifact_directory/checksum-mac-arm64.yml"
blockmap_module="$PWD/td.vue/node_modules/app-builder-lib/out/targets/blockmap/blockmap.js"

for file in "$x64_zip" "$arm64_zip" "$x64_dmg" "$arm64_dmg" "$blockmap_module"; do
    [ -s "$file" ] || die "required file is missing or empty: $file"
done

remote_tag="$(gh release view "$tag" --repo OWASP/threat-dragon --json tagName --jq .tagName)" \
    || die "GitHub draft release not found for $tag"
[ "$remote_tag" = "$tag" ] || die "GitHub returned the wrong release tag: $remote_tag"

is_draft="$(gh release view "$tag" --repo OWASP/threat-dragon --json isDraft --jq .isDraft)" \
    || die "could not inspect release $tag"
[ "$is_draft" = "true" ] || die "release $tag is not a draft; no files were uploaded"

verification_directory="$(mktemp -d "${TMPDIR:-/tmp}/threat-dragon-macos.XXXXXX")" \
    || die "could not create a temporary verification directory"
trap 'rm -rf -- "$verification_directory"' EXIT

mkdir "$verification_directory/x64" "$verification_directory/arm64" \
    || die "could not prepare the verification directory"
ditto -x -k "$x64_zip" "$verification_directory/x64" \
    || die "could not extract $(basename "$x64_zip")"
ditto -x -k "$arm64_zip" "$verification_directory/arm64" \
    || die "could not extract $(basename "$arm64_zip")"

for app in "$verification_directory/x64/Threat-Dragon-ng.app" "$verification_directory/arm64/Threat-Dragon-ng.app"; do
    [ -d "$app" ] || die "signed application not found in ZIP: $app"
    codesign --verify --deep --strict --verbose=2 "$app" \
        || die "code signature verification failed: $app"
    spctl --assess --type execute --verbose=2 "$app" \
        || die "Gatekeeper verification failed: $app"
    xcrun stapler validate "$app" || die "notarization ticket is missing or invalid: $app"
done

for dmg in "$x64_dmg" "$arm64_dmg"; do
    spctl --assess --type open --context context:primary-signature --verbose=2 "$dmg" \
        || die "Gatekeeper verification failed: $dmg"
    xcrun stapler validate "$dmg" || die "notarization ticket is missing or invalid: $dmg"
done

blockmap_code="require(process.argv[1]).buildBlockMap(process.argv[2], 'gzip', process.argv[2] + '.blockmap').then(result => console.log(result.sha512 + ' ' + result.size))"

generate_blockmap() {
    local input_file="$1"
    local result

    result="$(node -e "$blockmap_code" "$blockmap_module" "$input_file")" \
        || die "could not generate the blockmap for $(basename "$input_file")"
    BLOCKMAP_SHA512="${result% *}"
    BLOCKMAP_SIZE="${result##* }"
    [ -n "$BLOCKMAP_SHA512" ] && [[ "$BLOCKMAP_SIZE" =~ ^[0-9]+$ ]] \
        || die "blockmap generator returned an invalid result for $(basename "$input_file")"
    [ -s "$input_file.blockmap" ] || die "blockmap was not created for $(basename "$input_file")"
}

generate_blockmap "$x64_zip"
x64_zip_sha512="$BLOCKMAP_SHA512"
x64_zip_size="$BLOCKMAP_SIZE"
generate_blockmap "$arm64_zip"
arm64_zip_sha512="$BLOCKMAP_SHA512"
arm64_zip_size="$BLOCKMAP_SIZE"
generate_blockmap "$x64_dmg"
x64_dmg_sha512="$BLOCKMAP_SHA512"
x64_dmg_size="$BLOCKMAP_SIZE"
generate_blockmap "$arm64_dmg"
arm64_dmg_sha512="$BLOCKMAP_SHA512"
arm64_dmg_size="$BLOCKMAP_SIZE"

release_date="$(date -u '+%Y-%m-%dT%H:%M:%S.000Z')"
printf '%s\n' \
    "version: $version" \
    "files:" \
    "  - url: $(basename "$x64_zip")" \
    "    sha512: $x64_zip_sha512" \
    "    size: $x64_zip_size" \
    "  - url: $(basename "$arm64_zip")" \
    "    sha512: $arm64_zip_sha512" \
    "    size: $arm64_zip_size" \
    "  - url: $(basename "$x64_dmg")" \
    "    sha512: $x64_dmg_sha512" \
    "    size: $x64_dmg_size" \
    "  - url: $(basename "$arm64_dmg")" \
    "    sha512: $arm64_dmg_sha512" \
    "    size: $arm64_dmg_size" \
    "path: $(basename "$x64_zip")" \
    "sha512: $x64_zip_sha512" \
    "releaseDate: '$release_date'" > "$latest_file" \
    || die "could not update $(basename "$latest_file")"

(
    cd "$artifact_directory" || exit 1
    shasum -a 512 "$(basename "$x64_dmg")" > "$(basename "$checksum_x64")"
    shasum -a 512 "$(basename "$arm64_dmg")" > "$(basename "$checksum_arm64")"
) || die "could not create the macOS checksum files"

upload_files=(
    "$x64_zip" "$x64_zip.blockmap"
    "$arm64_zip" "$arm64_zip.blockmap"
    "$x64_dmg" "$x64_dmg.blockmap"
    "$arm64_dmg" "$arm64_dmg.blockmap"
    "$latest_file" "$checksum_x64" "$checksum_arm64"
)

for file in "${upload_files[@]}"; do
    [ -s "$file" ] || die "release file is missing or empty: $file"
done

gh release upload "$tag" "${upload_files[@]}" --repo OWASP/threat-dragon --clobber \
    || die "GitHub upload failed for $tag"

echo "Updated the macOS files in draft release $tag."
