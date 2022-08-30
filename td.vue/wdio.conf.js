const { join } = require('path');
const fs = require('fs');

const packageJson = JSON.parse(fs.readFileSync('./package.json'));
const {
    build: { productName },
} = packageJson;

const config = {
    outputDir: 'wdio-logs',
    // ...
    services: [
        [
            'electron',
            {
                appPath: join(__dirname, 'dist-electron'),
                appName: productName,
                appArgs: ['foo', 'bar=baz'],
                chromedriver: {
                    port: 9519,
                    logFileName: 'wdio-chromedriver.log',
                },
            },
        ],
    ],
    // ...
};

module.exports = { config };
