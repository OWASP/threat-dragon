import {
    THREATMODEL_CLEAR,
    THREATMODEL_CONTRIBUTORS_UPDATED,
    THREATMODEL_CREATE,
    THREATMODEL_DIAGRAM_CLOSED,
    THREATMODEL_DIAGRAM_MODIFIED,
    THREATMODEL_DIAGRAM_SAVED,
    THREATMODEL_DIAGRAM_SELECTED,
    THREATMODEL_EXPORT_TMBOM,
    THREATMODEL_FETCH,
    THREATMODEL_FETCH_ALL,
    THREATMODEL_LOAD_DEMOS,
    THREATMODEL_MODIFIED,
    THREATMODEL_NOT_MODIFIED,
    THREATMODEL_RESTORE,
    THREATMODEL_SAVE,
    THREATMODEL_SELECTED,
    THREATMODEL_STASH,
    THREATMODEL_UPDATE
} from '@/store/actions/threatmodel';
import threatmodel from '@/store/actions/threatmodel'; // eslint-disable-line no-duplicate-imports

describe('store/actions/threatmodel.js', () => {
    it('defines a clear action', () => {
        expect(THREATMODEL_CLEAR).toBeDefined();
        expect(threatmodel.clear).toBeDefined();
    });

    it('defines a contributors updated action', () => {
        expect(THREATMODEL_CONTRIBUTORS_UPDATED).toBeDefined();
        expect(threatmodel.contributorsUpdated).toBeDefined();
    });

    it('defines a create action', () => {
        expect(THREATMODEL_CREATE).toBeDefined();
        expect(threatmodel.create).toBeDefined();
    });

    it('defines a modified diagram closed action', () => {
        expect(THREATMODEL_DIAGRAM_CLOSED).toBeDefined();
        expect(threatmodel.diagramClosed).toBeDefined();
    });

    it('defines a modified diagram modified action', () => {
        expect(THREATMODEL_DIAGRAM_MODIFIED).toBeDefined();
        expect(threatmodel.diagramModified).toBeDefined();
    });

    it('defines a modified diagram saved action', () => {
        expect(THREATMODEL_DIAGRAM_SAVED).toBeDefined();
        expect(threatmodel.diagramSaved).toBeDefined();
    });

    it('defines a diagram selected action', () => {
        expect(THREATMODEL_DIAGRAM_SELECTED).toBeDefined();
        expect(threatmodel.diagramSelected).toBeDefined();
    });

    it('defines an export as TM-BOM action', () => {
        expect(THREATMODEL_EXPORT_TMBOM).toBeDefined();
        expect(threatmodel.exportTmBom).toBeDefined();
    });

    it('defines a fetch action', () => {
        expect(THREATMODEL_FETCH).toBeDefined();
        expect(threatmodel.fetch).toBeDefined();
    });

    it('defines a fetch all action', () => {
        expect(THREATMODEL_FETCH_ALL).toBeDefined();
        expect(threatmodel.fetchAll).toBeDefined();
    });

    it('defines a load demos action', () => {
        expect(THREATMODEL_LOAD_DEMOS).toBeDefined();
        expect(threatmodel.loadDemos).toBeDefined();
    });

    it('defines a modified flag action', () => {
        expect(THREATMODEL_MODIFIED).toBeDefined();
        expect(threatmodel.modified).toBeDefined();
    });

    it('defines an unmodified flag action', () => {
        expect(THREATMODEL_NOT_MODIFIED).toBeDefined();
        expect(threatmodel.notModified).toBeDefined();
    });

    it('defines a restore action', () => {
        expect(THREATMODEL_RESTORE).toBeDefined();
        expect(threatmodel.restore).toBeDefined();
    });

    it('defines a save action', () => {
        expect(THREATMODEL_SAVE).toBeDefined();
        expect(threatmodel.saveModel).toBeDefined();
    });

    it('defines a selected action', () => {
        expect(THREATMODEL_SELECTED).toBeDefined();
        expect(threatmodel.selected).toBeDefined();
    });

    it('defines a set immutable copy action', () => {
        expect(THREATMODEL_STASH).toBeDefined();
        expect(threatmodel.stash).toBeDefined();
    });

    it('defines an update action', () => {
        expect(THREATMODEL_UPDATE).toBeDefined();
        expect(threatmodel.update).toBeDefined();
    });
});
