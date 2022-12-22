// full suite of end-to-end tests run using cypress
// no retries as this uses localhost
// excludes 'tests/e2e/specs/docs.cy.js' because the docs are not present

const { defineConfig } = require('cypress');

module.exports = defineConfig({
    fixturesFolder: 'tests/e2e/fixtures',
    screenshotsFolder: 'tests/e2e/screenshots',
    videosFolder: 'tests/e2e/videos',
    e2e: {
        excludeSpecPattern: [ '**/tests/e2e/specs/smokes/*.cy.js', 'tests/e2e/specs/docs.cy.js' ],
        supportFile: 'tests/e2e/support/e2e.js',
        specPattern: [ 'tests/e2e/specs/home.cy.js' ]
    }
});
