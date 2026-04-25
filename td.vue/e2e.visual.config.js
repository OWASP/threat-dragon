const { defineConfig } = require('cypress');
const visualRegression = require('./tests/e2e/visual/compare.js');

module.exports = defineConfig({
    fixturesFolder: 'tests/e2e/fixtures',
    screenshotsFolder: 'tests/e2e/visual/screenshots',
    videosFolder: 'tests/e2e/videos',
    video: false,
    viewportWidth: 1365,
    viewportHeight: 768,
    retries: {
        runMode: 0,
        openMode: 0
    },
    e2e: {
        baseUrl: 'http://localhost:8080/',
        supportFile: 'tests/e2e/support/visual.js',
        specPattern: [ 'tests/e2e/specs/visual/*.cy.js' ],
        setupNodeEvents(on, config) {
            on('before:browser:launch', (_browser, launchOptions) => {
                launchOptions.args.push('--disable-dev-shm-usage');
                launchOptions.args.push('--disable-gpu');
                return launchOptions;
            });
            visualRegression.register(on, config);
            return config;
        }
    }
});
