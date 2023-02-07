const { join } = require('path');

process.env.IS_TEST = true;

const config = {
    services: [
        [
            'electron',
            {
                appPath: join(__dirname, 'dist-desktop'),
                appName: 'Threat-Dragon-ng',
                chromedriver: {
                    port: 9519,
                    logFileName: 'wdio-chromedriver.log',
                },
            },
        ],
    ],
    capabilities: [{
        browserName: 'chrome',
        'goog:chromeOptions': {
            args: ['headless', 'disable-gpu']
        }
    }],
    port: 9519,
    waitforTimeout: 30000,
    connectionRetryCount: 10,
    connectionRetryTimeout: 30000,
    logLevel: 'debug',
    runner: 'local',
    // to redirect logs to files instead of console:
    // outputDir: 'log/wdio-logs',
    specs: ['./tests/e2e/desktop/*.spec.js'],
    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd',
        timeout: 30000,
    }
};

module.exports = { config };
