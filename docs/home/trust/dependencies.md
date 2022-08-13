---
layout: page
title: Dependencies
nav_order: 1
path: /security/dependencies
group: Trust
---

# Dependency Management
The following controls are in place to assist with dependency management:
- pnpm for dependency resolution and auditing
- Trivy scanning per commit for SCA and OS dependency management within docker
- Trivy scanning daily on the latest build in the default branch
- Dependabot alerts

## Fixing a vulnerable dependency
If your build fails due to a trivy alert, try to find the part of the application that has the vulnerable component.
In the root directory of that component (where the package.json lives), run `pnpm audit`.
If there is a dependency with a known vulnerability, it should show you.
You can then run `pnpm audit fix`, which will add an entry to the "pnpm" property in the package.json.
This follows the standard versioning format used in package.json dependencies.
_After_ running pnpm audit fix, the `pnpm-lock.yaml` file will need to be updated.
To update it, run `pnpm install`.

This should be done at the package level and the root level when possible to protect developers as well as production environments.
