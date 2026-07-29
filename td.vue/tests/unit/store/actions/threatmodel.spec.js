import {
    threatmodelClear,
    threatmodelContributorsUpdated,
    threatmodelCreate,
    threatmodelDiagramClosed,
    threatmodelDiagramModified,
    threatmodelDiagramSaved,
    threatmodelDiagramSelected,
    threatmodelExportTmbom,
    threatmodelFetch,
    threatmodelFetchAll,
    threatmodelLoadDemos,
    threatmodelModified,
    threatmodelNotModified,
    threatmodelRestore,
    threatmodelSave,
    threatmodelSelected,
    threatmodelStash,
    threatmodelUpdate
} from '@/store/actions/threatmodel';
import threatmodel from '@/store/actions/threatmodel'; // eslint-disable-line no-duplicate-imports

describe('store/actions/threatmodel.js', () => {
    it('defines a clear action', () => {
        expect(threatmodelClear).toBeDefined();
        expect(threatmodel.clear).toBeDefined();
    });

    it('defines a contributors updated action', () => {
        expect(threatmodelContributorsUpdated).toBeDefined();
        expect(threatmodel.contributorsUpdated).toBeDefined();
    });

    it('defines a create action', () => {
        expect(threatmodelCreate).toBeDefined();
        expect(threatmodel.create).toBeDefined();
    });

    it('defines a modified diagram closed action', () => {
        expect(threatmodelDiagramClosed).toBeDefined();
        expect(threatmodel.diagramClosed).toBeDefined();
    });

    it('defines a modified diagram modified action', () => {
        expect(threatmodelDiagramModified).toBeDefined();
        expect(threatmodel.diagramModified).toBeDefined();
    });

    it('defines a modified diagram saved action', () => {
        expect(threatmodelDiagramSaved).toBeDefined();
        expect(threatmodel.diagramSaved).toBeDefined();
    });

    it('defines a diagram selected action', () => {
        expect(threatmodelDiagramSelected).toBeDefined();
        expect(threatmodel.diagramSelected).toBeDefined();
    });

    it('defines an export as TM-BOM action', () => {
        expect(threatmodelExportTmbom).toBeDefined();
        expect(threatmodel.exportTmBom).toBeDefined();
    });

    it('defines a fetch action', () => {
        expect(threatmodelFetch).toBeDefined();
        expect(threatmodel.fetch).toBeDefined();
    });

    it('defines a fetch all action', () => {
        expect(threatmodelFetchAll).toBeDefined();
        expect(threatmodel.fetchAll).toBeDefined();
    });

    it('defines a load demos action', () => {
        expect(threatmodelLoadDemos).toBeDefined();
        expect(threatmodel.loadDemos).toBeDefined();
    });

    it('defines a modified flag action', () => {
        expect(threatmodelModified).toBeDefined();
        expect(threatmodel.modified).toBeDefined();
    });

    it('defines an unmodified flag action', () => {
        expect(threatmodelNotModified).toBeDefined();
        expect(threatmodel.notModified).toBeDefined();
    });

    it('defines a restore action', () => {
        expect(threatmodelRestore).toBeDefined();
        expect(threatmodel.restore).toBeDefined();
    });

    it('defines a save action', () => {
        expect(threatmodelSave).toBeDefined();
        expect(threatmodel.saveModel).toBeDefined();
    });

    it('defines a selected action', () => {
        expect(threatmodelSelected).toBeDefined();
        expect(threatmodel.selected).toBeDefined();
    });

    it('defines a set immutable copy action', () => {
        expect(threatmodelStash).toBeDefined();
        expect(threatmodel.stash).toBeDefined();
    });

    it('defines an update action', () => {
        expect(threatmodelUpdate).toBeDefined();
        expect(threatmodel.update).toBeDefined();
    });
});
