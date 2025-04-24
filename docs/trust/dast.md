---
layout: page
title: DAST
nav_order: 3
path: /trust/dast
group: Trust
---

## Dynamic Application Security Testing (DAST)

DAST is the process of testing code that is running to identify potential vulnerabilities and misconfigurations.
This is provided by [ZAP](https://www.zaproxy.org/docs/docker/about/) and is run as part of every commit.

ZAP scan results are attached to the output of an action.
An ignore-list is maintained as a TSV (tab separated values, careful what editor you use).
Any modifications to the exclusions should be approved by a maintainer as part of a pull request.

----

Threat Dragon: _making threat modeling less threatening_
