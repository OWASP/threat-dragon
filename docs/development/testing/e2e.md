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
The full test suite is in `td.vue/tests/e2e/specs` and this is where most of the functional e2e tests should live.

A smaller subset of tests, called "smoke tests", live in `td.vue/tests/e2e/smokes`.
Smoke tests are run against a deployment as a sanity check to ensure that the deployment succeeded
and there are no glaring issues in the deployment.
Smoke tests should be quick and only check the bare basics.

You may need to install `vue-cli-service` if you are running some of the tests locally.
If you get errors such as `vue-cli-service: command not found` then run command `pnpm install -g @vue/cli` from the root directory.

### Run test:e2e
To run the e2e tests locally, navigate to the `td.vue` directory and run:
- `pnpm install`
- `pnpm test:e2e`

This will open the cypress runner application and load the suite of tests from `tests/e2e/specs`.
From the cypress window you can select individual tests to run, or run all tests at once.
This suite of tests uses cypress configuration file `e2e.config.js`.

A quick test can be done using command `pnpm test:vue`, from either the root directory or the `td.vue` directory.
This runs the same suite of tests but in headless mode using an electron server back-end.

### Run test:e2e:local
This suite of tests is identical to `test:e2e` but the target is an application already running at `http://localhost:8080/`.
To run these tests there first has to be a running web application, for example:
- from directory `td.vue` invoke `pnpm dev`
- wait for the web app to be accessible on `http://localhost:8080/`

From a separate terminal in directory `td.vue` invoke:
- `pnpm test:e2e:local`

A cypress runner application is opened as above, loading the suite of tests from `tests/e2e/specs`.
This suite of tests uses cypress configuration file `e2e.local.config.js`.

### Run test:e2e-ci
This suite of tests is similar to `test:e2e` but is run in headless mode, so that it can be used for the CI pipeline.
It uses the same cypress configuration file `e2e.config.js` and the same suite of tests `tests/e2e/specs`.

The tests are run against an existing application on `http://localhost:3000/`, using port 3000 rather than 8080.

For local testing of this script, an instance of the docker file can be used to map port 3000:
- from top directory run `docker run -it --rm -p 3000:3000 -v $(pwd)/.env:/app/.env owasp-threat-dragon:dev`
- from directory `td.vue` invoke `pnpm test:e2e-ci`

### Browserstack test:e2e-nightly
The online Browserstack nightly tests use various browsers to run the tests in configuration file `browserstack.nightly.json`.
The Browserstack configuration uses cypress configuration file `e2e.nightly.config.js`
and the suite of tests from is loaded from `tests/e2e/specs`. 

The e2e nightly tests rely on the demo server to be running at `https://www.threatdragon.com/`.

Browserstack tests are run by the CI pipeline using command `pnpm test:e2e-nightly`.
Test and debug these pipelines using github rather than from the local command line

### Browserstack test:e2e-smokes
The e2e smoke tests rely on the demo server to be running at `https://www.threatdragon.com/`,
and use Browserstack to test against various browsers.

The pipeline tests rely on thedemo server running at `https://www.threatdragon.com/`
and the scripts use command`pnpm test:e2e-smokes`

The browserstack configuration file is `browserstack.smokes.json`
which uses cypress configuration file `e2e.smokes.config.js` 
and the suite of tests from is loaded from directory `tests/e2e/smokes`.

### Run test:e2e-smokes:local
This suite of tests is similar to `test:e2e-smokes` but does not use browserstack for various browser tests - just chrome.
The target is an existing application running at `http://localhost:8080/`
along with the documentation pages at `http://localhost:8080/docs/`.

To run these tests use the docker container web application:

- from top directory run `docker run -it --rm -p 8080:3000 -v $(pwd)/.env:/app/.env owasp-threat-dragon:dev`
- check that the web app is accessible on `http://localhost:8080/`
- check docs pages at `http://localhost:8080/docs/`

From a separate terminal in directory `td.vue` invoke:

- `pnpm test:e2e-smokes:local`

This will open the cypress runner application.
This suite of tests uses cypress configuration file `e2e.smokes.local.config.js`,
with the suite of tests from loaded from `tests/e2e/smokes`.

### Run test:e2e-ci-smokes
This suite of tests is similar to `test:e2e-smokes:local`
but is run in headless mode so that it can be used for the CI pipeline.
It uses cypress configuration file `e2e.smokes.ci.config.js`
with the suite of tests loaded from `tests/e2e/smokes`.

It is run against an existing application on `http://localhost:3000/`, using port 3000 rather than 8080.

For local testing of this script, an instance of the docker file can be used to map ports 3000:
- from top directory run `docker run -it --rm -p 3000:3000 -v $(pwd)/.env:/app/.env owasp-threat-dragon:dev`
- check the web app is accessible on `http://localhost:3000/`
- check docs pages are on `http://localhost:3000/docs/`
- from directory `td.vue` invoke `pnpm test:e2e-ci-smokes`

## Writing E2E Tests
Cypress is significantly different from many of the existing webdriver based frameworks
and has a bit of a learning curve.
If you are new to cypress, we strongly suggest reading through the
[Introduction to Cypress](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress).
The introduction document is a bit lengthy,
but does a good job of preparing you to begin writing tests using cypress.
