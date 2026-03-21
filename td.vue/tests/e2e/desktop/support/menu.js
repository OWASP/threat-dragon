const fs = require('fs');
const { join } = require('path');
const { version: appVersion } = require('../../../../package.json');
const { resetDesktopApp } = require('./helpers');
const { getBrowser } = require('./session');
const { waitFor, withTempDirectory } = require('./utils');
const {
    clickMenuItem,
    getMenuSnapshot: getMainProcessMenuSnapshot,
    getMenuTestState,
    resetMenuTestState,
    setNextOpenDialogResult,
    setNextSaveDialogResult
} = require('./main-process');

const UI_WAIT_TIMEOUT_MS = 10000;
const MENU_SEPARATOR = null;
const MODEL_FIXTURE_NAME = 'v2-model.json';
const TITLE_INPUT_SELECTOR = '#title';
const EDIT_BUTTON_SELECTOR = '#td-edit-btn';
const THREAT_MODEL_SAVED_TOAST = 'Threat model successfully saved';
const THREAT_MODEL_EXPORTED_TOAST = 'Threat model exported';

const appContent = {
    dashboardUrl: 'app://./index.html#/dashboard',
    demoModelTitle: 'Demo Threat Model',
    exportMarker: 'Threat Dragon export',
    newModelEditRoute: /#\/desktop\/New%20Threat%20Model\/edit/,
    nonEmptyFileSizeBytes: 0,
    singleDialogCall: 1,
    welcomeMessage: 'Welcome!'
};

const dialogs = {
    aboutTitle: /About OWASP Threat Dragon/,
    aboutVersion: new RegExp(`Version ${appVersion.replaceAll('.', '\\.')}`),
    openModelTitle: 'Open Model',
    saveModelAsTitle: 'Save Model As'
};

const fileMenu = {
    labels: {
        heading: 'File',
        open: 'Open Model',
        save: 'Save Model',
        saveAs: 'Save Model As',
        newModel: 'New Model',
        exportAs: 'Export Model As',
        exportHtml: 'HTML Report',
        exportPdf: 'PDF Report',
        exportOtm: 'Open Threat Model (OTM)',
        exportTd: 'Original (Threat Dragon)',
        closeModel: 'Close Model',
        closeWindow: 'Close Window'
    }
};

fileMenu.expectedItems = [
    fileMenu.labels.open,
    fileMenu.labels.save,
    fileMenu.labels.saveAs,
    fileMenu.labels.newModel,
    fileMenu.labels.exportAs,
    fileMenu.labels.closeModel,
    MENU_SEPARATOR,
    fileMenu.labels.closeWindow
];

const helpMenu = {
    labels: {
        heading: 'Help',
        docs: 'Documentation',
        visit: 'Visit us at OWASP',
        sheets: 'OWASP Cheat Sheets',
        github: 'Visit us on GitHub',
        submit: 'Submit an Issue',
        check: 'Check for updates ...',
        about: 'About'
    }
};

helpMenu.expectedItems = [
    helpMenu.labels.docs,
    helpMenu.labels.visit,
    helpMenu.labels.sheets,
    MENU_SEPARATOR,
    helpMenu.labels.github,
    helpMenu.labels.submit,
    helpMenu.labels.check,
    MENU_SEPARATOR,
    helpMenu.labels.about
];

helpMenu.links = [
    { label: helpMenu.labels.docs, url: 'https://www.threatdragon.com/docs/' },
    { label: helpMenu.labels.visit, url: 'https://owasp.org/www-project-threat-dragon/' },
    {
        label: helpMenu.labels.sheets,
        url: 'https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html'
    },
    { label: helpMenu.labels.github, url: 'https://github.com/owasp/threat-dragon/' },
    { label: helpMenu.labels.submit, url: 'https://github.com/owasp/threat-dragon/issues/new/choose/' },
    { label: helpMenu.labels.check, url: 'https://github.com/OWASP/threat-dragon/releases/' }
];

const waitForToast = async (text) => {
    const browser = getBrowser();
    await browser.waitUntil(
        async () => {
            const source = await browser.getPageSource();
            return source.includes(text);
        },
        { timeout: UI_WAIT_TIMEOUT_MS, timeoutMsg: `Timed out waiting for toast: ${text}` }
    );
};

const waitForModelEditor = async () => {
    const browser = getBrowser();
    const titleInput = await browser.$(TITLE_INPUT_SELECTOR);
    await titleInput.waitForDisplayed({ timeout: UI_WAIT_TIMEOUT_MS });
    return titleInput;
};

const waitForThreatModelView = async () => {
    const browser = getBrowser();
    await browser.waitUntil(
        async () => {
            const editButton = await browser.$(EDIT_BUTTON_SELECTOR);
            return editButton.isDisplayed();
        },
        { timeout: UI_WAIT_TIMEOUT_MS, timeoutMsg: 'Timed out waiting for the opened threat model view' }
    );
};

const waitForDashboard = async () => {
    const browser = getBrowser();
    await browser.waitUntil(
        async () => {
            const url = await browser.getUrl();
            return url === appContent.dashboardUrl;
        },
        { timeout: UI_WAIT_TIMEOUT_MS, timeoutMsg: 'Timed out waiting for the dashboard' }
    );
};

