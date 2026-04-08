const assert = require('node:assert/strict');
const { getBrowser } = require('../support/session');
const { openNewThreatModelFromHome, resetDesktopApp } = require('../support/helpers');

describe('Desktop smoke tests', function () {
    this.timeout(20000);

    beforeEach(async () => {
        await resetDesktopApp();
    });

    it('launches the desktop shell with the expected window settings', async () => {
        const browser = getBrowser();
        assert.equal(await browser.getTitle(), 'OWASP Threat Dragon');
        assert.match(await browser.getUrl(), /app:\/\/\.\/index\.html/);

        const windowSize = await browser.execute(() => ({
            width: Math.max(window.outerWidth, window.innerWidth),
            height: Math.max(window.outerHeight, window.innerHeight)
        }));

        assert.equal(windowSize.width >= 1200, true);
        assert.equal(windowSize.height >= 900, true);
    });

    it('shows the desktop entrypoint on the home page', async () => {
        const browser = getBrowser();
        const desktopLoginButton = await browser.$('#desktop-login-btn');
        assert.equal(await desktopLoginButton.isDisplayed(), true);
        assert.match(await desktopLoginButton.getText(), /Start Threat Dragon/);
    });

    it('can create and lightly edit a new desktop threat model', async () => {
        const browser = getBrowser();
        await openNewThreatModelFromHome();

        const titleInput = await browser.$('#title');
        await titleInput.waitForDisplayed();
        await titleInput.clearValue();
        await titleInput.setValue('Desktop smoke model');

        await browser.waitUntil(async () => {
            const parentCard = await browser.$('#parent-card');
            const header = await parentCard.getText();
            return header.includes('Editing: Desktop smoke model');
        });

        const addDiagramLink = await browser.$('.add-diagram-link');
        await addDiagramLink.click();

        const diagramGroup = await browser.$('#diagram-group-0');
        await diagramGroup.waitForDisplayed();

        const removeDiagramButton = await browser.$('.td-remove-diagram');
        await removeDiagramButton.click();
        await diagramGroup.waitForDisplayed({ reverse: true });

        const closeButton = await browser.$('#td-close-btn');
        assert.equal(await closeButton.isDisplayed(), true);
    });
});
