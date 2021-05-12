module.exports = {
    beforeEach: (browser) => browser.init(),

    'has a welcome message': (browser) => {
        const homepage = browser.page.homepage();
        homepage.waitForElementVisible('@app');

        const app = homepage.section.app;
        app.expect.element('@logo').to.be.visible;
        app.expect.element('@headline').text.to.equal('OWASP Threat Dragon');
        app.expect.element('@description').text.to.contain('open-source');

        browser.end();
    },

    'displays the login options': (browser) => {
        const homepage = browser.page.homepage();
        homepage.waitForElementVisible('@app');

        const app = homepage.section.app;
        app.expect.element('@githubLogin').to.be.visible;
        app.expect.element('@localLogin').to.be.visible;

        browser.end();
    }
};
