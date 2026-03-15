const assert = require('node:assert/strict');
const { getBrowser } = require('../support/session');
const { withMenuWorkspace, resetMenuTest } = require('../support/menu');
const {
    reportView,
    openReportForModel,
    toggleReportOption,
    waitForVisibleTextState,
    waitForSelectorVisibility,
    closeReport
} = require('../support/report');

const SUITE_TIMEOUT_MS = 30000;

describe('Desktop report smoke tests', function () {
    this.timeout(SUITE_TIMEOUT_MS);

    beforeEach(async () => {
        await resetMenuTest();
    });

    it('opens the report view with the desktop report actions', async () => {
        const browser = getBrowser();

        await withMenuWorkspace(async ({ copyModelFixture }) => {
            const modelPath = copyModelFixture('report-model.json');

            await openReportForModel(modelPath);

            const pdfButton = await browser.$(reportView.selectors.printPdfButton);
            const returnButton = await browser.$(reportView.selectors.returnButton);

            assert.match(await browser.getUrl(), reportView.routePattern);
            assert.equal(await pdfButton.isDisplayed(), true);
            assert.equal(await returnButton.isDisplayed(), true);
        });
    });

    it('updates the rendered report when report options are toggled', async () => {
        const browser = getBrowser();

        await withMenuWorkspace(async ({ copyModelFixture }) => {
            const modelPath = copyModelFixture('report-model.json');

            await openReportForModel(modelPath);

            await waitForVisibleTextState(reportView.selectors.entityTitle, reportView.text.emptyEntity, true);
            await toggleReportOption(reportView.selectors.showEmpty);
            await waitForVisibleTextState(reportView.selectors.entityTitle, reportView.text.emptyEntity, false);

            await waitForSelectorVisibility(reportView.selectors.readonlyDiagram, true);
            await toggleReportOption(reportView.selectors.showDiagrams);
            await waitForSelectorVisibility(reportView.selectors.readonlyDiagram, false);

            await waitForVisibleTextState(reportView.selectors.brandingText, reportView.text.branding, false);
            await toggleReportOption(reportView.selectors.showBranding);
            await waitForVisibleTextState(reportView.selectors.brandingText, reportView.text.branding, true);

            const brandingText = await browser.$(reportView.selectors.brandingText);
            assert.equal(await brandingText.isDisplayed(), true);
        });
    });

    it('returns from the report view back to the threat model', async () => {
        const browser = getBrowser();

        await withMenuWorkspace(async ({ copyModelFixture }) => {
            const modelPath = copyModelFixture('report-model.json');

            await openReportForModel(modelPath);
            await closeReport();

            const reportButton = await browser.$(reportView.selectors.reportButton);

            assert.equal(reportView.routePattern.test(await browser.getUrl()), false);
            assert.equal(await reportButton.isDisplayed(), true);
        });
    });
});
