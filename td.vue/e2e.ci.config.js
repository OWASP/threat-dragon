// full suite of end-to-end tests run using cypress
// run by the CI pipeline using cypress

const { defineConfig } = require('cypress');

module.exports = defineConfig({
    fixturesFolder: 'tests/e2e/fixtures',
    screenshotsFolder: 'tests/e2e/screenshots',
    videosFolder: 'tests/e2e/videos',
    e2e: {
        excludeSpecPattern: 'tests/e2e/specs/smokes/*.cy.js',
        supportFile: 'tests/e2e/support/e2e.js',
        specPattern: 'tests/e2e/specs/**/*.cy.js',
        baseUrl: 'http://localhost:3000/'
    }
});
