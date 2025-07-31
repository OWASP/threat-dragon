---
layout: page
title: Container scanning
nav_order: 4
path: /trust/container
group: Trust
---

## Container scanning

[Trivy](https://github.com/aquasecurity/trivy) identifies known vulnerable packages inside the container,
and scans the built container as part of each commit and pull-request.
It is also run as a nightly cron job against the default branch.

The GitHub action will fail if Trivy identifies _any_ vulnerabilities; this is strict by design.
If vulnerabilities are discovered then the maintainers are alerted via GitHub's security tab.

A `.trivyignore` file is maintained at the root of this repo that allows CVEs to be ignored.
A comment with a justification should be added above any ignored CVE.

----

Threat Dragon: _making threat modeling less threatening_
