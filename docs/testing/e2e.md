---
layout: page
title: End to end testing
nav_order: 2
path: /testing/e2e
group: Testing
---

## End to end testing

Running the end-to-end (e2e) tests uses the [cypress](https://www.cypress.io/) test framework.
The full test suite is in `td.vue/tests/e2e/specs` and this is where most of the functional e2e tests should live.

A smaller subset of tests, the 'smoke tests', live in `td.vue/tests/e2e/smokes`.
Smoke tests are run against a deployment as a sanity check to ensure that the deployment succeeded
and there are no glaring issues in the deployment.
Smoke tests should be quick and only check the bare basics.

The end-to-end tests rely on `vue-cli-service` to run locally on the command line.
If there are errors such as `vue-cli-service: command not found`
then run command `npm install -g @vue/cli` from the root directory of the Threat Dragon source tree.

### Run e2e tests

To run the `test:e2e` tests locally, navigate to the `td.vue` directory and run:

```sh
npm install
npm run test:e2e
```

This will open the cypress runner application and load the suite of tests from `tests/e2e/specs`.
From the cypress window you can select individual tests to run, or run all tests at once.
This suite of tests uses cypress configuration file `e2e.local.config.js`.

A quick test can be done using command `npm run test:vue`,
from either the root directory or the `td.vue` directory.
This runs the same suite of tests but in headless mode using the cypress/electron server back-end.

## Run desktop e2e tests

The `test:e2e:desktop` desktop application end-to-end tests can be run
using `npm run test:e2e:desktop` from `td.vue` directory.

### Run e2e tests for localhost

The `test:e2e:local` suite of tests is identical to `test:e2e`
but the target is an application already running at `http://localhost:8080/`.
To run these tests there first has to be a running web application, for example:

- from directory `td.vue` invoke `npm run start:serve`
- wait for the web app to be accessible on `http://localhost:8080/`
- from `td.vue` invoke: `npm run test:e2e:local`

A cypress runner application is opened as above, loading the suite of tests from `tests/e2e/specs`.
This suite of tests uses cypress configuration file `e2e.local.config.js`.

The application under test can be stopped using `npm run stop:serve`.

### Pull request pipeline e2e tests

The `test:e2e-pr` test suite is run from a local host running on `http://localhost:8080/` similar to above,
using configuration file `e2e.local.config.js`.

- from directory `td.vue` invoke `npm run start:serve`
- wait for the web app to be accessible on `http://localhost:8080/`
- from `td.vue` invoke: `npm run test:e2e-pr`
- halt the test application with `npm run stop:serve`

These tests are run by the pull request pipeline on creation and new commits.

### CI pipeline e2e tests

The `test:e2e-ci` suite of tests is run in headless mode so that it can be used for the CI pipeline.
It uses cypress configuration file `e2e.ci.config.js` and runs the `tests/e2e/specs` suite of tests.

The tests are run against an existing application on `http://localhost:3000/`, using port 3000 rather than 8080.

For local testing of this script, an instance of the docker file can be used to map port 3000:

- from top directory run `docker run -it --rm -p 3000:3000 -v $(pwd)/.env:/app/.env owasp-threat-dragon:dev`
- from directory `td.vue` invoke `npm run test:e2e-ci`

These tests are run by the CI pipeline after a successful deploy.

### BrowserStack e2e nightlies

The `test:e2e-nightly` online [BrowserStack][browserstack] nightly tests use various browsers to run the tests
listed in configuration file `browserstack.nightly.json`.
The BrowserStack configuration uses cypress configuration file `e2e.nightly.config.js`
and the suite of tests from is loaded from `tests/e2e/specs`.

The e2e nightly tests rely on the demo server to be running at `https://www.threatdragon.com/`.

These tests are run by the `browserstack` github nightly action using command `npm run test:e2e-nightly`.
Test and debug these pipelines using github rather than from the local command line.

To check the configuration file `e2e.nightly.config.js` run this command from directory `td.vue` :

- `vue-cli-service test:e2e -C e2e.nightly.config.js --browser chromium --headless --url 'https://www.threatdragon.com/'`

### BrowserStack e2e smoke tests

The `test:e2e-smokes` BrowserStack pipeline smoke tests rely on the demo server running at `https://www.threatdragon.com/`.
Test and debug these pipelines using github rather than from the local command line.

The BrowserStack configuration file is `browserstack.smokes.json`
which uses cypress configuration file `e2e.smokes.config.js`.
These tests are run by the `deploy` github action using command `npm run test:e2e-smokes`
with the suite of tests loaded from `tests/e2e/specs/smokes`.

To check the configuration file `e2e.smokes.config.js` run this command from directory `td.vue` :

- `vue-cli-service test:e2e -C e2e.smokes.config.js --browser chromium --headless --url 'https://www.threatdragon.com/'`

### Run local e2e smoke tests

This suite of tests is similar to the BrowserStack e2e smoke tests
but does not use BrowserStack for various browser tests - just chrome.
The target is an existing application running at `http://localhost:8080/`
along with the documentation pages at `http://localhost:8080/docs/`.

To run these tests there first has to be a running web application, for example:

- from directory `td.vue` invoke `npm run start:serve`
- wait for the web app to be accessible on `http://localhost:8080/`
- run command `npm run test:e2e-smokes:local`
- halt the test application with `npm run stop:serve`

This will open the cypress runner application.
This suite of tests uses cypress configuration file `e2e.smokes.local.config.js`,
with the suite of tests loaded from `tests/e2e/specs/smokes`.

### Pull-request pipeline e2e smoke tests

The `test:e2e-pr-smokes` suite of tests is similar to the local e2e smoke tests
but is run in headless mode so that it can be used for the pull request pipeline.
It uses cypress configuration file `e2e.smokes.ci.config.js` with the test suite loaded from `tests/e2e/specs/smokes`.

The target is an existing application running at `http://localhost:8080/`,
to run these tests :

- from directory `td.vue` invoke `npm run start:serve`
- wait for the web app to be accessible on `http://localhost:8080/`
- run command `npm run test:e2e-pr-smokes`
- halt the test application with `npm run stop:serve`

### CI pipeline e2e smoke tests

The `test:e2e-ci-smokes` suite of tests is similar to the PR pipeline e2e smoke tests but is used for the CI pipeline.
It uses cypress configuration file `e2e.smokes.ci.config.js` with the test suite loaded from `tests/e2e/specs/smokes`.

It is run against an existing application on `http://localhost:3000/` using port 3000 rather than 8080.

For local testing of this script, an instance of the docker file can be used to map ports 3000.
Decide on the docker image to test, for example `owasp/threat-dragon:stable` or `threatdragon/owasp-threat-dragon:PR-943`.

- from top directory run `docker run -it --rm -p 3000:3000 -v $(pwd)/.env:/app/.env owasp-threat-dragon:dev`
or if not using an environment variable file then run a docker container using:

```sh
docker run -d --rm \
    -p 3000:3000 \
    -e ENCRYPTION_JWT_REFRESH_SIGNING_KEY='***' \
    -e ENCRYPTION_JWT_SIGNING_KEY='***' \
    -e ENCRYPTION_KEYS='***' \
    -e GITHUB_CLIENT_ID='***' \
    -e GITHUB_CLIENT_SECRET='***' \
    -e NODE_ENV='development' \
    --platform linux/x86_64 \
    -e SERVER_API_PROTOCOL='http' \
    owasp-threat-dragon:dev
```

- check the web app is accessible on `http://localhost:3000/`
- from directory `td.vue` invoke `npm run test:e2e-ci-smokes`

### Visual Regression Tests

Visual regression tests do a pixel by pixel comparison of the running application
against baseline images. These tests are intended to flag UI regressions.

The threshold is intentionally set low with a pixel ratio of `0.01`.  
Baseline images are stored in `td.vue/tests/e2e/visual/baselines`

These tests run against Chrome. There can be some minor differences between
Chrome versions. The pull request workflow has a specific version pinned.

To run visual regressions locally, from `td.vue` run `npm run test:visual`

When intentional changes are made to the UI, you may need to regenerate the visual
baselines with `npm run test:visual:update`.

## Cypress use of Electron

Cypress uses the Electron server as a backend server, and has the Electron browser/renderer built in.
When running locally some tests do not (as of Cypress version 12.x) run correctly.
This means that it is good to choose a browser that is not Electron from the UI,
and that those scripts that run in headless mode specify a different browser (such as Firefox).

This is not a problem with the BrowserStack tests because a specific browser is configured for each test run.

## Writing e2e tests

If you are new to cypress, we strongly suggest reading through the
[Introduction to Cypress](https://docs.cypress.io/app/core-concepts/introduction-to-cypress).
The introduction document is a bit lengthy,
but does a good job of preparing you to begin writing tests using cypress.

Note that

- `td.vue/e2e.ci.config.js` and `td.vue/e2e.smokes.ci.config.js` are used by the CI pipeline on pull-request and merge
- `td.vue/e2e.smokes.config.js` is used by the CI pipeline on merge/deploy
- `td.vue/e2e.nightly.config.js` is for the scheduled daily tests
- `td.vue/e2e.local.config.js` and `td.vue/e2e.smokes.local.config.js` are useful in a local development environment

----

Threat Dragon: _making threat modeling less threatening_

[browserstack]: https://www.browserstack.com/
