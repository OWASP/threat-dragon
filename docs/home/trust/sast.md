---
layout: page
title: SAST
nav_order: 2
path: /security/sast
group: Trust
---

# Static Application Security Testing (SAST)
Static application security testing is the process of examining code at rest to identify potential vulnerabilities and misconfigurations.
This is provided by [LGTM](https://lgtm.com/) and is run as part of every pull request.
Pull requests will LGTM failures will not be accepted unless the alert is proven to be a false/positive.
