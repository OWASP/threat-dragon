const fs = require('fs');
const { getBrowser } = require('./session');
const { openModel, saveModel, saveModelAs, closeModel, waitForToast } = require('./menu');
const { waitFor } = require('./utils');

const UI_WAIT_TIMEOUT_MS = 10000;
const THREAT_MODEL_SAVED_TOAST = 'Threat model successfully saved';

const diagramView = {
    selectors: {
        editLink: 'a.diagram-edit',
        closeButton: 'button.btn.btn-secondary',
        editThreatTitle: '#threat-edit #title',
        editThreatMitigation: '#threat-edit #mitigation',
        statusDropdownToggle: '//div[@id="status"]//button[contains(@class, "td-dropdown-toggle")]',
        statusMitigatedItem: '//div[@id="status"]//button[contains(@class, "td-dropdown-item") and normalize-space()="Mitigated"]',
        applyButton: '//div[@id="threat-edit"]//button[normalize-space()="Apply"]'
    }
};

const openFirstDiagram = async (modelPath) => {
    const browser = getBrowser();

    await openModel(modelPath);
    await browser.execute(() => {
        document.querySelector('a.diagram-edit')?.click();
    });

    await browser.waitUntil(
        async () => (await browser.getPageSource()).includes('Threats'),
        { timeout: UI_WAIT_TIMEOUT_MS, timeoutMsg: 'Timed out waiting for the diagram editor' }
    );
};

const selectElementByText = async (text) => {
    const browser = getBrowser();
    const element = await browser.$(`//*[name()="text" and contains(., "${text}")]`);
    await element.waitForExist({ timeout: UI_WAIT_TIMEOUT_MS });
    await element.click();
    await browser.waitUntil(
        async () => (await browser.getPageSource()).includes('New Threat'),
        { timeout: UI_WAIT_TIMEOUT_MS, timeoutMsg: `Timed out waiting for element ${text} to be selected` }
    );
};

const openNewThreatDialog = async () => {
    const browser = getBrowser();

    await browser.execute(() => {
        const button = Array.from(document.querySelectorAll('a')).find(
            (candidate) => (candidate.textContent || '').trim() === 'New Threat'
        );
        button?.click();
    });

    await browser.waitUntil(
        async () => (await browser.getPageSource()).includes('Edit Threat'),
        { timeout: UI_WAIT_TIMEOUT_MS, timeoutMsg: 'Timed out waiting for the threat dialog' }
    );
};

const createMitigatedThreat = async (title, mitigation) => {
    const browser = getBrowser();
    const titleInput = await browser.$(diagramView.selectors.editThreatTitle);
    const mitigationInput = await browser.$(diagramView.selectors.editThreatMitigation);
    const statusToggle = await browser.$(diagramView.selectors.statusDropdownToggle);
    const applyButton = await browser.$(diagramView.selectors.applyButton);

    await titleInput.waitForDisplayed({ timeout: UI_WAIT_TIMEOUT_MS });
    await titleInput.clearValue();
    await titleInput.setValue(title);
    await mitigationInput.setValue(mitigation);

    // open the status dropdown and choose Mitigated
    await statusToggle.waitForDisplayed({ timeout: UI_WAIT_TIMEOUT_MS });
    await statusToggle.click();
    const mitigatedItem = await browser.$(diagramView.selectors.statusMitigatedItem);
    await mitigatedItem.waitForDisplayed({ timeout: UI_WAIT_TIMEOUT_MS });
    await mitigatedItem.click();

    // confirm the dropdown now reflects the chosen status before applying
    await browser.waitUntil(
        async () => (await statusToggle.getText()).includes('Mitigated'),
        { timeout: UI_WAIT_TIMEOUT_MS, timeoutMsg: 'Timed out waiting for the status to update to Mitigated' }
    );

    await applyButton.waitForDisplayed({ timeout: UI_WAIT_TIMEOUT_MS });
    await applyButton.click();

    await browser.waitUntil(
        async () => !(await browser.getPageSource()).includes('Edit Threat'),
        { timeout: UI_WAIT_TIMEOUT_MS, timeoutMsg: 'Timed out waiting for the threat dialog to close' }
    );
};

const saveDiagramWithButton = async () => {
    const browser = getBrowser();

    await browser.execute(() => {
        const button = Array.from(document.querySelectorAll('button')).find(
            (candidate) => (candidate.textContent || '').trim() === 'Save'
        );
        button?.click();
    });
};

const saveDiagramWithCtrlS = async () => {
    const browser = getBrowser();
    const graphCanvas = await browser.$('#graph-container');
    await graphCanvas.waitForDisplayed({ timeout: UI_WAIT_TIMEOUT_MS });
    await graphCanvas.click();
    await browser.keys(['Control', 's']);
    await waitForToast(THREAT_MODEL_SAVED_TOAST);
};

const closeDiagram = async () => {
    const browser = getBrowser();

    await browser.execute(() => {
        const button = Array.from(document.querySelectorAll('button')).find(
            (candidate) => (candidate.textContent || '').trim() === 'Close'
        );
        button?.click();
    });

    await browser.waitUntil(
        async () => (await browser.getPageSource()).includes('Report'),
        { timeout: UI_WAIT_TIMEOUT_MS, timeoutMsg: 'Timed out waiting to leave the diagram editor' }
    );
};

const reopenModel = async (modelPath) => {
    await closeModel();
    await openModel(modelPath);
};

const waitForThreatTitles = async (filePath, expectedTitles) => {
    return waitFor(
        () => {
            if (!fs.existsSync(filePath)) {
                return false;
            }

            const model = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            const actor = model.detail.diagrams
                .flatMap((diagram) => diagram.cells)
                .find((cell) => cell.data?.name === 'Browser');

            if (!actor) {
                return false;
            }

            const titles = (actor.data.threats || []).map((threat) => threat.title);
            return expectedTitles.every((title) => titles.includes(title)) ? actor.data.threats : false;
        },
        UI_WAIT_TIMEOUT_MS,
        `Timed out waiting for threat titles in ${filePath}`
    );
};

module.exports = {
    openFirstDiagram,
    selectElementByText,
    openNewThreatDialog,
    createMitigatedThreat,
    saveDiagramWithButton,
    saveDiagramWithCtrlS,
    closeDiagram,
    reopenModel,
    waitForThreatTitles,
    saveModel,
    saveModelAs
};
