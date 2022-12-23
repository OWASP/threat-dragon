// reduced set of end-to-end smoke tests
// run using cypress and Browserstack
// tested against the demo application at 'https://www.threatdragon.com/'
// NOTE: TODO temporary exclude edit.cy.js

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
        specPattern: [ 'tests/e2e/specs/home.cy.js', 'tests/e2e/specs/smokes/*.cy.js' ],
        supportFile: 'tests/e2e/support/e2e.js',
        baseUrl: 'https://www.threatdragon.com/'
    }
});
