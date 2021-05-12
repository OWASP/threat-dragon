module.exports = {
    beforeEach: (browser) => browser.init(),

    'has a welcome message': (browser) => {
        const homepage = browser.page.homepage();
        homepage.waitForElementVisible('@welcome');

        const welcome = homepage.section.welcome;
        welcome.expect.element('@logo').to.be.visible;
        welcome.expect.element('@headline').text.to.equal('OWASP Threat Dragon');
        welcome.expect.element('@description').text.to.contain('open-source');

        browser.end();
    },

    'displays the login options': (browser) => {
        const homepage = browser.page.homepage();
        homepage.waitForElementVisible('@welcome');

        const welcome = homepage.section.welcome;
        welcome.expect.element('@githubLogin').to.be.visible;
        welcome.expect.element('@localLogin').to.be.visible;

        browser.end();
    }
};
