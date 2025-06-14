import data from '@/service/diagram/v1/data.js';
import edges from '@/service/diagram/v1/edges.js';
import threats from '@/service/threats/index.js';
import store from '@/service/x6/shapes/store';

describe('service/diagram/v1/data.js', () => {
    let cell, res;

    const getCell = () => ({
        name: 'test',
        description: 'foo',
        isTrustBoundary: false
    });

    beforeEach(() => {
        edges.applyData = jest.fn();
        threats.hasOpenThreats = jest.fn().mockReturnValue(false);
    });

    it('applies actor data', () => {
        cell = getCell();
        cell.type = 'tm.Actor';
        cell.providesAuthentication = false;
        res = data.map({}, cell);

        expect(res.data).toEqual(expect.objectContaining(cell));
    });

    it('applies store data', () => {
        cell = getCell();
        cell.type = 'tm.Store';
        cell.isALog = true;
        cell.storesCredentials = false;
        store.isEncrypted = true;
        store.isSigned = false;
        res = data.map({}, cell);

        expect(res.data).toEqual(expect.objectContaining(cell));
    });

    it('applies trust boundary data', () => {
        cell = getCell();
        cell.type = 'tm.Boundary';
        res = data.map({}, cell);

        expect(res.data.isTrustBoundary).toEqual(true);
    });

    it('gest the name from attrs.text.text', () => {
        cell = getCell();
        delete cell.name;
        cell.type = 'tm.Actor';
        cell.attrs = { text: { text: 'my store' }};
        res = data.map({}, cell);

        expect(res.data.name).toEqual('my store');
    });

    it('gest the name from labels[0].attrs.text.text', () => {
        cell = getCell();
        delete cell.name;
        cell.type = 'tm.Actor';
        cell.labels = [{ attrs: { text: { text: 'my store' }}}];
        res = data.map({}, cell);

        expect(res.data.name).toEqual('my store');
    });

    it('does not find a name', () => {
        cell = getCell();
        delete cell.name;
        cell.type = 'tm.Actor';
        res = data.map({}, cell);

        expect(res.data.name).toEqual('');
    });

    it('does not find a description', () => {
        cell = getCell();
        delete cell.description;
        cell.type = 'tm.Actor';
        res = data.map({}, cell);

        expect(res.data.description).toEqual('');
    });

    it('updates threat data', () => {
        cell = getCell();
        cell.type = 'tm.Process';
        cell.threats = [{ modelType: 'foo' }];
        res = data.map({}, cell);
        
        expect(res.data.threats).toHaveLength(1);
    });

    it('does not modify the threat id', () => {
        const threatId = '1234567';
        cell = getCell();
        cell.type = 'tm.Process';
        cell.threats = [{ modelType: 'foo', id: threatId }];
        res = data.map({}, cell);
        
        expect(res.data.threats[0].id).toEqual(threatId);
    });

    it('copies a valid modelType from the cell to the threat', () => {
        const threatId = '1234567';
        cell = getCell();
        cell.type = 'tm.Process';
        cell.modelType = 'LINDDUN';
        cell.threats = [{ type: 'Foo', id: threatId }];
        res = data.map({}, cell);
        
        expect(res.data.threats[0].modelType).toEqual('LINDDUN');
    });

    it('uses the threat-type to determine the modelType when the cell does not contain a modelType', () => {
        const threatId = '1234567';
        cell = getCell();
        cell.type = 'tm.Process';
        cell.threats = [{ type: 'Linkability', id: threatId }];
        res = data.map({}, cell);
        
        expect(res.data.threats[0].modelType).toEqual('LINDDUN');
    });
});
