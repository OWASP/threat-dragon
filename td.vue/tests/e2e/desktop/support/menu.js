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

const uiWaitTimeoutMs = 10000;
const menuSeparator = null;
const modelFixtureName = 'v2-model.json';
const titleInputSelector = '#title';
const editButtonSelector = '#td-edit-btn';
const threatModelSavedToast = 'Threat model successfully saved';
const threatModelExportedToast = 'Threat model exported';

const appContent = {
    dashboardUrl: 'app://./index.html#/dashboard',
    demoModelTitle: 'Demo Threat Model',
    discardMessage: 'Are you sure you want to discard your changes?',
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
    menuSeparator,
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
    menuSeparator,
    helpMenu.labels.github,
    helpMenu.labels.submit,
    helpMenu.labels.check,
    menuSeparator,
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
    { label: helpMenu.labels.check, url: 'https://github.com/OWASP/threat-dragon/releases/latest/' }
];

const waitForToast = async (text) => {
    const browser = getBrowser();
    await browser.waitUntil(
        async () => browser.execute((toastText) => document.body.innerText.includes(toastText), text),
        { timeout: uiWaitTimeoutMs, timeoutMsg: `Timed out waiting for toast: ${text}` }
    );
};

const waitForModelEditor = async () => {
    const browser = getBrowser();
    const titleInput = await browser.$(titleInputSelector);
    await titleInput.waitForDisplayed({ timeout: uiWaitTimeoutMs });
    return titleInput;
};

const waitForThreatModelView = async () => {
    const browser = getBrowser();
    await browser.waitUntil(
        async () => {
            const editButton = await browser.$(editButtonSelector);
            return editButton.isDisplayed();
        },
        { timeout: uiWaitTimeoutMs, timeoutMsg: 'Timed out waiting for the opened threat model view' }
    );
};

const waitForDashboard = async () => {
    const browser = getBrowser();
    await browser.waitUntil(
        async () => {
            const url = await browser.getUrl();
            return url === appContent.dashboardUrl;
        },
        { timeout: uiWaitTimeoutMs, timeoutMsg: 'Timed out waiting for the dashboard' }
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
            copyModelFixture: (targetName, fixtureName = modelFixtureName) => {
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
    const titleInput = await browser.$(titleInputSelector);

    if (await titleInput.isDisplayed().catch(() => false)) {
        return titleInput;
    }

    const editButton = await browser.$(editButtonSelector);
    await editButton.waitForDisplayed({ timeout: uiWaitTimeoutMs });
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
        uiWaitTimeoutMs,
        `Timed out waiting for threat model title in ${filePath}`
    );
};

const saveModel = async () => {
    await clickFileMenuItem(fileMenu.labels.save);
    await waitForToast(threatModelSavedToast);
};

const saveModelAs = async (filePath) => {
    await setNextSaveDialogResult({ canceled: false, filePath });
    await clickFileMenuItem(fileMenu.labels.saveAs);
    await waitForToast(threatModelSavedToast);
};

const exportModelAsHtml = async (filePath) => {
    await setNextSaveDialogResult({ canceled: false, filePath });
    await clickFileMenuItem(fileMenu.labels.exportAs, fileMenu.labels.exportHtml);
    await waitFor(() => fs.existsSync(filePath), uiWaitTimeoutMs, 'Timed out waiting for HTML export');
    await waitForToast(threatModelExportedToast);
};

const exportModelAsPdf = async (filePath) => {
    await setNextSaveDialogResult({ canceled: false, filePath });
    await clickFileMenuItem(fileMenu.labels.exportAs, fileMenu.labels.exportPdf);
    await waitFor(() => fs.existsSync(filePath), uiWaitTimeoutMs, 'Timed out waiting for PDF export');
    await waitForToast(threatModelExportedToast);
};

const closeModel = async () => {
    await clickFileMenuItem(fileMenu.labels.closeModel);
    await waitForDashboard();
};

const closeDirtyModel = async () => {
    const browser = getBrowser();
    await clickFileMenuItem(fileMenu.labels.closeModel);
    await browser.waitUntil(
        async () => browser.execute((message) => document.body.innerText.includes(message), appContent.discardMessage),
        { timeout: uiWaitTimeoutMs, timeoutMsg: 'Timed out waiting for discard confirmation' }
    );
    const okButton = await browser.$('//button[normalize-space()="OK"]');
    await okButton.waitForClickable({ timeout: uiWaitTimeoutMs });
    await okButton.click();
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
    waitForToast,
    setThreatModelTitle,
    waitForThreatModelTitle,
    saveModel,
    saveModelAs,
    exportModelAsHtml,
    exportModelAsPdf,
    closeModel,
    closeDirtyModel,
    openHelpMenuLink,
    openAboutDialog
};
