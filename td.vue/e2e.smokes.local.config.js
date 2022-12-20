// reduced set of end-to-end smoke tests using cypress test runner
// tested against a local application at 'http://localhost:8080/'
// specPattern: 'tests/e2e/smokes/**/*.cy.js',

const { defineConfig } = require('cypress');

module.exports = defineConfig({
  fixturesFolder: 'tests/e2e/fixtures',
  screenshotsFolder: 'tests/e2e/screenshots',
  videosFolder: 'tests/e2e/videos',
  e2e: {
    specPattern: 'tests/e2e/smokes/home.cy.js',
    supportFile: 'tests/e2e/support/e2e.js',
    baseUrl: 'http://localhost:8080/'
  }
});
