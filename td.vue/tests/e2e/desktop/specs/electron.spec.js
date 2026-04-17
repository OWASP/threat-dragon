const assert = require('node:assert/strict');
const { getBrowser } = require('../support/session');
const { resetDesktopApp } = require('../support/helpers');

describe('Desktop electron shell tests', function () {
    this.timeout(20000);

    beforeEach(async () => {
        await resetDesktopApp();
    });

    it('exposes the preload desktop API in the renderer', async () => {
        const browser = getBrowser();
        const methods = await browser.execute(() => Object.keys(window.electronAPI).sort());

        const expectedMethods = [
            'appClose',
            'modelClosed',
            'modelOpenConfirmed',
            'modelOpened',
            'modelPrint',
            'modelSave',
            'onCloseAppRequest',
            'onCloseModelRequest',
            'onNewModelRequest',
            'onOpenModel',
            'onOpenModelRequest',
            'onPrintModelConfirmed',
            'onPrintModelRequest',
            'onSaveModelFailed',
            'onSaveModelConfirmed',
            'updateMenu'
        ];
        expectedMethods.forEach((method) => assert.equal(methods.includes(method), true));
    });

    it('keeps the Electron preload isolated from the renderer globals', async () => {
        const browser = getBrowser();
        const securityState = await browser.execute(() => ({
            hasElectronApi: typeof window.electronAPI === 'object',
            hasNodeRequire: typeof window.require !== 'undefined',
            hasNodeProcess: typeof window.process !== 'undefined',
            isSecureContext: window.isSecureContext
        }));

        assert.equal(securityState.hasElectronApi, true);
        assert.equal(securityState.hasNodeRequire, false);
        assert.equal(securityState.hasNodeProcess, false);
        assert.equal(securityState.isSecureContext, true);
    });
});
