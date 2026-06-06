// full suite of end-to-end tests run using cypress
// run by the CI pipeline using cypress
//
// Set CI_MOCK_ENABLED=false to skip the mock server and exclude GitHub-specific tests
// (used by the push pipeline where a Docker container provides the real backend)


const { defineConfig } = require('cypress');
const { createMockApp } = require('./tests/e2e/mock-server/threatDragonBackEndServerMock');

const useMockServer = process.env.CI_MOCK_ENABLED !== 'false';

if (useMockServer) {
    const mockApp = createMockApp();
    const mockServer = mockApp.listen(3000, () => {
        console.log('[mock] CI mock server listening on port 3000');
    });
    process.on('exit', () => mockServer.close());
}

const excludeSpecPattern = [ 'tests/e2e/specs/smokes/*.cy.js', 'tests/e2e/specs/visual/*.cy.js' ];
if (!useMockServer) {
    excludeSpecPattern.push('tests/e2e/specs/pagination/*.cy.js');
    excludeSpecPattern.push('tests/e2e/specs/gitlab/*.cy.js');
}

module.exports = defineConfig({
    fixturesFolder: 'tests/e2e/fixtures',
    screenshotsFolder: 'tests/e2e/screenshots',
    videosFolder: 'tests/e2e/videos',
    e2e: {
        excludeSpecPattern,
        supportFile: 'tests/e2e/support/e2e.js',
        specPattern: 'tests/e2e/specs/**/*.cy.js',
        baseUrl: 'http://localhost:3000/'
    }
});
