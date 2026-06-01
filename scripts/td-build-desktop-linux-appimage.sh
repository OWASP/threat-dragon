#!/usr/bin/env bash

script_name="td-build-desktop-linux-appimage.sh"

usage() {
    cat <<'EOF'
Usage: td-build-desktop-linux-appimage.sh [options]

Build the Threat Dragon Linux x64 AppImage from td.vue.

Options:
  --repo-dir PATH     Threat Dragon checkout. Defaults to TD_REPO_DIR,
                      the current git checkout, or the current directory.
  --publish MODE     Electron Builder publish mode. Defaults to never.
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
    [ -f "$repo/td.vue/package.json" ] || die "missing td.vue/package.json in $repo"
}

repo_dir=""
publish_mode="never"

while [ "$#" -gt 0 ]; do
    case "$1" in
        --repo-dir)
            shift
            [ "$#" -gt 0 ] || die "--repo-dir requires a path"
            repo_dir="$1"
            ;;
        --publish)
            shift
            [ "$#" -gt 0 ] || die "--publish requires a mode"
            publish_mode="$1"
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

need_command git
need_command npm

repo_dir="$(resolve_repo_dir)"
validate_repo "$repo_dir"

echo "Building Threat Dragon Linux x64 AppImage from $repo_dir/td.vue"
(
    cd "$repo_dir/td.vue" || exit 2
    npm run build:desktop -- --linux AppImage --x64 --publish "$publish_mode"
) || die "AppImage build failed"
