// reduced set of end-to-end smoke tests using cypress test runner
// tested against a local application at 'http://localhost:8080/'
// excludes 'tests/e2e/specs/docs.cy.js' because the docs are not present
// NOTE: TODO temporary exclude edit.cy.js

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
