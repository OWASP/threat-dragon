// reduced set of end-to-end tests used as smoke tests
// run by the CI pipeline using cypress
// tested against a local application at 'http://localhost:8080/'

const { defineConfig } = require('cypress');

module.exports = defineConfig({
    fixturesFolder: 'tests/e2e/fixtures',
    screenshotsFolder: 'tests/e2e/screenshots',
    videosFolder: 'tests/e2e/videos',
    e2e: {
        specPattern: [ 'tests/e2e/specs/smokes/*.cy.js' ],
        supportFile: 'tests/e2e/support/e2e.js',
        baseUrl: 'http://localhost:8080/',
        experimentalRunAllSpecs: true
    }
});
