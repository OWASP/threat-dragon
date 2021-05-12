module.exports = {
    beforeEach: (browser) => browser.init(),

    // TODO: Test for logged in message
    // TODO: Test for logout button
    // TODO: Test logout functionality
    // TODO: Test brand link brings you to /dashboard if logged in

    'has a brand that links to the home page': (browser) => {
        const homepage = browser.page.layout();
        homepage.waitForElementVisible('@navbar');

        const navbar = homepage.section.navbar;
        navbar.expect.element('@brand').to.be.visible;
        navbar.click('@brandLink');
        navbar.expect.url().to.equal(`${browser.launch_url}#/`);

        browser.end();
    },

    'links to the threat dragon docs': async (browser) => {
        const homepage = browser.page.layout();
        homepage.verifyLinkOpensNewTab(
            homepage.section.navbar.elements.docsLink,
            'https://docs.threatdragon.org/'
        );
        browser.end();
    },

    'links to OWASP\'s Threat Modeling Cheat Sheet': async (browser) => {
        const homepage = browser.page.layout();
        homepage.verifyLinkOpensNewTab(
            homepage.section.navbar.elements.cheatSheetLink,
            'https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html'
        );
        browser.end();
    },

    'links to OWASP\'s Threat Dragon project page': async (browser) => {
        const homepage = browser.page.layout();
        homepage.verifyLinkOpensNewTab(
            homepage.section.navbar.elements.projectLink,
            'https://owasp.org/www-project-threat-dragon/'
        );
        browser.end();
    }
};
