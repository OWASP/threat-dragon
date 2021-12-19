---
layout: page
title: Container Scanning
nav_order: 4
path: /security/container-scanning
group: Trust
---

# Container Scanning
[Trivy](https://github.com/aquasecurity/trivy) scans the built container as part of each commit and PR.  The GitHub action will fail if it identifies _any_ vulnerabilities.  This is strict by design.  It identifies known vulnerable packages inside the container.  It is also run as a cron, daily, against the default branch.  If _any_ vulnerabilities are discovered, it will alert maintainers via GitHub's security tab.

