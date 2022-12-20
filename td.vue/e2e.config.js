// full suite of end-to-end tests run using cypress
// specPattern: 'tests/e2e/specs/**/*.cy.js',

const { defineConfig } = require('cypress');

module.exports = defineConfig({
    retries: {
        runMode: 2,
        openMode: 0,
    },
    fixturesFolder: 'tests/e2e/fixtures',
    screenshotsFolder: 'tests/e2e/screenshots',
    videosFolder: 'tests/e2e/videos',
    e2e: {
        excludeSpecPattern: '**/tests/e2e/specs/data/*.js',
        specPattern: 'tests/e2e/specs/home.cy.js',
        supportFile: 'tests/e2e/support/e2e.js',
    }
});
