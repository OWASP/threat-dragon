module.exports = {
    // Vue-cli adds a path by default
    // We do not have any custom assertions as of now
    // Tests will fail to start if we do not have anything in the path
    custom_assertions_path: '',

    desiredCapabilities: {
        chromeOptions: {
            args: [
                "window-size=1280,800",
                "--incognito"
            ]
        }
    }
};
