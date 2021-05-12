module.exports = {
    beforeEach: (browser) => browser.init(),

    'logs in using the local session': (browser) => {
        const homepage = browser.page.homepage();
        homepage.waitForElementVisible('@welcome');
        const welcome = homepage.section.welcome;
        welcome.waitForElementVisible('@localLogin');
        welcome.click('@localLogin');
        browser.expect.url().to.contain('/#/dashboard');

        browser.end();
    }
};
