import {
    THREATMODEL_CLEAR,
    THREATMODEL_CREATE,
    THREATMODEL_DIAGRAM_SELECTED,
    THREATMODEL_FETCH,
    THREATMODEL_FETCH_ALL,
    THREATMODEL_SELECTED,
} from '@/store/actions/threatmodel.js';

describe('store/actions/threatmodel.js', () => {
    it('defines a clear action', () => {
        expect(THREATMODEL_CLEAR).not.toBeUndefined();
    });

    it('defines a fetch action', () => {
        expect(THREATMODEL_FETCH).not.toBeUndefined();
    });

    it('defines a fetch all action', () => {
        expect(THREATMODEL_FETCH_ALL).not.toBeUndefined();
    });

    it('defines a selected action', () => {
        expect(THREATMODEL_SELECTED).not.toBeUndefined();
    });

    it('defines a diagram selected action', () => {
        expect(THREATMODEL_DIAGRAM_SELECTED).not.toBeUndefined();
    });

    it('defines a create action', () => {
        expect(THREATMODEL_CREATE).not.toBeUndefined();
    });
});
