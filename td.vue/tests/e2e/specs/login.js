module.exports = {
    beforeEach: (browser) => browser.init(),

    'logs in using the local session': (browser) => {
        const homepage = browser.page.homepage();
        homepage.waitForElementVisible('@app');
        const app = homepage.section.app;
        app.waitForElementVisible('@localLogin');
        app.click('@localLogin');
        browser.expect.url().to.contain('/#/dashboard');

        browser.end();
    }
};
