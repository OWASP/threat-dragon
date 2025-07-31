---
layout: page
title: Unit testing
nav_order: 1
path: /testing/unit
group: Testing
---

## Unit testing

The complete suite of unit tests can be run locally using command `npm test` from the top directory.

### Jest frontend testing

Unit testing for the vue application `td.vue` is done using [jest](https://jestjs.io/),
and lives in the `td.vue/tests/unit` directory.

If you'd prefer to work in a more TDD fashion, you can have the tests run continuously by
navigating to the `td.vue` directory and running `npm run test:unit -- --watch`

### Mocha backend testing

Unit testing for the server application `td.server` is done using [Mocha](https://mochajs.org/),
with a little help from our friends [Sinon.JS](https://sinonjs.org/) and [chai](https://www.chaijs.com/).
To run the tests locally navigate to the `td.server` directory and run: `npm run test:unit`

## Code Coverage

When you run unit tests for both the front-end and back-end application,
you will be presented with a code coverage report.
There will be an HTML report generated as well that you can view to
dig deeper into what sections may be missing coverage.

We hope to keep the code coverage as high as possible.  If you need help writing or updating tests, please just ask!

----

Threat Dragon: _making threat modeling less threatening_
