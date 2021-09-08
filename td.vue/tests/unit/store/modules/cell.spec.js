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
        it('defines a data object', () => {
            expect(cellModule.state.data).toBeInstanceOf(Object);
        });
    });

    describe('actions', () => {
        it('commits the unselected action', () => {
            cellModule.actions[CELL_UNSELECTED](mocks);
            expect(mocks.commit).toHaveBeenCalledWith(CELL_UNSELECTED);
        });

        it('commits the selected cell', () => {
            const params = { bar: 'bar', baz: 'baz' };
            cellModule.actions[CELL_SELECTED](mocks, params);
            expect(mocks.commit).toHaveBeenCalledWith(CELL_SELECTED, params);
        });
    });

    describe('mutations', () => {
        const params = { data: { bar: 'bar', baz: 'baz' }, id: 'foo' };

        describe('selected', () => {    
            beforeEach(() => {
                cellModule.mutations[CELL_SELECTED](cellModule.state, params);
            });

            it('sets the data', () => {
                expect(cellModule.state.data).toEqual(params.data);
            });

            it('sets the id', () => {
                expect(cellModule.state.id).toEqual(params.id);
            });
        });

        describe('unselected', () => {
            beforeEach(() => {
                cellModule.state = params;
                cellModule.mutations[CELL_UNSELECTED](cellModule.state);
            });

            it('clears the state', () => {
                expect(cellModule.state.data).toEqual({});
            });
        });
    });

    it('defines a getters object', () => {
        expect(cellModule.getters).toBeInstanceOf(Object);
    });
});
