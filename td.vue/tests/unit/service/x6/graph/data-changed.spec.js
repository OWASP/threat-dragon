import dataChanged from '@/service/x6/graph/data-changed.js';
import threats from '@/service/threats/index.js';

describe('service/x6/graph/data-changed.js', () => {
    const getCell = () => ({
        data: {},
        getData: jest.fn(),
        setData: jest.fn(),
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

    describe('updateName', () => {
        let cellData;

        beforeEach(() => {
            cellData = { name: 'Original name' };
            cell = {
                getData: jest.fn(() => cellData),
                setName: jest.fn()
            };
            console.warn = jest.fn();
        });

        it('uses the existing cell data name by default', () => {
            dataChanged.updateName(cell);
            expect(cell.setName).toHaveBeenCalledWith('Original name');
            expect(console.warn).not.toHaveBeenCalled();
        });

        it('updates the cell data before setting the diagram label', () => {
            dataChanged.updateName(cell, 'Updated name');
            expect(cellData.name).toEqual('Updated name');
            expect(cell.setName).toHaveBeenCalledWith('Updated name');
        });

        it('does not update a missing cell', () => {
            dataChanged.updateName(null, 'foobar');
            expect(cell.setName).not.toHaveBeenCalled();
            expect(console.warn).toHaveBeenCalled();
        });

        it('does not update cell that is missing setName', () => {
            dataChanged.updateName({getData: jest.fn()}, 'foobar');
            expect(cell.setName).not.toHaveBeenCalled();
            expect(console.warn).toHaveBeenCalled();
        });

        it('does not update cell that is missing getData', () => {
            dataChanged.updateName({setName: jest.fn()}, 'foobar');
            expect(cell.setName).not.toHaveBeenCalled();
            expect(console.warn).toHaveBeenCalled();
        });
    });

    describe('updateProperties', () => {
        beforeEach(() => {
            cell.getData = jest.fn(() => {return { name: 'foobar' };});
            console.debug = jest.fn();
            console.warn = jest.fn();
        });

        it('preserves existing cell data', () => {
            dataChanged.updateProperties(cell);
            expect(cell.setData).not.toHaveBeenCalled();
            expect(console.warn).not.toHaveBeenCalled();
        });

        it('provides missing cell data', () => {
            delete cell.data;
            cell.type = 'tm.Actor';
            dataChanged.updateProperties(cell);
            expect(cell.setData).toHaveBeenCalled();
            expect(console.warn).not.toHaveBeenCalled();
        });

        it('ensures edges are cell type Flow', () => {
            delete cell.data;
            cell.type = 'foo';
            cell.isEdge = jest.fn(() => true);
            dataChanged.updateProperties(cell);
            expect(cell.type).toBe('tm.Flow');
            expect(cell.setData).toHaveBeenCalled();
            expect(console.warn).not.toHaveBeenCalled();
        });

        it('warns if cell is missing', () => {
            dataChanged.updateProperties(null);
            expect(cell.setData).not.toHaveBeenCalled();
            expect(console.warn).toHaveBeenCalled();
        });
    });

    describe('setType', () => {
        beforeEach(() => {
            console.warn = jest.fn();
        });

        it('sets data type for Actor', () => {
            cell.shape = 'actor';
            dataChanged.setType(cell);
            expect(cell.data.type).toBe('tm.Actor');
            expect(console.warn).not.toHaveBeenCalled();
        });

        it('sets data type for Store', () => {
            cell.shape = 'store';
            dataChanged.setType(cell);
            expect(cell.data.type).toBe('tm.Store');
            expect(console.warn).not.toHaveBeenCalled();
        });

        it('sets data type for Process', () => {
            cell.shape = 'process';
            dataChanged.setType(cell);
            expect(cell.data.type).toBe('tm.Process');
            expect(console.warn).not.toHaveBeenCalled();
        });

        it('sets data type for Flow', () => {
            cell.shape = 'flow';
            dataChanged.setType(cell);
            expect(cell.data.type).toBe('tm.Flow');
            expect(console.warn).not.toHaveBeenCalled();
        });

        it('sets data type for Trust Boundary Box', () => {
            cell.shape = 'trust-boundary-box';
            dataChanged.setType(cell);
            expect(cell.data.type).toBe('tm.BoundaryBox');
            expect(console.warn).not.toHaveBeenCalled();
        });

        it('sets data type for Trust Boundary Curve', () => {
            cell.shape = 'trust-boundary-curve';
            dataChanged.setType(cell);
            expect(cell.data.type).toBe('tm.Boundary');
            expect(console.warn).not.toHaveBeenCalled();
        });

        it('sets data type for mispelling of Trust Boundary Curve', () => {
            cell.shape = 'trust-broundary-curve';
            dataChanged.setType(cell);
            expect(cell.data.type).toBe('tm.Boundary');
            expect(console.warn).not.toHaveBeenCalled();
        });

        it('sets data type for Text Block', () => {
            cell.shape = 'td-text-block';
            dataChanged.setType(cell);
            expect(cell.data.type).toBe('tm.Text');
            expect(console.warn).not.toHaveBeenCalled();
        });

        it('preserves data type for unrecognized shape', () => {
            cell.shape = 'foo';
            dataChanged.setType(cell);
            expect(cell.data.type).toBeUndefined();
            expect(console.warn).toHaveBeenCalled();
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
            expect(cell.updateStyle).toHaveBeenCalledWith('red', '4 3', 2.5, '');
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
            expect(cell.updateStyle).toHaveBeenCalledWith('#333333', null, 1.5, '');
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
            expect(cell.updateStyle).toHaveBeenCalledWith('#333333', null, 1.5, '');
        });
    });

    describe('trust boundary box', () => {
        beforeEach(() => {
            cell = getCell();
            cell.constructor = { name: 'BoundaryBox' };
            cell.isEdge.mockReturnValue(false);
            cell.getData.mockImplementation(() => ({
                isTrustBoundary: true
            }));
            cell.updateStyle = jest.fn();
            dataChanged.updateStyleAttrs(cell);
        });

        it('calls updateStyle', () => {
            expect(cell.updateStyle).toHaveBeenCalledWith('#333333', null, 1.5, '');
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
            cell.updateStyle = jest.fn();
            dataChanged.updateStyleAttrs(cell);
        });

        it('calls updateStyle', () => {
            expect(cell.updateStyle).toHaveBeenCalledWith('#333333', null, 1.5, '');
        });
    });

    describe('data flow', () => {
        beforeEach(() => {
            cell = getCell();
            cell.isEdge.mockReturnValue(true);
            cell.constructor = { name: 'Edge' };
            cell.getData.mockImplementation(() => ({
                isTrustBoundary: false,
                isEncrypted: true,
                isBidirectional: true
            }));
            cell.updateStyle = jest.fn();
            dataChanged.updateStyleAttrs(cell);
        });
        
        it('calls updateStyle', () => {
            expect(cell.updateStyle).toHaveBeenCalledWith('#333333', null, 1.5, 'block');
        });
    });

    describe('with an unknown shape', () => {
        beforeEach(() => {
            cell = getCell();
            cell.constructor = { name: 'FakeThingy' };
            cell.isEdge.mockReturnValue(false);
            cell.getData.mockImplementation(() => ({}));
            delete cell.data;
            dataChanged.updateStyleAttrs(cell);
        });

        it('does not call updateStyle', () => {
            expect(cell.updateStyle).not.toBeDefined();
        });
    });
});
