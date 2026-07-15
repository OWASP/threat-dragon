#!/usr/bin/env bash

script_name="td-pr-check.sh"
script_dir="$(CDPATH= cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
image_name="${TD_PR_IMAGE:-threat-dragon:pr-local}"
lychee_image="${LYCHEE_IMAGE:-lycheeverse/lychee:0.23.0}"
spellcheck_image="${SPELLCHECK_IMAGE:-jonasbn/github-action-spellcheck:0.60.0}"
zap_image="${ZAP_IMAGE:-ghcr.io/zaproxy/zaproxy:stable}"
e2e_config="${TD_E2E_CONFIG:-e2e.ci.config.js}"
e2e_browser="${TD_E2E_BROWSER:-}"
e2e_headless="${TD_E2E_HEADLESS:-true}"
e2e_app_port="${TD_E2E_APP_PORT:-${PORT:-8080}}"
e2e_base_url="${TD_E2E_BASE_URL:-http://localhost:$e2e_app_port/}"
server_api_port="${TD_E2E_API_PORT:-${SERVER_API_PORT:-3000}}"
zap_app_port="${TD_ZAP_APP_PORT:-${APP_PORT:-8080}}"
zap_target_url="${TD_ZAP_TARGET_URL:-http://host.docker.internal:$zap_app_port}"
all_checks="markdown_lint link_check spell_check server_unit_tests site_unit_tests desktop_unit_tests desktop_e2e_smokes e2e_tests zap_scan docker_build trivy_scan"
include_checks=""
exclude_checks=""
include_checks_set="false"
exclude_checks_set="false"
failures=""
checks_run=""
docker_built="false"
site_dependencies_installed="false"

# shellcheck source=scripts/td-repo-root.sh
. "$script_dir/td-repo-root.sh"

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
    cat <<EOF
Usage: $script_name [--help] [--include-checks checks] [--exclude-checks checks]

Run local checks that emulate the PR workflow using npm commands for Node
tooling and Docker for non-npm tooling.

Options:
  --include-checks  Comma-separated allow-list of checks to run
  --exclude-checks  Comma-separated deny-list of checks to skip

Environment overrides:
  TD_PR_IMAGE
      Docker image tag built and scanned by the Docker checks.
      Default: $image_name

  LYCHEE_IMAGE
      Lychee Docker image.
      Default: $lychee_image

  SPELLCHECK_IMAGE
      Spellcheck Docker image.
      Default: $spellcheck_image

  ZAP_IMAGE
      ZAP Docker image.
      Default: $zap_image

  TD_E2E_CONFIG
      Cypress config used by local e2e tests.
      Default: $e2e_config

  TD_E2E_BROWSER
      Optional Cypress browser, such as chrome or chromium. If unset, the
      script auto-detects chrome or chromium and fails if neither is installed.
      Default: auto-detect

  TD_E2E_HEADLESS
      Optional Cypress headless toggle: true or false.
      Default: $e2e_headless

  TD_E2E_APP_PORT
      Preferred local app port for e2e tests. The script will use the first
      available port at or above this value.
      Default: $e2e_app_port

  TD_E2E_BASE_URL
      Cypress base URL for local e2e tests.
      Default: $e2e_base_url

  SERVER_API_PORT
      API port used by the local Vue app proxy for e2e and ZAP checks.
      Default: $server_api_port

  TD_E2E_API_PORT
      Preferred local mock API port for e2e tests. The script will use the
      first available port at or above this value.
      Default: $server_api_port

  TD_ZAP_APP_PORT
      Preferred local app port for the ZAP scan. The script will use the first
      available port at or above this value.
      Default: $zap_app_port

  TD_ZAP_TARGET_URL
      URL scanned by ZAP from inside Docker.
      Default: $zap_target_url

Intentionally omitted:
  visual_regression_tests: omitted because local results are inconsistent
  GitHub-only mechanics: checkout, caches, artifact uploads, and secrets
EOF

    echo
    echo "Valid check names:"
    for check_name in $all_checks; do
        echo "  $check_name"
    done
}

