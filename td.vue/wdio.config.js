const { join } = require('path');

process.env.TEST = true;

const config = {
    services: [
        [
            'electron',
            {
                appPath: join(__dirname, 'dist-desktop'),
                appName: 'OWASP-Threat-Dragon',
                chromedriver: {
                    port: 9519,
                    logFileName: 'wdio-chromedriver.log',
                },
            },
        ],
    ],
    capabilities: [{}],
    port: 9519,
    waitforTimeout: 5000,
    connectionRetryCount: 10,
    connectionRetryTimeout: 30000,
    logLevel: 'debug',
    runner: 'local',
    outputDir: 'log/wdio-logs',
    specs: ['./tests/e2e/desktop/*.spec.js']
};

module.exports = { config };
