# Scripts

Helper scripts for local maintainer convenience; they are not part of the deployed application.
These scripts should be run from the root of the repository, such as `./scripts/td-pr-check.sh`.

| Script | Purpose |
| ------ | ------- |
| [`td-build-desktop-linux-appimage.sh`](./td-build-desktop-linux-appimage.sh) | Build Linux AppImage (amd64) |
| [`td-pr-check.sh`](./td-pr-check.sh) | Run local checks that emulate the PR workflow |
| [`td-trivy-check.sh`](./td-trivy-check.sh) | Run local Trivy scan (requires docker) |
| [`td-update-node-version.sh`](./td-update-node-version.sh) | Update Node version in docker and gh actions |