die() {
    echo "$script_name: $*" >&2
    exit 2
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
            echo "$script_name --include-checks server_unit_tests"
            ;;
        site_unit_tests)
            echo "$script_name --include-checks site_unit_tests"
            ;;
        desktop_unit_tests)
            echo "$script_name --include-checks desktop_unit_tests"
            ;;
        desktop_e2e_smokes)
            echo "$script_name --include-checks desktop_e2e_smokes"
            ;;
        e2e_tests)
            echo "$script_name --include-checks e2e_tests"
            ;;
        zap_scan)
            echo "$script_name --include-checks zap_scan"
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
        echo "  Command: $(rerun_command "$failed_check")"
    done

    echo 
    echo 
    echo "Rerun failures: $script_name --include-checks $(checks_to_csv "$failures")"
}

check_exists() {
    requested_check="$1"

    for check_name in $all_checks; do
        if [ "$requested_check" = "$check_name" ]; then
            return 0
        fi
    done

    return 1
}

validate_check_list() {
    option_name="$1"
    check_list="$2"

    case "$check_list" in
        ""|,*|*,|*,,*)
            echo "$script_name: $option_name requires a comma-separated list of valid check names" >&2
            echo >&2
            usage >&2
            exit 2
            ;;
    esac

    old_ifs="$IFS"
    IFS=,
    # shellcheck disable=SC2086
    set -- $check_list
    IFS="$old_ifs"

    for requested_check in "$@"; do
        if [ -z "$requested_check" ] || ! check_exists "$requested_check"; then
            echo "$script_name: invalid check name for $option_name: $requested_check" >&2
            echo >&2
            usage >&2
            exit 2
        fi
    done
}

list_contains_check() {
    check_list="$1"
    requested_check="$2"

    old_ifs="$IFS"
    IFS=,
    # shellcheck disable=SC2086
    set -- $check_list
    IFS="$old_ifs"

    for check_name in "$@"; do
        if [ "$requested_check" = "$check_name" ]; then
            return 0
        fi
    done

    return 1
}

should_run_check() {
    check_name="$1"

    if [ -n "$include_checks" ] && ! list_contains_check "$include_checks" "$check_name"; then
        return 1
    fi

    if [ -n "$exclude_checks" ] && list_contains_check "$exclude_checks" "$check_name"; then
        return 1
    fi

    return 0
}

run_selected_checks() {
    for check_name in $all_checks; do
        if should_run_check "$check_name"; then
            run_check "$check_name"
        fi
    done
}

checks_to_csv() {
    check_list="$1"
    csv_checks=""

    for check_name in $check_list; do
        if [ -z "$csv_checks" ]; then
            csv_checks="$check_name"
        else
            csv_checks="$csv_checks,$check_name"
        fi
    done

    echo "$csv_checks"
}

need_docker() {
    command -v docker >/dev/null 2>&1 || die "required command not found: docker"
    docker info >/dev/null 2>&1 || die "docker is not running or is not accessible"
}

install_dependencies() {
    if [ "$site_dependencies_installed" = "true" ]; then
        return 0
    fi

    npm ci --ignore-scripts &&
        (cd td.server && npm ci) &&
        (cd td.vue && npm ci) || return

    site_dependencies_installed="true"
}

resolve_available_port() {
    node -e '
const net = require("net");
const start = Number(process.argv[1]);
const reserved = new Set(process.argv.slice(2).map(Number).filter(Number.isInteger));

if (!Number.isInteger(start) || start < 1 || start > 65535) {
  console.error("Port must be an integer from 1 to 65535");
  process.exit(2);
}

const tryPort = (port) => {
  if (port > 65535) {
    console.error("No available port found");
    process.exit(2);
  }

  if (reserved.has(port)) {
    tryPort(port + 1);
    return;
  }

  const socket = net.createConnection({ host: "127.0.0.1", port });
  socket.unref();
  socket.on("connect", () => {
    socket.destroy();
    tryPort(port + 1);
  });
  socket.on("error", () => {
    socket.destroy();
    console.log(port);
  });
};

tryPort(start);
' "$1"
}

detect_e2e_browser() {
    if [ -n "$e2e_browser" ]; then
        echo "$e2e_browser"
        return 0
    fi

    cypress_browsers="$(./node_modules/.bin/cypress info 2>/dev/null)" || return

    if echo "$cypress_browsers" | grep -q "Name: chrome"; then
        echo "chrome"
        return 0
    fi

    if echo "$cypress_browsers" | grep -q "Name: chromium"; then
        echo "chromium"
        return 0
    fi

    echo "Chrome or Chromium is required for e2e_tests. Install Google Chrome or Chromium, or set TD_E2E_BROWSER to a Cypress-supported browser." >&2
    return 1
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
            echo "--linux --dir --$arch --publish=never"
            ;;
        Darwin)
            echo "--mac --dir --$arch --publish=never"
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
    install_dependencies && (
        cd td.server || exit
        npm run lint &&
            npm run test:unit
    )
}

