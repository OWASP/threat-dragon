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
End to end testing is done using [cypress](https://www.cypress.io/), and lives in the `td.vue/tests/e2e` directory.

### Run test:e2e
To run the e2e tests locally, navigate to the `td.vue` directory and run:
- `pnpm install`
- `npm run test:e2e`

This will open the cypress runner application and load the suite of tests from `tests/e2e/specs`.
From the cypress window you can select individual tests to run, or run all tests at once.
This suite of tests uses cypress plugin file `cypress.json` which calls `td.vue/tests/e2e/plugins/index.js`

### Run test:e2e:local
This suite of tests is identical to `test:e2e` but the target is an application already running at `http://localhost:8080/`.
To run these tests there first has to be a running web application, for example:
- from directory `td.vue` invoke `npm run dev`
- wait for the web app to be accessible on `http://localhost:8080/`

From a separate terminal in directory `td.vue` invoke:
- `npm run test:e2e:local`

A cypress runner application is opened as above, loading the suite of tests from `tests/e2e/specs`..
This suite of tests uses cypress plugin file `cypress.local.json` which calls `td.vue/tests/e2e/plugins/local.js`

### Run test:e2e-ci
This suite of tests is similar to `test:e2e` but is run in headless mode, so that it can be used for the CI pipeline.
It uses the same cypress plugin file as `test:e2e`, `cypress.json`, which calls `td.vue/tests/e2e/plugins/index.js`.

It is run against an existing application on `http://localhost:3000/`, using port 3000 rather than 8080.
The suite of tests is loaded from `tests/e2e/specs`.

For local testing of this script, an instance of the docker file can be used to map port 3000:
- from top directory run `docker run -it --rm -p 3000:3000 -v $(pwd)/.env:/app/.env owasp-threat-dragon:dev`
- from directory `td.vue` invoke `npm run test:e2e-ci`

### Run test:e2e-nightly
The e2e nightly relies on the demo server to be running at `https://www.threatdragon.com/`,
and uses browserstack to test against various browsers (see below).

Ensure the demo server is running and then invoke:
- `npm run test:e2e-nightly`

The browserstack suite of tests uses cypress plugin file `cypress.nightly.json` which calls `td.vue/tests/e2e/plugins/nightly.js`.
The browserstack configuration file is `browserstack.nightly.json`, and the suite of tests from is loaded from `tests/e2e/specs`.

### Run test:e2e-smokes
The e2e smoke tests rely on the demo server to be running at `https://www.threatdragon.com/`,
and uses browserstack to test against various browsers.

Ensure the demo server is running and then invoke:
- `npm run test:e2e-smokes`

The browserstack suite of tests uses cypress plugin file `cypress.smokes.json` which calls `td.vue/tests/e2e/plugins/smokes.js`.
The browserstack configuration file is `browserstack.smokes.json`, and the suite of tests from is loaded from `tests/e2e/smokes`.

### Run test:e2e-smokes:local
This suite of tests is similar to `test:e2e-smokes` but does not use browserstack for various browser tests - just chrome.
The target is an existing application running at `http://localhost:8080/`.

To run these tests there first has to be a web application on `http://localhost:8080/`:
- from top directory run `docker run -it --rm -p 8080:3000 -v $(pwd)/.env:/app/.env owasp-threat-dragon:dev`
- check the web app is accessible on `http://localhost:8080/` and docs on `http://localhost:8080/docs/`

From a separate terminal in directory `td.vue` invoke:
- `npm run test:e2e-smokes:local`

This will open the cypress runner application, with the suite of tests from loaded from `tests/e2e/smokes`.
This suite of tests uses cypress plugin file `cypress.smokes.local.json` which calls `td.vue/tests/e2e/plugins/smokes.local.js`

### Run test:e2e-ci-smokes
This suite of tests is similar to `test:e2e-smokes:local` but is run in headless mode, so that it can be used for the CI pipeline.
It uses cypress plugin file `cypress.smokes.ci.json` which calls `tests/e2e/plugins/smokes.ci.js`.

It is run against an existing application on `http://localhost:3000/`, using port 3000 rather than 8080.
The suite of tests from is loaded from `tests/e2e/smokes`.

For local testing of this script, an instance of the docker file can be used to map ports 3000:
- from top directory run `docker run -it --rm -p 3000:3000 -v $(pwd)/.env:/app/.env owasp-threat-dragon:dev`
- check the web app is accessible on `http://localhost:3000/` and docs on `http://localhost:3000/docs/`
- from directory `td.vue` invoke `npm run test:e2e-ci-smokes`

## Cross Browser Testing

At the time of writing Cypress has some limitations as far as browser support,
which is currently being worked on in their repository.
For example Cypress does not yet support testing on Safari browser.

We are currently testing Chrome and Firefox on Windows 10, Windows 11, and on MacOS both Big Sur and Monterey.
The Edge browser is tested only on Windows 10.
The versions tested are the latest stable version as well as the previous.

{:.table .table-striped}
| |Windows 10|Windows 11|MacOS Big Sur|MacOS Monterey|
|---|---|---|---|---|
|Chrome Latest| yes | yes | yes | yes |
|Chrome Previous| yes | yes | yes | yes |
|Firefox Latest| yes | yes | yes | yes |
|Firefox Previous| yes | yes | yes | yes |
|Edge Latest| yes | <strong class="text-danger">no</strong> | <strong class="text-danger">no</strong> | <strong class="text-danger">no</strong> |
|Edge Previous| yes | <strong class="text-danger">no</strong> | <strong class="text-danger">no</strong> | <strong class="text-danger">no</strong> |

## Writing E2E Tests

If you are new to cypress, we strongly suggest reading through the
[Introduction to Cypress](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress).
Cypress is significantly different from many of the existing webdriver based frameworks and has a bit of a learning curve.
The introduction document is a bit lengthy, but does a wonderful job of preparing you to begin writing tests using cypress.

A full test suite lives in `td.vue/tests/e2e/specs`.  This is where most of the functional e2e tests should live.

A smaller subset of tests, called "smoke tests", live in `td.vue/tests/e2e/smokes`.
Smoke tests are run against a deployment as a sanity check to ensure that the deployment succeeded
and there are no glaring issues in the deployment.
Smoke tests should be quick and only check the bare basics.
