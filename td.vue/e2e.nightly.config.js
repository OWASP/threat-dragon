// full suite of nightly end-to-end tests
// run using cypress and Browserstack
// tested against the demo application at 'https://www.threatdragon.com/'
// NOTE: TODO we have excluded most of the tests because
//     the existing (free) Heroku web server infrastructure overloads
//     reinstate the tests once this is corrected

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
        supportFile: 'tests/e2e/support/e2e.js',
        specPattern: [ 'tests/e2e/specs/home.cy.js', 'tests/e2e/specs/docs.cy.js' ],
        baseUrl: 'https://www.threatdragon.com/'
    }
});
