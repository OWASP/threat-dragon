import dataChanged from '@/service/x6/graph/data-changed.js';
import threats from '@/service/threats/index.js';

describe('service/x6/graph/data-changed.js', () => {
    const getCell = () => ({
        data: {},
        getData: jest.fn(),
        setAttrByPath: jest.fn(),
        isEdge: jest.fn()
    });
    let cell;

    beforeEach(() => {
        threats.hasOpenThreats = jest.fn();
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
            cell.isEdge.mockReturnValue(false);
            cell.constructor = { name: 'Actor' };
            cell.getData.mockImplementation(() => ({
                hasOpenThreats: true,
                outOfScope: true
            }));
            cell.updateStyle = jest.fn();
            dataChanged.updateStyleAttrs(cell);
        });

        it('calls updateStyle', () => {
            expect(cell.updateStyle).toHaveBeenCalledWith('red', '4 3', 2.5);
        });
    });

    describe('processShape', () => {
        beforeEach(() => {
            cell = getCell();
            cell.isEdge.mockReturnValue(false);
            cell.constructor = { name: 'Process' };
            cell.getData.mockImplementation(() => ({
                hasOpenThreats: false,
                outOfScope: false
            }));
            cell.updateStyle = jest.fn();
            dataChanged.updateStyleAttrs(cell);
        });

        it('calls updateStyle', () => {
            expect(cell.updateStyle).toHaveBeenCalledWith('#333333', null, 1.5);
        });
    });

    describe('store', () => {
        beforeEach(() => {
            cell = getCell();
            cell.constructor = { name: 'Store' };
            cell.isEdge.mockReturnValue(false);
            cell.getData.mockImplementation(() => ({}));
            cell.updateStyle = jest.fn();
            dataChanged.updateStyleAttrs(cell);
        });

        it('calls updateStyle', () => {
            expect(cell.updateStyle).toHaveBeenCalledWith('#333333', null, 1.5);
        });
    });

    describe('with an unknown shape', () => {
        beforeEach(() => {
            cell = getCell();
            cell.constructor = { name: 'FakeThingy' };
            cell.isEdge.mockReturnValue(false);
            cell.getData.mockImplementation(() => ({}));
            dataChanged.updateStyleAttrs(cell);
        });

        it('does not call updateStyle for the unknown shape', () => {
            expect(cell.updateStyle).not.toBeDefined();
        });
    });

    describe('trust boundary', () => {
        beforeEach(() => {
            cell = getCell();
            cell.constructor = { name: 'Edge' };
            cell.isEdge.mockReturnValue(true);
            cell.getData.mockImplementation(() => ({
                isTrustBoundary: true
            }));
            dataChanged.updateStyleAttrs(cell);
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
            cell.isEdge.mockReturnValue(true);
            cell.constructor = { name: 'Edge' };
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

        it('sets the target marker to block', () => {
            expect(cell.setAttrByPath)
                .toHaveBeenCalledWith('line/targetMarker/name', 'block');
        });
    });
});
