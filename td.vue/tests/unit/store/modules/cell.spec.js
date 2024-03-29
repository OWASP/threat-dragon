import { CELL_SELECTED, CELL_UNSELECTED, CELL_DATA_UPDATED } from '@/store/actions/cell.js';
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

        it('commits the cell data updated action', () => {
            const data = { bar: 'bar', baz: 'baz' };
            cellModule.actions[CELL_DATA_UPDATED](mocks, data);
            expect(mocks.commit).toHaveBeenCalledWith(CELL_DATA_UPDATED, data);
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

        describe('selected with threats', () => {

            beforeEach(() => {
                cell.data.threats = [{ one: 'two' }];
                cellModule.mutations[CELL_SELECTED](cellModule.state, cell);
            });

            it('sets the threats', () => {
                expect(cellModule.state.threats).toEqual([{ one: 'two' }]);
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

        describe('data updated with threats', () => {
            const newThreats = [{ name: 'one' }, { name: 'two' }];
            
            beforeEach(() => {
                cellModule.state = { ref: cell, threats: [] };
                cellModule.state.ref.setData = jest.fn();
                cellModule.mutations[CELL_DATA_UPDATED](cellModule.state, { threats: newThreats });
            });

            it('updates the data object', () => {
                expect(cellModule.state.ref.setData).toHaveBeenCalledWith({ threats: newThreats });
            });

            it('updates the threats', () => {
                expect(cellModule.state.threats).toEqual(newThreats);
            });
        });

        describe('data updated without threats', () => {
            beforeEach(() => {
                cellModule.state = { ref: cell, threats: [] };
                cellModule.state.ref.setData = jest.fn();
                cellModule.mutations[CELL_DATA_UPDATED](cellModule.state, {});
            });

            it('updates the data object', () => {
                expect(cellModule.state.ref.setData).toHaveBeenCalledWith({});
            });

            it('updates the threats', () => {
                expect(cellModule.state.threats).toEqual([]);
            });
        });

        describe('data updated without a cell ref', () => {
            beforeEach(() => {
                cellModule.state = { ref: null, threats: [] };
                cellModule.mutations[CELL_DATA_UPDATED](cellModule.state, {});
            });

            it('does not throw an error', () => {
                expect(() => cellModule.mutations[CELL_DATA_UPDATED](cellModule.state, {}))
                    .not.toThrow();
            });
        });
    });

    it('defines a getters object', () => {
        expect(cellModule.getters).toBeInstanceOf(Object);
    });
});
