// reduced set of end-to-end tests used as smoke tests
// run by the CI pipeline using cypress
// tested against a local application at 'http://localhost:8080/'
// NOTE: exclude 'tests/e2e/specs/smokes/docs.cy.js' because no docs present for local dev

const { defineConfig } = require('cypress');

module.exports = defineConfig({
    fixturesFolder: 'tests/e2e/fixtures',
    screenshotsFolder: 'tests/e2e/screenshots',
    videosFolder: 'tests/e2e/videos',
    e2e: {
        excludeSpecPattern: [ 'tests/e2e/specs/smokes/docs.cy.js' ],
        specPattern: [ 'tests/e2e/specs/home.cy.js', 'tests/e2e/specs/smokes/*.cy.js' ],
        supportFile: 'tests/e2e/support/e2e.js'
    }
});
