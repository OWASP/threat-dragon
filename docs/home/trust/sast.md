---
layout: page
title: SAST
nav_order: 2
path: /security/sast
group: Trust
---

# Static Application Security Testing (SAST)
Static application security testing is the process of examining code at rest to identify potential vulnerabilities and misconfigurations.
This is provided by [CodeQL](https://securitylab.github.com/tools/codeql/) and is run as part of every pull request.
Pull requests with CodeQL failures will not be accepted unless the alert is proven to be a false/positive.
