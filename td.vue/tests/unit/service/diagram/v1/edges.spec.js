import edges from '@/service/diagram/v1/edges.js';
import labels from '@/service/diagram/v1/labels.js';

describe('service/diagram/v1/edges.js', () => {
    describe('applyData', () => {
        const getCell = () => ({
            protocol: 'foo',
            isEncrypted: true,
            isPublicNetwork: true
        });
        
        const getData = () => ({
            type: 'tm.Flow'
        });

        it('does not modify data for anything other than flows', () => {
            const data = { type: 'tm.Boundary' };
            const startingData = JSON.stringify(data);
            edges.applyData({}, data);
            expect(startingData).toEqual(JSON.stringify(data));
        });

        it('sets the protocol', () => {
            const data = getData();
            edges.applyData(getCell(), data);
            expect(data.protocol).toEqual('foo');
        });

        it('sets isEncrypted', () => {
            const data = getData();
            edges.applyData(getCell(), data);
            expect(data.isEncrypted).toEqual(true);
        });

        it('sets the isPublicNetwork', () => {
            const data = getData();
            edges.applyData(getCell(), data);
            expect(data.isPublicNetwork).toEqual(true);
        });

        it('sets an empty protocol', () => {
            const data = getData();
            const cell = getCell();
            delete cell.protocol;
            edges.applyData(cell, data);
            expect(data.protocol).toEqual('');
        });
    });

    describe('map', () => {
        let cell, constructor, mapFn;

        const getCell = () => ({
            source: 'the source',
            target: 'the target',
            vertices: [1, 2, 3]
        });

        beforeEach(() => {
            labels.getText = jest.fn();
            constructor = jest.fn();
            cell = getCell();
            mapFn = edges.map(constructor);
            mapFn(cell);
        });

        it('sets the source', () => {
            expect(constructor).toHaveBeenCalledWith(expect.objectContaining({
                source: cell.source
            }));
        });

        it('sets the target', () => {
            expect(constructor).toHaveBeenCalledWith(expect.objectContaining({
                target: cell.target
            }));
        });

        it('sets the vertices', () => {
            expect(constructor).toHaveBeenCalledWith(expect.objectContaining({
                vertices: cell.vertices
            }));
        });
    });

    it('sets the labels', () => {
        labels.getText = jest.fn().mockReturnValue('asdf');
        const constructor = jest.fn();
        const cell = {
            source: 'the source',
            target: 'the target',
            vertices: [1, 2, 3],
            labels: [{
                position: { x: 1, y: 2 }
            }]
        };
        const mapFn = edges.map(constructor);
        mapFn(cell);

        expect(constructor).toHaveBeenCalledWith(expect.objectContaining({
            labels: [{
                position: cell.labels[0].position,
                attrs: {
                    label: {
                        text: 'asdf'
                    }
                }
            }]
        }));
    });
});