site_unit_tests() {
    install_dependencies && (
        cd td.vue || exit
        npm run lint &&
            npm run test:unit
    )
}

desktop_unit_tests() {
    install_dependencies && (
        cd td.vue || exit
        npm run lint:desktop &&
            npm run test:desktop
    )
}

desktop_e2e_smokes() {
    install_dependencies && (
        cd td.vue || exit
        build_args="$(desktop_e2e_build_args)" || exit
        set -- $build_args
        npm run build:desktop -- "$@" &&
            npm run test:e2e:desktop
    )
}

e2e_tests() {
    install_dependencies && (
        cd td.vue || exit
        detected_e2e_browser="$(detect_e2e_browser)" || exit
        resolved_api_port="$(resolve_available_port "$server_api_port")" || exit
        server_api_port="$resolved_api_port"
        resolved_app_port="$(resolve_available_port "$e2e_app_port" "$server_api_port")" || exit
        e2e_app_port="$resolved_app_port"
        if [ -z "${TD_E2E_BASE_URL:-}" ]; then
            e2e_base_url="http://localhost:$e2e_app_port/"
        fi
        cypress_args=(run -C "$e2e_config" --config "baseUrl=$e2e_base_url")
        cypress_args+=(--browser "$detected_e2e_browser")
        case "$e2e_headless" in
            true)
                cypress_args+=(--headless)
                ;;
            false)
                cypress_args+=(--headed)
                ;;
            "")
                ;;
            *)
                echo "TD_E2E_HEADLESS must be true or false" >&2
                exit 1
                ;;
        esac
        SERVER_API_PORT="$server_api_port" APP_PORT="$e2e_app_port" npm run start:serve &&
            SERVER_API_PORT="$server_api_port" APP_PORT="$e2e_app_port" ./node_modules/.bin/cypress "${cypress_args[@]}"
    )
    status="$?"

    (cd td.vue && npm run stop:serve)
    return "$status"
}

zap_scan() {
    need_docker || return

    install_dependencies &&
        npm run build:vue &&
        npm run build:server
    status="$?"

    if [ "$status" -eq 0 ]; then
        zap_app_port="$(resolve_available_port "$zap_app_port")" || return
        if [ -z "${TD_ZAP_TARGET_URL:-}" ]; then
            zap_target_url="http://host.docker.internal:$zap_app_port"
        fi

        (cd td.server && npm run start:server) &&
            (cd td.vue && SERVER_API_PORT="$server_api_port" PORT="$zap_app_port" npm run start:serve)
        status="$?"
    fi

    if [ "$status" -eq 0 ]; then
        docker run --rm \
            --add-host host.docker.internal:host-gateway \
            -v "$PWD/.github/workflows:/zap/wrk/workflows:ro" \
            "$zap_image" \
            zap-full-scan.py \
            -t "$zap_target_url" \
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

while [ "$#" -gt 0 ]; do
    case "$1" in
        -h|--help)
            usage
            exit 0
            ;;
        --include-checks)
            if [ "$#" -lt 2 ]; then
                echo "$script_name: --include-checks requires a comma-separated check list" >&2
                usage >&2
                exit 2
            fi
            include_checks="$2"
            include_checks_set="true"
            shift 2
            ;;
        --include-checks=*)
            include_checks="${1#*=}"
            include_checks_set="true"
            shift
            ;;
        --exclude-checks)
            if [ "$#" -lt 2 ]; then
                echo "$script_name: --exclude-checks requires a comma-separated check list" >&2
                usage >&2
                exit 2
            fi
            exclude_checks="$2"
            exclude_checks_set="true"
            shift 2
            ;;
        --exclude-checks=*)
            exclude_checks="${1#*=}"
            exclude_checks_set="true"
            shift
            ;;
        *)
            echo "$script_name: unknown option: $1" >&2
            usage >&2
            exit 2
            ;;
    esac
done

if [ "$include_checks_set" = "true" ]; then
    validate_check_list "--include-checks" "$include_checks"
fi

if [ "$exclude_checks_set" = "true" ]; then
    validate_check_list "--exclude-checks" "$exclude_checks"
fi

td_require_repo_root "$script_name"

run_selected_checks

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
