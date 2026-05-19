// full suite of end-to-end tests run using cypress
// run by the CI pipeline using cypress

const { defineConfig } = require('cypress');
const { createMockApp } = require('./tests/e2e/mock-server/threatDragonBackEndServerMock');

// Start the mock server on port 3000 to support pagination and other mock-dependent tests
const mockApp = createMockApp();
const mockServer = mockApp.listen(3000, () => {
    console.log('[mock] CI mock server listening on port 3000');
});

module.exports = defineConfig({
    fixturesFolder: 'tests/e2e/fixtures',
    screenshotsFolder: 'tests/e2e/screenshots',
    videosFolder: 'tests/e2e/videos',
    e2e: {
        excludeSpecPattern: [ 'tests/e2e/specs/smokes/*.cy.js', 'tests/e2e/specs/visual/*.cy.js' ],
        supportFile: 'tests/e2e/support/e2e.js',
        specPattern: 'tests/e2e/specs/**/*.cy.js',
        baseUrl: 'http://localhost:3000/'
    }
});

// Keep the process alive so the mock server stays up
process.on('exit', () => mockServer.close());
