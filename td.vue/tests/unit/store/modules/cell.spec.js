import { cellSelected, cellUnselected, cellDataUpdated } from '@/store/actions/cell.js';
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
        it('commits the selected cell', () => {
            const cell = { bar: 'bar', baz: 'baz' };
            cellModule.actions[cellSelected](mocks, cell);
            expect(mocks.commit).toHaveBeenCalledWith(cellSelected, cell);
        });

        it('commits the unselected action', () => {
            cellModule.actions[cellUnselected](mocks);
            expect(mocks.commit).toHaveBeenCalledWith(cellUnselected);
        });

        it('commits the cell data updated action', () => {
            const data = { bar: 'bar', baz: 'baz' };
            cellModule.actions[cellDataUpdated](mocks, data);
            expect(mocks.commit).toHaveBeenCalledWith(cellDataUpdated, data);
        });
    });

    describe('mutations', () => {
        const cell = { data: { threats: ['foo', 'bar', 'baz']}, id: 'foobar' };

        describe('selected', () => {
            it('sets the cell properties', () => {
                cellModule.mutations[cellSelected](cellModule.state, cell);
                expect(cellModule.state.ref).toEqual(cell);
            });

            it('copies the threats', () => {
                cellModule.mutations[cellSelected](cellModule.state, cell);
                expect(cellModule.state.threats).toHaveLength(cell.data.threats.length);
                expect(cellModule.state.threats[2]).toEqual(cell.data.threats[2]);
            });

            it('sets the cell properties with no cell data', () => {
                cellModule.mutations[cellSelected](cellModule.state, null);
                expect(cellModule.state.ref).toBeNull();
            });
        });

        describe('unselected', () => {
            beforeEach(() => {
                cellModule.state = { ref: cell };
                cellModule.mutations[cellUnselected](cellModule.state);
            });

            it('clears the state', () => {
                expect(cellModule.state.ref).toEqual(null);
            });
        });

        describe('data updated', () => {
            const data = { threats: ['foo', 'bar', 'baz']};

            beforeEach(() => {
                cellModule.state = { ref: cell, threats: [] };
                cellModule.state.ref.setData = jest.fn();
                cellModule.mutations[cellDataUpdated](cellModule.state, data);
            });

            it('updates the data object', () => {
                expect(cellModule.state.ref.setData).toHaveBeenCalledWith(data);
            });

            it('updates the threats', () => {
                expect(cellModule.state.threats).toHaveLength(data.threats.length);
                expect(cellModule.state.threats[2]).toEqual(data.threats[2]);
            });
        });

        describe('data updated without threats', () => {
            beforeEach(() => {
                cellModule.state = { ref: cell, threats: [] };
                cellModule.state.ref.setData = jest.fn();
                cellModule.mutations[cellDataUpdated](cellModule.state, {});
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
                cellModule.mutations[cellDataUpdated](cellModule.state, {});
            });

            it('does not throw an error', () => {
                expect(() => cellModule.mutations[cellDataUpdated](cellModule.state, {}))
                    .not.toThrow();
            });
        });
    });

    it('defines a getters object', () => {
        expect(cellModule.getters).toBeInstanceOf(Object);
    });
});
