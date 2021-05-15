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
        End to end tests are executed against a full, running instance of the application.  They are intended to mock user behavior and asserting that the the application behaves as expected.  While it's not practical to cover every possible user interaction, we strive to cover the intended flows that our users would take.  Finally, E2E testing is the last step before deploying in our continuous delivery pipeline.  We want to make sure that the quality is there before releasing it!
    </p>
  </div>
</div>

## Running E2E Tests

End to end testing is done using [cypress](https://www.cypress.io/), and lives in the `td.vue/tests/e2e` directory.  To run the tests locally, navigate to the `td.vue` directory and run:
- `npm install`
- `npm run test:e2e`

This will open the cypress runner application.  From there, you can select individual tests to run, or run all tests at once.

## Cross Browser Testing

At the time of writing, Cypress has some limitations as far as browser support.  That is currently being worked on in their repository.  We are currently testing Chrome, Firefox and Edge on Windows 10, as well as Chrome and Firefox on MacOS Big Sur.  The versions tested are the latest stable version as well as the previous.

{:.table .table-striped}
| |Windows 10|MacOS Big Sur|
|---|---|---|
|Chrome Latest| yes | yes |
|Chrome Previous| yes | yes |
|Firefox Latest| yes | yes |
|Firefox Previous| yes | yes |
|Edge Latest| yes | <strong class="text-danger">no</strong> |
|Edge Previous| yes | <strong class="text-danger">no</strong> |
|Safari| <strong class="text-danger">no</strong> | <strong class="text-danger">no</strong> |
|Electron|(manual only)|(manual only)|

## Writing E2E Tests

If you are new to cypress, we strongly suggest reading through the [Introduction to Cypress](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress).  Cypress is significantly different from many of the existing webdriver based frameworks and has a bit of a learning curve.  The introduction document is a bit lengthy, but does a wonderful job of preparing you to begin writing tests using cypress.
