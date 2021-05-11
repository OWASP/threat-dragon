module.exports = {
    // Vue-cli adds a path by default
    // We do not have any custom assertions as of now
    // Tests will fail to start if we do not have anything in the path
    custom_assertions_path: '',

    desiredCapabilities: {
        chromeOptions: {
            args: [
                '--disable-gpu',
                'window-size=1920,1080',
                '--incognito'
            ]
        }
    }
};
