const assert = require('node:assert/strict');
const { withMenuWorkspace, resetMenuTest } = require('../support/menu');
const {
    openFirstDiagram,
    selectElementByText,
    openNewThreatDialog,
    createMitigatedThreat,
    saveDiagramWithCtrlS,
    closeDiagram,
    reopenModel,
    waitForThreatTitles,
    saveModel,
    saveModelAs
} = require('../support/diagram');

const SUITE_TIMEOUT_MS = 30000;

describe('Desktop diagram save regressions', function () {
    this.timeout(SUITE_TIMEOUT_MS);

    beforeEach(async () => {
        await resetMenuTest();
    });

    it('persists a newly added mitigated threat when saving with ctrl+s', async () => {
        await withMenuWorkspace(async ({ copyModelFixture }) => {
            const modelPath = copyModelFixture('diagram-save-ctrl-s.json', 'v2-save-existing-threat.json');

            await openFirstDiagram(modelPath);
            await selectElementByText('Browser');
            await openNewThreatDialog();
            await createMitigatedThreat('CtrlS saved threat', 'CtrlS mitigation');
            await saveDiagramWithCtrlS();
            await waitForThreatTitles(modelPath, ['Existing actor threat', 'CtrlS saved threat']);
            await closeDiagram();
            await reopenModel(modelPath);

            const threats = await waitForThreatTitles(modelPath, ['Existing actor threat', 'CtrlS saved threat']);
            assert.equal(threats.some((threat) => threat.title === 'CtrlS saved threat' && threat.status === 'Mitigated'), true);
        });
    });

    it('persists a newly added mitigated threat when saving with File > Save Model', async () => {
        await withMenuWorkspace(async ({ copyModelFixture }) => {
            const modelPath = copyModelFixture('diagram-save-menu.json', 'v2-save-existing-threat.json');

            await openFirstDiagram(modelPath);
            await selectElementByText('Browser');
            await openNewThreatDialog();
            await createMitigatedThreat('Menu saved threat', 'Menu mitigation');
            await saveModel();
            await closeDiagram();
            await reopenModel(modelPath);

            const threats = await waitForThreatTitles(modelPath, ['Existing actor threat', 'Menu saved threat']);
            assert.equal(threats.some((threat) => threat.title === 'Menu saved threat' && threat.status === 'Mitigated'), true);
        });
    });

    it('persists a newly added mitigated threat when saving with File > Save Model As', async () => {
        await withMenuWorkspace(async ({ copyModelFixture, createPath }) => {
            const modelPath = copyModelFixture('diagram-save-menu-source.json', 'v2-save-existing-threat.json');
            const saveAsPath = createPath('diagram-save-menu-save-as.json');

            await openFirstDiagram(modelPath);
            await selectElementByText('Browser');
            await openNewThreatDialog();
            await createMitigatedThreat('Menu save as threat', 'Menu save as mitigation');
            await saveModelAs(saveAsPath);
            await closeDiagram();
            await reopenModel(saveAsPath);

            const threats = await waitForThreatTitles(saveAsPath, ['Existing actor threat', 'Menu save as threat']);
            assert.equal(threats.some((threat) => threat.title === 'Menu save as threat' && threat.status === 'Mitigated'), true);
        });
    });
});
