# AGENTS.md

This is the repo-level operating contract for agents working in OWASP Threat Dragon.
***These rules are requirements, not suggestions.***

## Project Goals

Threat Dragon is a free, open-source OWASP threat modeling tool. Keep changes aligned with the project goals:

- easy to use
- accessible
- secure
- stable for a global community

In addition to the above goals, please read and understand Threat Dragon's
[strategic roadmap](https://github.com/OWASP/threat-dragon/discussions/1480).
Your work should align with these pillars.

## Operating Contracts

### Agents

This is the repo-level operating contract for non-human OWASP Threat Dragon contributors.
These rules are requirements, ***not suggestions***.

### Contributing

The [contributing.md](./contributing.md) file is the operating contract for our human contributors.
Non-human contributors should still read, understand, and respect these contracts.

### Code of Conduct

The [code_of_conduct.md](./code_of_conduct.md) applies to all contributors -
regardless of whether the contributor is carbon-based, silicon-based, or legally ambiguous.

## Explicit Boundaries

1. Humans are responsible for all contributions, regardless of tooling.
2. AI should explicitly refuse to take action clearly prohibited by this AGENTS file.
3. Humans write public product docs under `docs/`. Agents must not author docs pages.
4. Humans create issues, comment on issues, submit PRs, approve releases, publish artifacts
5. Humans decide roadmap or product policy.
6. Agents may point out docs gaps, but a human must write the final docs text.
7. Agents may test docs with markdown linting, spellcheck, link checks, and local docs builds.
8. Agents may edit code, tests, configuration, workflows, and maintainer scripts when explicitly asked.
9. Agents must remind users of expectations when opening a PR: adhere to the template and include the AI disclosure.
10. Agents must not open issues, comment on GitHub, open PRs, approve PRs, merge, release, or publish.
11. Agents must not commit or push unless a human explicitly asks for that exact git action.
12. Keep PR-sized work small and reviewer-friendly: one bug, feature, or chore per change.
13. Do not mix unrelated cleanup, dependency updates, formatting churn, or opportunistic refactors into task work.

## Required Tooling

- Node.js >= v24
- npm >= v11.10.0
- docker (optional, but helpful)
- ruby/bundler (if working in `./docs`)

## Repository Structure

|Directory|Ecosystem|Purpose|
|---|---|---|
|`td.vue`|Vue3, Electron|Front-end that can be used as a stand-alone static site, paired with the td.server, or bundled as a standalone Electron app.|
|`td.server`|Node.js, Express.js|Optional backend server for more advanced features, such as OAuth integration and multiple data stores.|
|`docs`|Ruby/Jekyll|Public documentation site|
|`scripts`|Bash/sh|small maintainer helper scripts for repeatable local tasks|

## Coding Rules

- Consistent code style is more important than theoretical perfection. Read nearby code before editing.
- Breaking changes requiring a Threat Dragon major version bump are prohibited.
- Comments should explain non-obvious constraints or decisions only. Avoid comments that restate the code.
- Treat auth, tokens, repository access, file access, and generated artifacts as security-sensitive surfaces.
- Pull requests must be tightly scoped and easily reviewed by maintainers. Humans will be reviewing all changes
  - PRs with > 20 files are not sustainable.
  - Break it down into smaller practical PRs, OR
  - have the human seek explicit consent from the maintainers before opening a large PR.

## Supply Chain / Dependencies

- ALL dependencies must have a minimum release age of 10 days
- No updates to lock-files unless intentionally doing dependency work
- GitHub Actions must be pinned to full commit SHAs with an inline version comment for Dependabot
- GitHub Actions have the same 10 day minimum release age requirement
- Prefer small helper scripts over new dependencies when reasonable
- A human may override the 10-day cooldown in an emergency

## Tests And Coverage

For `td.vue` and `td.server`, unit testing is a hard requirement.

- All new code must have at least 95% coverage for statements, branches, functions, and lines
- Existing code that's updated should be brought to the same coverage threshold
- Prefer one assertion per test to help readability
- Follow existing patterns for new or updated tests
- e2e tests should be added for new user-facing behavior and integration flows
- Never update visual baselines without explicit human approval

## Quality Gates

Use the workflows in `.github/workflows/` as the source of truth.
Before handoff, run the relevant local checks and say exactly what was not run.
Not all quality gates are required for every change: if only working in `td.vue`,
only those quality gates are required to be run.

### td.vue

The following quality gates are required:

- `npm run lint`
- `npm run lint:desktop`
- `npm run test`
- `npm run test:desktop`
- `npm run test:e2e`
- `npm run test:e2e:desktop`

### td.server

The following quality gates are required when changes are made in `td.server`:

- `npm run lint`
- `npm run test`

### docs

- Docs checks are for validation only: markdown lint, spellcheck, link check, and docs build where available

### Root level checks

- `npm run markdown:lint`
- Spellcheck is not available as an npm command. You can run it if:
  - the user has or approves installing pyspelling
  - the `en` dictionary is installed
  - `pyspelling -c .spellcheck.yaml`

### Security

- When adding dependencies: `scripts/td-trivy-check.sh`
- Ensure that `npm audit` does not report new vulnerabilities based on your work

## Directory Specific Context

### `td.vue/`

- `td.vue` is both the web client and Electron desktop app.
- Desktop-specific behavior belongs under the existing desktop patterns and should run desktop lint/tests.
- Keep accessibility in scope for UI changes. Do not rely on color alone for meaning.
- You do not need to build/test every desktop distribution.
  - On Linux, you could use `scripts/td-build-desktop-linux-appimage.sh`.
- Desktop specific code should be electron-specific code, or for a feature that only exists for desktop.
  - For most features, prefer updating the Vue app.
- Never make breaking changes that would require a semver major version bump of Threat Dragon

### `td.server/`

- Preserve auth, session, repository integration, and audit behavior unless the task explicitly changes them.
- Server changes need unit coverage and should exercise error paths.
- Keep environment variable behavior compatible with `example.env`, `minimal.env`, Docker, and CI.
- NEVER log secrets, tokens, model contents, or repository credentials.
- Never make breaking changes that would require a semver major version bump of Threat Dragon

### `docs/`

- Agents do not write public documentation pages.
- Agents may validate human-authored docs with markdown formatting, spellcheck, link checks, and local docs builds.
- If code behavior changes and docs need updates, report the exact docs gap for a human author.

### Maintainer Scripts

The `./scripts` directory contains helper scripts. Please see the `./scripts/README.md` for inventory and purpose.
New scripts are welcome if they are highly reusable, automate common tasks, or provide developer and maintainer value.
Keep scripts small, dependency-light, documented with `--help`, and aligned with CI behavior.
