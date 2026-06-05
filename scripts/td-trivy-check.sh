#!/usr/bin/env bash

script_name="td-trivy-check.sh"
default_target_image="threat-dragon:trivy-check"
default_trivy_image="aquasec/trivy:latest"
skip_files="/app/docs/configure/bitbucket.html,/app/docs/assets/search.json"

usage() {
    cat <<'EOF'
Usage: td-trivy-check.sh [options]

Build the local Threat Dragon Docker image for linux/amd64 and scan it with
Trivy using the same ignore file and skip-files list used in CI.

Options:
  --repo-dir PATH      Threat Dragon checkout. Defaults to TD_REPO_DIR,
                       the current git checkout, or the current directory.
  --image NAME         Local image tag to build and scan.
                       Defaults to TD_TRIVY_IMAGE or threat-dragon:trivy-check.
  --trivy-image NAME   Trivy Docker image to run.
                       Defaults to TRIVY_IMAGE or aquasec/trivy:latest.
  --skip-build         Scan the existing local image without building first.
  -h, --help          Show this help.
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
    [ -f "$repo/.github/workflows/.trivyignore" ] || die "missing .github/workflows/.trivyignore in $repo"
}

repo_dir=""
target_image="${TD_TRIVY_IMAGE:-$default_target_image}"
trivy_image="${TRIVY_IMAGE:-$default_trivy_image}"
skip_build="false"

while [ "$#" -gt 0 ]; do
    case "$1" in
        --repo-dir)
            shift
            [ "$#" -gt 0 ] || die "--repo-dir requires a path"
            repo_dir="$1"
            ;;
        --image)
            shift
            [ "$#" -gt 0 ] || die "--image requires an image name"
            target_image="$1"
            ;;
        --trivy-image)
            shift
            [ "$#" -gt 0 ] || die "--trivy-image requires an image name"
            trivy_image="$1"
            ;;
        --skip-build)
            skip_build="true"
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
need_command docker

docker info >/dev/null 2>&1 || die "docker is not running or is not accessible"

repo_dir="$(resolve_repo_dir)"
validate_repo "$repo_dir"

if [ "$skip_build" != "true" ]; then
    echo "Building $target_image from $repo_dir"
    (
        cd "$repo_dir" || exit 2
        docker build --platform linux/amd64 -t "$target_image" .
    ) || die "docker build failed"
fi

docker image inspect "$target_image" >/dev/null 2>&1 || die "docker image not found: $target_image"

echo "Scanning $target_image with $trivy_image"
docker run \
    --rm \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v "$repo_dir/.github/workflows/.trivyignore:/workspace/.trivyignore:ro" \
    "$trivy_image" \
    image \
    --exit-code 1 \
    --ignorefile /workspace/.trivyignore \
    --skip-files "$skip_files" \
    "$target_image"
