#!/usr/bin/env bash

script_name="td-pr-check.sh"
image_name="${TD_PR_IMAGE:-threat-dragon:pr-local}"
lychee_image="${LYCHEE_IMAGE:-lycheeverse/lychee:0.23.0}"
spellcheck_image="${SPELLCHECK_IMAGE:-jonasbn/github-action-spellcheck:0.60.0}"
zap_image="${ZAP_IMAGE:-ghcr.io/zaproxy/zaproxy:stable}"
failures=""
checks_run=""
docker_built="false"

# Do not use set -e; every included check should run and be reported.
if [ -t 1 ] && [ -z "${NO_COLOR:-}" ]; then
    green="$(printf '\033[32m')"
    red="$(printf '\033[31m')"
    reset="$(printf '\033[0m')"
else
    green=""
    red=""
    reset=""
fi

usage() {
    cat <<'EOF'
Usage: td-pr-check.sh [--help]

Run local checks that emulate the PR workflow using npm commands for Node
tooling and Docker for non-npm tooling.

Environment overrides:
  TD_PR_IMAGE       Docker image tag built and scanned by the Docker checks
  LYCHEE_IMAGE      Lychee Docker image
  SPELLCHECK_IMAGE  Spellcheck Docker image
  ZAP_IMAGE         ZAP Docker image

Intentionally omitted:
  visual_regression_tests: omitted because local results are inconsistent
  GitHub-only mechanics: checkout, caches, artifact uploads, and secrets
EOF
}

record_failure() {
    if [ -z "$failures" ]; then
        failures="$1"
    else
        failures="$failures $1"
    fi
}

record_check() {
    if [ -z "$checks_run" ]; then
        checks_run="$1:$2"
    else
        checks_run="$checks_run $1:$2"
    fi
}

rerun_command() {
    case "$1" in
        markdown_lint)
            echo "npx --yes markdownlint-cli2@latest --config .markdownlint.yaml 'docs/*.md' 'docs/**/*.md' 'td.vue/*.md' 'td.server/*.md' '*.md'"
            ;;
        link_check)
            echo "docker run --rm -v \"\$PWD:/input\" -w /input $lychee_image --verbose --no-progress --max-retries 1 --retry-wait-time 10 --cache 'docs/**/*.md' 'docs/*.md' '*.md'"
            ;;
        spell_check)
            echo "docker run --rm -v \"\$PWD:/github/workspace\" -w /github/workspace -e INPUT_CONFIG_PATH=.spellcheck.yaml $spellcheck_image"
            ;;
        server_unit_tests)
            echo "cd td.server && npm clean-install && npm run lint && npm run test:unit"
            ;;
        site_unit_tests)
            echo "cd td.vue && npm clean-install && npm run lint && npm run test:unit"
            ;;
        desktop_unit_tests)
            echo "cd td.vue && npm clean-install && npm run lint:desktop && npm run test:desktop"
            ;;
        e2e_smokes)
            echo "cd td.vue && npm clean-install && npm run start:serve && npm run test:e2e-pr-smokes; npm run stop:serve"
            ;;
        desktop_e2e_smokes)
            echo "cd td.vue && npm clean-install && $(desktop_e2e_build_command) && npm run test:e2e:desktop"
            ;;
        e2e_tests)
            echo "cd td.vue && npm clean-install && npm run start:serve && npm run test:e2e-pr; npm run stop:serve"
            ;;
        zap_scan)
            echo "npm clean-install --ignore-scripts && cd td.server && npm clean-install && cd ../td.vue && npm clean-install && cd .. && npm start; docker run --rm --add-host host.docker.internal:host-gateway -v \"\$PWD/.github/workflows:/zap/wrk/workflows:ro\" $zap_image zap-full-scan.py -t http://host.docker.internal:8080 -c workflows/.zap-rules-web.tsv -a -I; npm stop"
            ;;
        docker_build)
            echo "docker build --platform linux/amd64 -t $image_name ."
            ;;
        trivy_scan)
            echo "scripts/td-trivy-check.sh --image $image_name"
            ;;
    esac
}

run_check() {
    name="$1"

    echo
    echo "### $name"
    "$name"
    status="$?"

    if [ "$status" -ne 0 ]; then
        echo "${red}✗${reset} $name failed with exit code $status" >&2
        echo "Rerun: $(rerun_command "$name")" >&2
        if [ "$name" = "desktop_e2e_smokes" ]; then
            echo "Note: headless Linux systems may need a display setup outside this script." >&2
        fi
        record_failure "$name"
        record_check "$name" "failed"
    else
        echo "${green}✓${reset} $name passed"
        record_check "$name" "passed"
    fi
}

print_divider() {
    echo
    echo "============================================================"
    echo
}

print_summary() {
    echo
    echo "Summary:"
    for check_result in $checks_run; do
        check_name="${check_result%:*}"
        check_status="${check_result#*:}"

        if [ "$check_status" = "passed" ]; then
            echo "${green}✓${reset} $check_name"
        else
            echo "${red}✗${reset} $check_name"
        fi
    done
}

