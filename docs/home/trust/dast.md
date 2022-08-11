---
layout: page
title: DAST
nav_order: 3
path: /security/dast
group: Trust
---

# Dynamic Application Security Testing (SAST)
Static application security testing is the process of testing code that is running to identify potential vulnerabilities and misconfigurations.
This is provided by [OWASP ZAP](https://www.zaproxy.org/docs/docker/about/) and is run as part of every commit.

ZAP scan results are attached to the output of an action.
An ignore-list is maintained as a TSV (tab separated values, careful what editor you use).
Any modifications to the exclusions should be approved by a maintainer as part of a pull request.

The ZAP scans are run against the main site and the documentation site.
Even though they are hosted on the same server and in the same container, they are architected and behave differently.
