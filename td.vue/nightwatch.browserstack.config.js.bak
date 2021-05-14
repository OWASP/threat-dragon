const nightwatch_config = {
    // Vue-cli adds a path by default
    // We do not have any custom assertions as of now
    // Tests will fail to start if we do not have anything in the path
    custom_assertions_path: '',
    test_workers: {
        enabled: true,
        workers: 'auto'
    },
    desiredCapabilities: {
        chromeOptions: {
            args: [
                '--disable-gpu',
                'window-size=1920,1080',
                '--incognito'
            ]
        }
    },
    selenium: {
        "start_process": false,
        "host": "hub-cloud.browserstack.com",
        "port": 443
    },
    afterTest: function (test, context, { error, result, duration, passed, retries }) {
        browser.executeScript(`browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"${passed ? 'passed' : 'failed'}","reason": ""}}`);
    },

    test_settings: {
        default: {
            desiredCapabilities: {
                'build': 'nightwatch-browserstack',
                'browserstack.user': process.env.BROWSERSTACK_USERNAME,
                'browserstack.key': process.env.BROWSERSTACK_ACCESS_KEY,
                'browserstack.debug': false,
                'browser': 'chrome'
            }
        }
    }
};

// Code to copy seleniumhost/port into test settings
for (let i in nightwatch_config.test_settings) {
    const config = nightwatch_config.test_settings[i];
    config['selenium_host'] = nightwatch_config.selenium.host;
    config['selenium_port'] = nightwatch_config.selenium.port;
}

module.exports = nightwatch_config;