print_failures() {
    echo
    echo "Failures:"
    if [ -z "$failures" ]; then
        echo "None"
        return
    fi

    for failed_check in $failures; do
        echo "${red}✗${reset} $failed_check"
        echo "  Rerun: $(rerun_command "$failed_check")"
        if [ "$failed_check" = "desktop_e2e_smokes" ]; then
            echo "  Note: headless Linux systems may need a display setup outside this script."
        fi
    done
}

need_docker() {
    docker info >/dev/null 2>&1
}

desktop_e2e_build_args() {
    os_name="$(uname -s)"
    machine="$(uname -m)"

    case "$machine" in
        x86_64|amd64)
            arch="x64"
            ;;
        arm64|aarch64)
            arch="arm64"
            ;;
        *)
            echo "Unsupported desktop e2e architecture: $machine" >&2
            return 1
            ;;
    esac

    case "$os_name" in
        Linux)
            echo "--linux AppImage --$arch --publish=never"
            ;;
        Darwin)
            echo "--mac dmg --$arch --publish=never"
            ;;
        *)
            echo "Unsupported desktop e2e OS for this bash script: $os_name" >&2
            return 1
            ;;
    esac
}

desktop_e2e_build_command() {
    build_args="$(desktop_e2e_build_args)" || return
    echo "npm run build:desktop -- $build_args"
}

markdown_lint() {
    npx --yes markdownlint-cli2@latest \
        --config .markdownlint.yaml \
        'docs/*.md' \
        'docs/**/*.md' \
        'td.vue/*.md' \
        'td.server/*.md' \
        '*.md'
}

link_check() {
    need_docker || return

    docker run --rm \
        -v "$PWD:/input" \
        -w /input \
        "$lychee_image" \
        --verbose \
        --no-progress \
        --max-retries 1 \
        --retry-wait-time 10 \
        --cache \
        'docs/**/*.md' \
        'docs/*.md' \
        '*.md'
}

spell_check() {
    need_docker || return

    docker run --rm \
        -v "$PWD:/github/workspace" \
        -w /github/workspace \
        -e INPUT_CONFIG_PATH=.spellcheck.yaml \
        "$spellcheck_image"
}

server_unit_tests() {
    (
        cd td.server || exit
        npm clean-install &&
            npm run lint &&
            npm run test:unit
    )
}

site_unit_tests() {
    (
        cd td.vue || exit
        npm clean-install &&
            npm run lint &&
            npm run test:unit
    )
}

desktop_unit_tests() {
    (
        cd td.vue || exit
        npm clean-install &&
            npm run lint:desktop &&
            npm run test:desktop
    )
}

e2e_smokes() {
    (
        cd td.vue || exit
        npm clean-install &&
            npm run start:serve &&
            npm run test:e2e-pr-smokes
    )
    status="$?"

    (cd td.vue && npm run stop:serve)
    return "$status"
}

desktop_e2e_smokes() {
    (
        cd td.vue || exit
        build_args="$(desktop_e2e_build_args)" || exit
        set -- $build_args
        npm clean-install &&
            npm run build:desktop -- "$@" &&
            npm run test:e2e:desktop
    )
}

e2e_tests() {
    (
        cd td.vue || exit
        npm clean-install &&
            npm run start:serve &&
            npm run test:e2e-pr
    )
    status="$?"

    (cd td.vue && npm run stop:serve)
    return "$status"
}

zap_scan() {
    need_docker || return

    npm clean-install --ignore-scripts &&
        (cd td.server && npm clean-install) &&
        (cd td.vue && npm clean-install) &&
        npm start
    status="$?"

    if [ "$status" -eq 0 ]; then
        docker run --rm \
            --add-host host.docker.internal:host-gateway \
            -v "$PWD/.github/workflows:/zap/wrk/workflows:ro" \
            "$zap_image" \
            zap-full-scan.py \
            -t http://host.docker.internal:8080 \
            -c workflows/.zap-rules-web.tsv \
            -a \
            -I
        status="$?"
    fi

    npm stop
    return "$status"
}

docker_build() {
    need_docker || return

    docker build --platform linux/amd64 -t "$image_name" . &&
        docker_built="true"
}

trivy_scan() {
    need_docker || return

    if [ "$docker_built" = "true" ]; then
        scripts/td-trivy-check.sh --image "$image_name" --skip-build
    else
        scripts/td-trivy-check.sh --image "$image_name"
    fi
}

case "${1:-}" in
    -h|--help)
        usage
        exit 0
        ;;
    "")
        ;;
    *)
        echo "$script_name: unknown option: $1" >&2
        usage >&2
        exit 2
        ;;
esac

run_check markdown_lint
run_check link_check
run_check spell_check
run_check server_unit_tests
run_check site_unit_tests
run_check desktop_unit_tests
run_check e2e_smokes
run_check desktop_e2e_smokes
run_check e2e_tests
run_check zap_scan
run_check docker_build
run_check trivy_scan

print_divider
echo "Intentionally omitted:"
echo "- visual_regression_tests: local results are inconsistent"
echo "- GitHub-only mechanics: checkout, caches, artifact uploads, and secrets"

print_summary
print_failures

if [ -n "$failures" ]; then
    exit 1
fi

echo
echo "All included checks passed"
