const { getBrowser } = require('./session');
const { openModel } = require('./menu');
const { waitFor } = require('./utils');

const REPORT_VIEW_TIMEOUT_MS = 10000;

const reportView = {
    routePattern: /#\/desktop\/.*\/report$/,
    selectors: {
        reportButton: '#td-report-btn',
        reportContainer: '.td-report-container',
        returnButton: '#td-return-btn',
        printPdfButton: '#td-print-pdf-btn',
        showBranding: '#show_branding',
        showDiagrams: '#show_models',
        showEmpty: '#show_empty',
        showMitigated: '#show_mitigated',
        showOutOfScope: '#show_outofscope',
        brandingText: '.td-brand-text',
        databaseThreats: '[data-test-id="Database"]',
        entityTitle: '.entity-title',
        readonlyDiagram: '.td-readonly-diagram'
    },
    text: {
        branding: 'OWASP Threat Dragon',
        emptyEntity: 'Web Application',
        mitigatedThreat: 'Unauthorised access',
        outOfScopeEntity: 'Web Application Config (Store)'
    }
};

const hasVisibleText = async (selector, text) => {
    const browser = getBrowser();

    return browser.execute(
        ({ selector, text }) => {
            return Array.from(document.querySelectorAll(selector)).some((element) => {
                const styles = window.getComputedStyle(element);
                const isVisible = styles.display !== 'none' && styles.visibility !== 'hidden' && element.offsetParent !== null;
                return isVisible && element.textContent.includes(text);
            });
        },
        { selector, text }
    );
};

const isSelectorVisible = async (selector) => {
    const browser = getBrowser();
    const element = await browser.$(selector);
    return element.isDisplayed().catch(() => false);
};

const waitForReport = async () => {
    const browser = getBrowser();
    const reportContainer = await browser.$(reportView.selectors.reportContainer);

    await browser.waitUntil(
        async () => reportView.routePattern.test(await browser.getUrl()),
        { timeout: REPORT_VIEW_TIMEOUT_MS, timeoutMsg: 'Timed out waiting for the report route' }
    );
    await reportContainer.waitForDisplayed({ timeout: REPORT_VIEW_TIMEOUT_MS });
};

const openReportForModel = async (modelPath) => {
    const browser = getBrowser();

    await openModel(modelPath);

    const reportButton = await browser.$(reportView.selectors.reportButton);
    await reportButton.waitForDisplayed({ timeout: REPORT_VIEW_TIMEOUT_MS });
    await reportButton.click();
    await waitForReport();
};

const toggleReportOption = async (selector) => {
    const browser = getBrowser();

    await browser.execute((checkboxSelector) => {
        const checkbox = document.querySelector(checkboxSelector);
        checkbox.click();
    }, selector);
};

const waitForVisibleTextState = async (selector, text, expectedVisibility) => {
    return waitFor(
        async () => (await hasVisibleText(selector, text)) === expectedVisibility,
        REPORT_VIEW_TIMEOUT_MS,
        `Timed out waiting for text "${text}" visibility to become ${expectedVisibility}`
    );
};

const waitForSelectorVisibility = async (selector, expectedVisibility) => {
    return waitFor(
        async () => (await isSelectorVisible(selector)) === expectedVisibility,
        REPORT_VIEW_TIMEOUT_MS,
        `Timed out waiting for selector "${selector}" visibility to become ${expectedVisibility}`
    );
};

const closeReport = async () => {
    const browser = getBrowser();
    const returnButton = await browser.$(reportView.selectors.returnButton);

    await returnButton.waitForDisplayed({ timeout: REPORT_VIEW_TIMEOUT_MS });
    await returnButton.click();
    await browser.waitUntil(
        async () => !reportView.routePattern.test(await browser.getUrl()),
        { timeout: REPORT_VIEW_TIMEOUT_MS, timeoutMsg: 'Timed out waiting to leave the report route' }
    );
};

module.exports = {
    reportView,
    openReportForModel,
    toggleReportOption,
    waitForVisibleTextState,
    waitForSelectorVisibility,
    closeReport
};
