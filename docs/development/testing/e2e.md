---
layout: page
title: End to End Testing
nav_order: 1
path: /testing/e2e
group: Testing
---

# End to End Testing

<div class="card">
  <div class="card-header">
    What is End to End Testing... and why?
  </div>
  <div class="card-body">
    <p class="card-text">
        End to end tests are executed against a full, running instance of the application.
        They are intended to mock user behavior and asserting that the the application behaves as expected.
        While it's not practical to cover every possible user interaction,
        we strive to cover the intended flows that our users would take.
        Finally, E2E testing is the last step before deploying in our continuous delivery pipeline.
        We want to make sure that the quality is there before releasing it!
    </p>
  </div>
</div>

## Running E2E Tests
End to end testing is done using [cypress](https://www.cypress.io/).
The full test suite is in `td.vue/tests/e2e/specs`
and this is where most of the functional e2e tests should live.

A smaller subset of tests, called "smoke tests", live in `td.vue/tests/e2e/smokes`.
Smoke tests are run against a deployment as a sanity check to ensure that the deployment succeeded
and there are no glaring issues in the deployment.
Smoke tests should be quick and only check the bare basics.

You may need to install `vue-cli-service` if you are running some of the tests locally.
If you get errors such as `vue-cli-service: command not found`
then run command `pnpm install -g @vue/cli` from the root directory.

### Run test:e2e
To run the e2e tests locally, navigate to the `td.vue` directory and run:
- `pnpm install`
- `pnpm test:e2e`

This will open the cypress runner application and load the suite of tests from `tests/e2e/specs`.
From the cypress window you can select individual tests to run, or run all tests at once.
This suite of tests uses cypress configuration file `e2e.local.config.js`.

A quick test can be done using command `pnpm test:vue`,
from either the root directory or the `td.vue` directory.
This runs the same suite of tests but in headless mode using an electron server back-end.

### Run test:e2e:local
This suite of tests is identical to `test:e2e`
but the target is an application already running at `http://localhost:8080/`.
To run these tests there first has to be a running web application, for example:
- from directory `td.vue` invoke `pnpm dev`
- wait for the web app to be accessible on `http://localhost:8080/`

From a separate terminal in directory `td.vue` invoke:
- `pnpm test:e2e:local`

A cypress runner application is opened as above, loading the suite of tests from `tests/e2e/specs`.
This suite of tests uses cypress configuration file `e2e.local.config.js`.

### Pipeline test:e2e-ci
This suite of tests is run in headless mode so that it can be used for the CI pipeline.
It uses cypress configuration file `e2e.ci.config.js` and runs the `tests/e2e/specs` suite of tests.

The tests are run against an existing application on `http://localhost:3000/`,
using port 3000 rather than 8080.

For local testing of this script, an instance of the docker file can be used to map port 3000:
- from top directory run `docker run -it --rm -p 3000:3000 -v $(pwd)/.env:/app/.env owasp-threat-dragon:dev`
- from directory `td.vue` invoke `pnpm test:e2e-ci`

These tests are run by the CI pipeline after a successful deploy.

### BrowserStack test:e2e-nightly
The online BrowserStack nightly tests use various browsers to run the tests
listed in configuration file `browserstack.nightly.json`.
The BrowserStack configuration uses cypress configuration file `e2e.nightly.config.js`
and the suite of tests from is loaded from `tests/e2e/specs`. 

The e2e nightly tests rely on the demo server to be running at `https://www.threatdragon.com/`.

These tests are run by the `browserstack` github nightly action using command `pnpm test:e2e-nightly`.
Test and debug these pipelines using github rather than from the local command line.

To check the configuration file `e2e.nightly.config.js` run this command from directory `td.vue` :

- `vue-cli-service test:e2e -C e2e.nightly.config.js --browser firefox --headless --url 'https://www.threatdragon.com/'`

### BrowserStack test:e2e-smokes
The e2e pipeline Browserstack smoke tests rely on the demo server
running at `https://www.threatdragon.com/` and the scripts use command `pnpm test:e2e-smokes`.
Test and debug these pipelines using github rather than from the local command line.

The browserstack configuration file is `browserstack.smokes.json`
which uses cypress configuration file `e2e.smokes.config.js`
and the suite of tests is loaded from `tests/e2e/specs/smokes`.

These tests are run by the `deploy` github action.
To check the configuration file `e2e.smokes.config.js` run this command from directory `td.vue` :

- `vue-cli-service test:e2e -C e2e.smokes.config.js --browser firefox --headless --url 'https://www.threatdragon.com/'`

### Run test:e2e-smokes:local
This suite of tests is similar to `test:e2e-smokes`
but does not use browserstack for various browser tests - just chrome.
The target is an existing application running at `http://localhost:8080/`
along with the documentation pages at `http://localhost:8080/docs/`.

To run these tests there first has to be a running web application, for example:
- from directory `td.vue` invoke `pnpm dev`
- wait for the web app to be accessible on `http://localhost:8080/`

From a separate terminal in directory `td.vue` run command `pnpm test:e2e-smokes:local` .

This will open the cypress runner application.
This suite of tests uses cypress configuration file `e2e.smokes.local.config.js`,
with the suite of tests loaded from `tests/e2e/specs/smokes`.

### Pipeline test:e2e-ci-smokes
This suite of tests is similar to `test:e2e-smokes`
but is run in headless mode so that it can be used for the CI pipeline.
It uses cypress configuration file `e2e.smokes.ci.config.js`
with the suite of tests loaded from `tests/e2e/specs/smokes`.

It is run against an existing application on `http://localhost:3000/`,
using port 3000 rather than 8080.

For local testing of this script, an instance of the docker file can be used to map ports 3000:
- from top directory run `docker run -it --rm -p 3000:3000 -v $(pwd)/.env:/app/.env owasp-threat-dragon:dev`
- check the web app is accessible on `http://localhost:3000/`
- check docs pages are on `http://localhost:3000/docs/`
- from directory `td.vue` invoke `pnpm test:e2e-ci-smokes`

These tests are used by the CI pipeline to determine if the deploy was successful or not.

## Cypress use of Electron
Cypress uses the Electron server as a backend server, and has the Electron browser/renderer built in.
When running locally some tests do not (as of Cypress version 12.x) run correctly.
This means that it is good to choose a browser that is not Electron from the UI,
and that some scripts that run in headless mode specify a different browser (such as Firefox).

This is not a problem with the BrowserStack tests because here a specific browser is configured for each test run.

## Writing E2E Tests
If you are new to cypress, we strongly suggest reading through the
[Introduction to Cypress](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress).
The introduction document is a bit lengthy,
but does a good job of preparing you to begin writing tests using cypress.

Note that
* `td.vue/e2e.ci.config.js` and `td.vue/e2e.smokes.ci.config.js` are used by the CI pipeline on pull-request and merge
* `td.vue/e2e.smokes.config.js` is used by the CI pipeline on merge/deploy
* `td.vue/e2e.nightly.config.js` is for the scheduled daily tests
* `td.vue/e2e.local.config.js` and `td.vue/e2e.smokes.local.config.js` are useful in a local development environment
