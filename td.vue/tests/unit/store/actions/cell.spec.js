import { cellSelected, cellUnselected, cellDataUpdated } from '@/store/actions/cell.js';

describe('store/actions/cell.js', () => {
    it('defines a selected action', () => {
        expect(cellSelected).not.toBeUndefined();
    });

    it('defines an unselected action', () => {
        expect(cellUnselected).not.toBeUndefined();
    });

    it('defines a data updated action', () => {
        expect(cellDataUpdated).not.toBeUndefined();
    });
});
