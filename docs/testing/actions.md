---
layout: page
title: Pipeline actions
nav_order: 3
path: /testing/actions
group: Testing
---

## Pipeline actions

[GitHub Actions](https://docs.github.com/en/actions/reference) are used to test, build and deploy Threat Dragon.
These actions live in the `.github/workflows` directory.

## PR Pipeline

The CI Action is Threat Dragon's continuous integration pipeline.
This pipeline is run on all branches and serves as a quality check.
When a pull request is opened, each step of this pipeline is added as a check to the pull request.
This gives the author and reviewers an opportunity to understand the state of the code.

Because this action uses a docker image that is pushed to a remote repository for testing,
there is a concurrency group that prevents concurrent runs of the same action.

## BrowserStack End to End Tests

[BrowserStack][browserstack] offers its services [for free to open-source projects][browserstack-os],
and has graciously provided Threat Dragon with their services.
BrowserStack provides automated, cross-browser testing for web and mobile applications.

Because cross browser testing has diminishing returns,
it is only run against the latest deployed version (from main) once per day.

## Housekeeping

The house-keeping workflow runs a nightly workflow, and will:

* delete stale actions
* check links across the documentation
* run Trivy container scans to identify unpatched vulnerabilities in the docker image
* run the [CodeQL](https://securitylab.github.com/tools/codeql/) is a static analysis scanner provided by GitHub

## CI Pipeline

The deploy action is run on any "push" to the main branch (this includes merged pull requests),
and serves as Threat Dragon's continuous delivery pipeline.

* Build:
    This workflow builds and pushes the staging image with the `latest` tag.
    The `latest` tag is not consider stable, and may be broken at times.
    While we do our best to maintain a fully functioning main branch, mistakes will happen.
    Additionally, the full end to end test suite is only run once per day, so errors may not be immediately available.
* Deploy: The latest image is deployed to [https://www.threatdragon.com/](https://www.threatdragon.com/).
* Smokes: Smoke tests are run against the deployed image to ensure the deployment succeeded.
* Rollback: If the smokes fail, the deployment is rolled back.

## Release Pipeline

This action runs for release tags in `vX.Y.Z` or `vX.Y.Z-RC<number>` format.
It tests, builds, and attests the release artifacts, publishes the versioned staging image,
and creates a draft GitHub release.
A final release also publishes the versioned and `stable` production images and the Snap package.
Release candidates do not update production or `stable` tags.

## Debugging

Debugging CI failures can be tricky, and often leads to unnecessary commits.
Contributors can run individual commands locally, but not all CI checks are in the node ecosystem.
To help debugging, there is a best-effort [bash script][td-pr-check] to emulate the PR pipeline.

----

Threat Dragon: _making threat modeling less threatening_

[browserstack]: https://www.browserstack.com/
[browserstack-os]: https://www.browserstack.com/open-source
[td-pr-check]: https://github.com/OWASP/threat-dragon/blob/main/scripts/td-pr-check.sh
