---
layout: page
title: Trivy
nav_order: 4
path: /actions/trivy
group: Actions
---
# Trivy Container Scan

[Trivy](https://github.com/aquasecurity/trivy) is an open-source container and artifact vulnerability scanning tool.

The trivy action is configured to run once a day to identify unpatched vulnerabilities in the docker image.
This is run per commit, as well as on a cron.
The cron-based action will alert maintainers in GitHub's security tab, as it will check the main branch daily.
The per-commit check will fail a build and print the results in the corresponding action.
This is only run against the production docker image at the time of writing.
