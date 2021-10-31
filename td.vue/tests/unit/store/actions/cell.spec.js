import { CELL_SELECTED, CELL_UNSELECTED, CELL_DATA_UPDATED } from '@/store/actions/cell.js';

describe('store/actions/cell.js', () => {
    it('defines a selected action', () => {
        expect(CELL_SELECTED).not.toBeUndefined();
    });

    it('defines an unselected action', () => {
        expect(CELL_UNSELECTED).not.toBeUndefined();
    });

    it('defines a data updated action', () => {
        expect(CELL_DATA_UPDATED).not.toBeUndefined();
    });
});
