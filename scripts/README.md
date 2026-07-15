# Scripts

Helper scripts for local maintainer convenience; they are not part of the deployed application.
These scripts should be run from the root of the repository, such as `./scripts/td-pr-check.sh`.

***These scripts are maintained on a best-effort basis and may not always work
cross-platform. If something is not working for you, feel free to open a PR!***

Dependencies:

- Docker
- Node.js / npm
- Bash

| Script | Purpose |
| ------ | ------- |
| [`td-build-desktop-linux-appimage.sh`](./td-build-desktop-linux-appimage.sh) | Build Linux AppImage (amd64) |
| [`td-pr-check.sh`](./td-pr-check.sh) | Run local checks that emulate the PR workflow |
| [`td-trivy-check.sh`](./td-trivy-check.sh) | Run local Trivy scan (requires docker) |
| [`td-update-node-version.sh`](./td-update-node-version.sh) | Update Node version in docker and gh actions |
