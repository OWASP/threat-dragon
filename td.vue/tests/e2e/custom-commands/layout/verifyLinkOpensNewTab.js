/**
 * Clicks a link in the nav to open an external link and
 * asserts that a new tab is opened with the expected url
 *
 * Example usage:
 *   browser.clickNavExternal('#nav-docs', 'https://docs.threatdragon.org/');
 * 
 * @param {String} selector
 * @param {String} url
 */
module.exports = {
    verifyLinkOpensNewTab: async function (selector, url) {
        this.init();
        this.waitForElementVisible(selector);
        this.click(selector);

        let handles = await this.api.windowHandles();
        await this.switchWindow(handles.value[1]);
        this.expect.url().to.equal(url);
    }
};
