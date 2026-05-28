---
layout: page
title: Dependency management
nav_order: 1
path: /trust/dependencies
group: Trust
---

## Dependency management

The following controls are in place to assist with dependency management of the web application:

- Trivy scanning per commit for SCA and OS dependency management within docker
- Trivy scanning daily on the latest build in the default branch
- Dependabot alerts
- Dependabot cooldowns and `npm` minimum release age set to 10 days
- `npm` version 11.10.0 or higher is required for dependency resolution, minimum release age, and auditing

### Fixing a vulnerable dependency

If your build fails due to a trivy alert, try to find the part of the application that has the vulnerable component.
In the root directory of that component (where the `package.json` lives), run `npm audit`.
This will advise on dependencies with known vulnerabilities and whether they can be fixed.
You can then run `npm audit fix` which updates the `package-lock.json` file.
To obtain the updated package run `npm install`.

This should be done at the package level and the root level when possible to protect developers
as well as production environments.

----

Threat Dragon: _making threat modeling less threatening_
