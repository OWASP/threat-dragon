import actor from '@/service/x6/shapes/actor.js';
import dataChanged from '@/service/x6/graph/data-changed.js';
import processShape from '@/service/x6/shapes/process.js';
import store from '@/service/x6/shapes/store.js';

describe('service/x6/graph/data-changed.js', () => {
    const getCell = () => ({
        getData: jest.fn(),
        setAttrByPath: jest.fn()
    });
    let cell;

    beforeEach(() => {
        cell = getCell();
    });

    describe('new cell without data', () => {
        beforeEach(() => {
            dataChanged.updateStyleAttrs(cell);
        });

        it('calls get data and returns', () => {
            expect(cell.getData).toHaveBeenCalledTimes(1);
        });
    });

    describe('actor', () => {
        beforeEach(() => {
            cell = getCell();
            cell.constructor = { name: 'Actor' };
            cell.getData.mockImplementation(() => ({
                hasOpenThreats: true,
                outOfScope: true
            }));
            actor.updateStyle = jest.fn();
            dataChanged.updateStyleAttrs(cell);
        });

        it('calls updateStyle', () => {
            expect(actor.updateStyle).toHaveBeenCalledWith(cell, 'red', '2 2', 3.0);
        });
    });

    describe('processShape', () => {
        beforeEach(() => {
            cell = getCell();
            cell.constructor = { name: 'Process' };
            cell.getData.mockImplementation(() => ({
                hasOpenThreats: false,
                outOfScope: false
            }));
            processShape.updateStyle = jest.fn();
            dataChanged.updateStyleAttrs(cell);
        });

        it('calls updateStyle', () => {
            expect(processShape.updateStyle).toHaveBeenCalledWith(cell, '#333333', null, 1.0);
        });
    });

    describe('store', () => {
        beforeEach(() => {
            cell = getCell();
            cell.constructor = { name: 'Store' };
            cell.getData.mockImplementation(() => ({}));
            store.updateStyle = jest.fn();
            dataChanged.updateStyleAttrs(cell);
        });

        it('calls updateStyle', () => {
            expect(store.updateStyle).toHaveBeenCalledWith(cell, '#333333', null, 1.0);
        });
    });

    describe('with an unknown shape', () => {
        beforeEach(() => {
            cell = getCell();
            cell.constructor = { name: 'FakeThingy' };
            cell.getData.mockImplementation(() => ({}));
            processShape.updateStyle = jest.fn();
            store.updateStyle = jest.fn();
            actor.updateStyle = jest.fn();
            dataChanged.updateStyleAttrs(cell);
        });

        it('does not call updateStyle for actor', () => {
            expect(actor.updateStyle).not.toHaveBeenCalled();
        });

        it('does not call updateStyle for processShape', () => {
            expect(processShape.updateStyle).not.toHaveBeenCalled();
        });

        it('does not call updateStyle for store', () => {
            expect(store.updateStyle).not.toHaveBeenCalled();
        });
    });

    describe('trust boundary', () => {
        beforeEach(() => {
            cell = getCell();
            cell.constructor = { name: 'Edge' };
            cell.getData.mockImplementation(() => ({
                isTrustBoundary: true
            }));
            dataChanged.updateStyleAttrs(cell);
        });

        it('sets the stroke', () => {
            expect(cell.setAttrByPath)
                .toHaveBeenCalledWith('line/stroke', 'green');
        });

        it('sets the strokeDasharray', () => {
            expect(cell.setAttrByPath)
                .toHaveBeenCalledWith('line/strokeDasharray', '5 5');
        });

        it('sets the strokeWidth', () => {
            expect(cell.setAttrByPath)
                .toHaveBeenCalledWith('line/strokeWidth', 3);
        });

        it('removes the source marker', () => {
            expect(cell.setAttrByPath)
                .toHaveBeenCalledWith('line/sourceMarker', '');
        });

        it('removes the target marker', () => {
            expect(cell.setAttrByPath)
                .toHaveBeenCalledWith('line/targetMarker', '');
        });
    });

    describe('data flow', () => {
        beforeEach(() => {
            cell = getCell();
            cell.constructor = { name: 'Edge' };
        });

        beforeEach(() => {
            cell.getData.mockImplementation(() => ({
                isTrustBoundary: false,
                isEncrypted: true
            }));
            dataChanged.updateStyleAttrs(cell);
        });

        it('sets the stroke', () => {
            expect(cell.setAttrByPath)
                .toHaveBeenCalledWith('line/stroke', '#333333');
        });

        it('sets the strokeDasharray', () => {
            expect(cell.setAttrByPath)
                .toHaveBeenCalledWith('line/strokeDasharray', null);
        });

        it('sets the target marker to classic', () => {
            expect(cell.setAttrByPath)
                .toHaveBeenCalledWith('line/targetMarker/name', 'classic');
        });
    });
});
