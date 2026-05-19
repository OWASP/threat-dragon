// full suite of end-to-end tests run using cypress
// no retries as this uses localhost
// NOTE: excludes 'tests/e2e/specs/docs.cy.js' because no docs present for local dev

const { defineConfig } = require('cypress');
const { createMockApp } = require('./tests/e2e/mock-server/threatDragonBackEndServerMock');

// Start the mock server on port 3000 (must match vue.config.js API proxy target).
// The real backend is not running during e2e tests; this mock replaces it.
const mockApp = createMockApp();
const mockServer = mockApp.listen(3000, () => {
    console.log('[mock] threatDragonBackEndServerMock listening on port 3000');
});

module.exports = defineConfig({
    fixturesFolder: 'tests/e2e/fixtures',
    screenshotsFolder: 'tests/e2e/videos',
    e2e: {
        excludeSpecPattern: [ 'tests/e2e/specs/smokes/*.cy.js', 'tests/e2e/specs/docs.cy.js', 'tests/e2e/specs/visual/*.cy.js' ],
        supportFile: 'tests/e2e/support/e2e.js',
        specPattern: [ 'tests/e2e/specs/**/*.cy.js' ],
        experimentalRunAllSpecs: true
    }
});

// Keep the process alive so the mock server stays up
process.on('exit', () => mockServer.close());