const copyModelFixture = (tempDir, fixtureName, targetName) => {
    const fixturePath = join(process.cwd(), 'tests', 'e2e', 'fixtures', fixtureName);
    const targetPath = join(tempDir, targetName);
    fs.copyFileSync(fixturePath, targetPath);
    return targetPath;
};

const withMenuWorkspace = async (callback) => {
    return withTempDirectory('td-desktop-menu-', async (tempDir) => {
        const workspace = {
            tempDir,
            createPath: (fileName) => join(tempDir, fileName),
            copyModelFixture: (targetName, fixtureName = MODEL_FIXTURE_NAME) => {
                return copyModelFixture(tempDir, fixtureName, targetName);
            }
        };

        return callback(workspace);
    });
};

const findMenuItem = (menuItems, label) => {
    return menuItems.find((item) => item.label === label);
};

const getTopLevelMenu = (snapshot, label) => {
    return findMenuItem(snapshot, label);
};

const getSubmenuItem = (menuItem, label) => {
    return findMenuItem(menuItem.submenu, label);
};

const clickFileMenuItem = async (...labels) => {
    return clickMenuItem(fileMenu.labels.heading, ...labels);
};

const clickHelpMenuItem = async (label) => {
    return clickMenuItem(helpMenu.labels.heading, label);
};

const getMenuSnapshot = async () => {
    return getMainProcessMenuSnapshot();
};

const getMenuState = async () => {
    return getMenuTestState();
};

const resetMenuTest = async () => {
    await resetDesktopApp();
    await resetMenuTestState();
};

const openModel = async (modelPath) => {
    await setNextOpenDialogResult({ canceled: false, filePaths: [modelPath] });
    await clickFileMenuItem(fileMenu.labels.open);
    await waitForThreatModelView();
};

const createNewModel = async () => {
    await clickFileMenuItem(fileMenu.labels.newModel);
    return waitForModelEditor();
};

const openModelEditor = async () => {
    const browser = getBrowser();
    const titleInput = await browser.$(TITLE_INPUT_SELECTOR);

    if (await titleInput.isDisplayed().catch(() => false)) {
        return titleInput;
    }

    const editButton = await browser.$(EDIT_BUTTON_SELECTOR);
    await editButton.waitForDisplayed({ timeout: UI_WAIT_TIMEOUT_MS });
    await editButton.click();
    return waitForModelEditor();
};

const setThreatModelTitle = async (title) => {
    const titleInput = await openModelEditor();
    await titleInput.clearValue();
    await titleInput.setValue(title);
};

const waitForThreatModelTitle = async (filePath, expectedTitle) => {
    return waitFor(
        () => {
            if (!fs.existsSync(filePath)) {
                return false;
            }

            const model = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            return model.summary.title === expectedTitle ? model : false;
        },
        UI_WAIT_TIMEOUT_MS,
        `Timed out waiting for threat model title in ${filePath}`
    );
};

const saveModel = async () => {
    await clickFileMenuItem(fileMenu.labels.save);
    await waitForToast(THREAT_MODEL_SAVED_TOAST);
};

const saveModelAs = async (filePath) => {
    await setNextSaveDialogResult({ canceled: false, filePath });
    await clickFileMenuItem(fileMenu.labels.saveAs);
    await waitForToast(THREAT_MODEL_SAVED_TOAST);
};

const exportModelAsHtml = async (filePath) => {
    await setNextSaveDialogResult({ canceled: false, filePath });
    await clickFileMenuItem(fileMenu.labels.exportAs, fileMenu.labels.exportHtml);
    await waitFor(() => fs.existsSync(filePath), UI_WAIT_TIMEOUT_MS, 'Timed out waiting for HTML export');
    await waitForToast(THREAT_MODEL_EXPORTED_TOAST);
};

const exportModelAsPdf = async (filePath) => {
    await setNextSaveDialogResult({ canceled: false, filePath });
    await clickFileMenuItem(fileMenu.labels.exportAs, fileMenu.labels.exportPdf);
    await waitFor(() => fs.existsSync(filePath), UI_WAIT_TIMEOUT_MS, 'Timed out waiting for PDF export');
    await waitForToast(THREAT_MODEL_EXPORTED_TOAST);
};

const closeModel = async () => {
    await clickFileMenuItem(fileMenu.labels.closeModel);
    await waitForDashboard();
};

const openHelpMenuLink = async (label) => {
    await clickHelpMenuItem(label);
};

const openAboutDialog = async () => {
    await clickHelpMenuItem(helpMenu.labels.about);
};

module.exports = {
    appContent,
    dialogs,
    fileMenu,
    helpMenu,
    withMenuWorkspace,
    getMenuSnapshot,
    getMenuState,
    getTopLevelMenu,
    getSubmenuItem,
    resetMenuTest,
    openModel,
    createNewModel,
    waitForModelEditor,
    setThreatModelTitle,
    waitForThreatModelTitle,
    saveModel,
    saveModelAs,
    exportModelAsHtml,
    exportModelAsPdf,
    closeModel,
    openHelpMenuLink,
    openAboutDialog
};
