---
layout: page
title: CodeQL
nav_order: 3
path: /actions/codeql
group: Actions
---

# GitHub Actions

[GitHub Actions](https://docs.github.com/en/actions/reference) are used to test, build and deploy Threat Dragon.
These actions live in the `.github/workflows` directory.

## CodeQL

[CodeQL](https://securitylab.github.com/tools/codeql/) is a static analysis scanner provided by GitHub.
This tool is a Static Analysis Security Tool (SAST) that Threat Dragon uses as an additional measure to identify vulnerabilities.
This is another check that is run against pull requests going into the main branch.
