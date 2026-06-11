const { getBrowser } = require('./session');

const waitForHomePage = async () => {
    const browser = getBrowser();
    const desktopLoginButton = await browser.$('#desktop-login-btn');
    await desktopLoginButton.waitForDisplayed();
    return desktopLoginButton;
};

const resetDesktopApp = async () => {
    const browser = getBrowser();
    await browser.execute(() => {
        window.location.hash = '#/';
    });
    await browser.refresh();
    // refresh triggers vuex-persist to re-hydrate from sessionStorage,
    // so clear storage AFTER the refresh to fully reset state
    await browser.execute(() => {
        window.sessionStorage.clear();
        window.localStorage.clear();
    });
    // reload once more so the app reinitializes with clean state
    await browser.refresh();
    await browser.execute(() => {
        window.electronAPI.modelClosed('');
    });
    await waitForHomePage();
};

const openNewThreatModelFromHome = async () => {
    const browser = getBrowser();
    const desktopLoginButton = await waitForHomePage();
    await desktopLoginButton.click();

    const createNewLink = await browser.$('a[href="#/desktop/threatmodel/new"]');
    await createNewLink.waitForDisplayed();
    await createNewLink.click();

    await browser.waitUntil(async () => {
        const url = await browser.getUrl();
        return url.includes('#/desktop/New%20Threat%20Model/edit');
    });
};

module.exports = {
    waitForHomePage,
    resetDesktopApp,
    openNewThreatModelFromHome
};
