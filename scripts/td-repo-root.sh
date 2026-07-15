#!/usr/bin/env bash

td_die_not_repo_root() {
    script_name="$1"

    cat >&2 <<EOF
$script_name: must be run from the root of the Threat Dragon repository.

Current directory: $PWD

This check does not use git remotes, so forks are supported. It expected the
current directory to contain the root package.json plus td.vue/, td.server/,
and scripts/ from the same Threat Dragon checkout.

Run this instead:
  cd /path/to/threat-dragon
  scripts/$script_name
EOF
    exit 2
}

td_require_repo_root() {
    script_name="$1"

    [ -f package.json ] || td_die_not_repo_root "$script_name"
    [ -f td.vue/package.json ] || td_die_not_repo_root "$script_name"
    [ -f td.server/package.json ] || td_die_not_repo_root "$script_name"
    [ -f scripts/README.md ] || td_die_not_repo_root "$script_name"
    grep -Eq '"name"[[:space:]]*:[[:space:]]*"threat-dragon"' package.json \
        || td_die_not_repo_root "$script_name"
}
