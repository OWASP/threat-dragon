let browser;
let mainProcessClient;

const setBrowser = (value) => {
    browser = value;
};

const getBrowser = () => {
    if (!browser) {
        throw new Error('Desktop E2E browser session has not been initialized');
    }

    return browser;
};

const setMainProcessClient = (value) => {
    mainProcessClient = value;
};

const getMainProcessClient = () => {
    if (!mainProcessClient) {
        throw new Error('Desktop E2E main process client has not been initialized');
    }

    return mainProcessClient;
};

module.exports = {
    setBrowser,
    getBrowser,
    setMainProcessClient,
    getMainProcessClient
};
