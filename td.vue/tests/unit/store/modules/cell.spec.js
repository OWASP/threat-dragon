import { CELL_SELECTED, CELL_UNSELECTED } from '@/store/actions/cell.js';
import cellModule, { clearState } from '@/store/modules/cell.js';

describe('store/modules/cell.js', () => {
    const mocks = {
        commit: () => {},
        dispatch: () => {}
    };

    beforeEach(() => {
        jest.spyOn(mocks, 'commit');
        jest.spyOn(mocks, 'dispatch');
    });

    afterEach(() => {
        clearState(cellModule.state);
    });

    describe('state', () => {
        it('defines a state object', () => {
            expect(cellModule.state).toBeInstanceOf(Object);
        });
    });

    describe('actions', () => {
        it('commits the unselected action', () => {
            cellModule.actions[CELL_UNSELECTED](mocks);
            expect(mocks.commit).toHaveBeenCalledWith(CELL_UNSELECTED);
        });

        it('commits the selected cell', () => {
            const cell = { bar: 'bar', baz: 'baz' };
            cellModule.actions[CELL_SELECTED](mocks, cell);
            expect(mocks.commit).toHaveBeenCalledWith(CELL_SELECTED, cell);
        });
    });

    describe('mutations', () => {
        const cell = { data: { bar: 'bar', baz: 'baz' }, id: 'foo' };

        describe('selected', () => {    
            beforeEach(() => {
                cellModule.mutations[CELL_SELECTED](cellModule.state, cell);
            });

            it('sets the ref', () => {
                expect(cellModule.state.ref).toEqual(cell);
            });
        });

        describe('unselected', () => {
            beforeEach(() => {
                cellModule.state = { ref: cell };
                cellModule.mutations[CELL_UNSELECTED](cellModule.state);
            });

            it('clears the state', () => {
                expect(cellModule.state.ref).toEqual(null);
            });
        });
    });

    it('defines a getters object', () => {
        expect(cellModule.getters).toBeInstanceOf(Object);
    });
});
