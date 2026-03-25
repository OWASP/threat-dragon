const assert = require('node:assert/strict');
const fs = require('fs');
const { getBrowser } = require('../support/session');
const {
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
    setThreatModelTitle,
    waitForThreatModelTitle,
    saveModel,
    saveModelAs,
    exportModelAsHtml,
    exportModelAsPdf,
    closeModel,
    openHelpMenuLink,
    openAboutDialog
} = require('../support/menu');

const SUITE_TIMEOUT_MS = 30000;
const SAVED_MODEL_TITLE = 'Saved From Electron Menu';
const SAVED_AS_MODEL_TITLE = 'Saved As From Menu';

describe('Desktop menu integration tests', function () {
    this.timeout(SUITE_TIMEOUT_MS);

    beforeEach(async () => {
        await resetMenuTest();
    });

    it('exposes the full File and Help menu structure, including disabled export entries', async () => {
        const snapshot = await getMenuSnapshot();
        const fileSnapshot = getTopLevelMenu(snapshot, fileMenu.labels.heading);
        const helpSnapshot = getTopLevelMenu(snapshot, helpMenu.labels.heading);
        const exportMenu = getSubmenuItem(fileSnapshot, fileMenu.labels.exportAs);
        const exportOtm = getSubmenuItem(exportMenu, fileMenu.labels.exportOtm);
        const exportTd = getSubmenuItem(exportMenu, fileMenu.labels.exportTd);

        assert.equal(fileSnapshot.label, fileMenu.labels.heading);
        assert.deepEqual(fileSnapshot.submenu.map((item) => item.label), fileMenu.expectedItems);
        assert.equal(exportOtm.label, fileMenu.labels.exportOtm);
        assert.equal(exportOtm.enabled, false);
        assert.equal(exportTd.label, fileMenu.labels.exportTd);
        assert.equal(exportTd.enabled, false);

        assert.equal(helpSnapshot.label, helpMenu.labels.heading);
        assert.deepEqual(helpSnapshot.submenu.map((item) => item.label), helpMenu.expectedItems);
    });

    it('opens an existing threat model through File > Open Model', async () => {
        const browser = getBrowser();

        await withMenuWorkspace(async ({ copyModelFixture }) => {
            const modelPath = copyModelFixture('open-model.json');

            await openModel(modelPath);

            assert.equal(await browser.getPageSource().then((source) => source.includes(appContent.demoModelTitle)), true);

            const state = await getMenuState();
            const [openDialogCall] = state.openDialogCalls;

            assert.equal(state.openDialogCalls.length, appContent.singleDialogCall);
            assert.equal(openDialogCall.title, dialogs.openModelTitle);
        });
    });

    it('saves an edited model through File > Save Model', async () => {
        await withMenuWorkspace(async ({ copyModelFixture }) => {
            const modelPath = copyModelFixture('save-model.json');

            await openModel(modelPath);
            await setThreatModelTitle(SAVED_MODEL_TITLE);
            await saveModel();

            const savedModel = await waitForThreatModelTitle(modelPath, SAVED_MODEL_TITLE);
            assert.equal(savedModel.summary.title, SAVED_MODEL_TITLE);
        });
    });

    it('saves a new model through File > Save Model As', async () => {
        await withMenuWorkspace(async ({ createPath }) => {
            const savePath = createPath('saved-as-model.json');

            await createNewModel();
            await setThreatModelTitle(SAVED_AS_MODEL_TITLE);
            await saveModelAs(savePath);

            const savedModel = await waitForThreatModelTitle(savePath, SAVED_AS_MODEL_TITLE);
            assert.equal(savedModel.summary.title, SAVED_AS_MODEL_TITLE);

            const state = await getMenuState();
            const [saveDialogCall] = state.saveDialogCalls;

            assert.equal(state.saveDialogCalls.length, appContent.singleDialogCall);
            assert.equal(saveDialogCall.title, dialogs.saveModelAsTitle);
        });
    });

    it('opens a new model editor through File > New Model', async () => {
        const browser = getBrowser();
        const titleInput = await createNewModel();

        assert.equal(await titleInput.isDisplayed(), true);
        assert.match(await browser.getUrl(), appContent.newModelEditRoute);
    });

    it('exports HTML through File > Export Model As > HTML', async () => {
        await withMenuWorkspace(async ({ copyModelFixture, createPath }) => {
            const modelPath = copyModelFixture('export-model.json');
            const htmlPath = createPath('demo-export.html');

            await openModel(modelPath);
            await exportModelAsHtml(htmlPath);

            assert.equal(fs.readFileSync(htmlPath, 'utf8').includes(appContent.exportMarker), true);
        });
    });

    it('exports PDF through File > Export Model As > PDF', async () => {
        await withMenuWorkspace(async ({ copyModelFixture, createPath }) => {
            const modelPath = copyModelFixture('export-model.json');
            const pdfPath = createPath('demo-export.pdf');

            await openModel(modelPath);
            await exportModelAsPdf(pdfPath);

            assert.equal(fs.readFileSync(pdfPath).length > appContent.nonEmptyFileSizeBytes, true);
        });
    });

    it('closes an opened model through File > Close Model', async () => {
        const browser = getBrowser();

        await withMenuWorkspace(async ({ copyModelFixture }) => {
            const modelPath = copyModelFixture('close-model.json');

            await openModel(modelPath);
            await closeModel();

            assert.equal(await browser.getPageSource().then((source) => source.includes(appContent.welcomeMessage)), true);
            assert.equal(await browser.getUrl(), appContent.dashboardUrl);
        });
    });

    it('opens each Help menu link through shell.openExternal', async () => {
        for (const helpMenuLink of helpMenu.links) {
            await resetMenuTest();
            await openHelpMenuLink(helpMenuLink.label);

            const state = await getMenuState();
            assert.deepEqual(state.externalUrls, [helpMenuLink.url]);
        }
    });

    it('shows the About dialog through Help > About', async () => {
        await openAboutDialog();

        const state = await getMenuState();
        const [aboutDialog] = state.messageBoxes;

        assert.equal(state.messageBoxes.length, appContent.singleDialogCall);
        assert.match(aboutDialog.title, dialogs.aboutTitle);
        assert.match(aboutDialog.detail, dialogs.aboutVersion);
    });
});
