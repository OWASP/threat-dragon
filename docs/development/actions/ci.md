---
layout: page
title: CI
nav_order: 1
path: /actions/ci
group: Actions
---
# CI Action
The CI Action is Threat Dragon's continuous integration pipeline.  This pipeline is run on all branches and serves as a sanity check.  When a pull request is opened, each step of this pipeline is added as a check to the pull request.  This gives the author and reviewers an opportunity to understand the state of the code.

Because this action uses a docker image that is pushed to a remote repository for testing, there is a concurrency group that prevents concurrent runs of the same action.

## Steps

{:.table .table-striped}
|Name|Description|Dependencies|
|---|---|---|
|server_unit_tests|Runs the `td.server` unit tests and reports coverage to codecov.io|N/A|
|site_unit_tests|Runs the `td.vue` unit tests and reports coverage to codecov.io|N/A|
|docker_build_and_publish|Builds the docker image from source and pushes it to a specific tag that is reserved for testing.|`site_unit_tests`, `server_unit_tests`|
|e2e_smokes|Runs the E2E smoke tests against the freshly built web app.  Videos of the E2E tests are added as a build artifact|`docker_build_and_publish`|
|e2e_tests|Runs the E2E tests against the freshly built web app.  Videos of the E2E tests are added as a build artifact|`docker_build_and_publish`|
|zap_scan_web|Runs the [OWASP ZAP Baseline Scan](https://www.zaproxy.org/docs/docker/baseline-scan/) against the freshly built web app. (DAST)|`docker_build_and_publish`|
|zap_scan_docs|Runs the [OWASP ZAP Baseline Scan](https://www.zaproxy.org/docs/docker/baseline-scan/) against the freshly built documentation site. (DAST)|`docker_build_and_publish`|
|scan_image_with_trivy|Runs [Trivy](https://github.com/aquasecurity/trivy) against the freshly built image.  This scans for issues on the filesystem (installed packages) as well as vulnerabile dependencies in the application.|`docker_build_and_publish`|
