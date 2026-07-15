import threats from '@/service/migration/otm/cells/threats';

import otmModel from '../../otm-test-model';

describe('service/migration/otm/cells/threats.js', () => {
    const testNode = {threats: [
        {threat: 'test-threat1', state: 'exposed'}
    ]};
    const testMaxNode = {threats: [
        {
            threat: 'test-threat1',
            state: 'exposed',
            mitigations: [{mitigation: 'test-mitigation1', state: 'required'}, {mitigation: 'minimal-test-mitigation2', state: 'required'}]
        },
        {
            threat: 'minimal-test-threat2',
            state: 'accepted',
            mitigations: [{mitigation: 'test-mitigation1', state: 'required'}, {mitigation: 'minimal-test-mitigation2', state: 'required'}]
        }
    ]};

    describe('creating threats', () => {
        let nodeThreats;

        beforeEach(() => {
            console.warn = jest.fn();
        });

        it('creates threat title and ID', () => {
            nodeThreats = threats.merge(otmModel, testNode);
            expect(console.warn).not.toHaveBeenCalled();
            expect(nodeThreats.length).toBeGreaterThanOrEqual(1);
            expect(nodeThreats[0].id.length).toBeGreaterThan(16);
            expect(nodeThreats[0].title.length).toBeGreaterThanOrEqual(1);
        });

        it('creates threat description', () => {
            nodeThreats = threats.merge(otmModel, testNode);
            expect(console.warn).not.toHaveBeenCalled();
            expect(nodeThreats.length).toBeGreaterThanOrEqual(1);
            expect(nodeThreats[0].description.length).toBeGreaterThanOrEqual(1);
        });

        it('creates threat minimal description', () => {
            nodeThreats = threats.merge(otmModel, {threats: [{threat: 'minimal-test-threat2', state: 'accepted'}]});
            expect(console.warn).not.toHaveBeenCalled();
            expect(nodeThreats.length).toBeGreaterThanOrEqual(1);
            expect(nodeThreats[0].description).not.toMatch('likelihood');
            expect(nodeThreats[0].description).not.toMatch('impact');
        });

        it('creates threat mitigation', () => {
            testNode.threats[0].mitigations = [{mitigation: 'test-mitigation1', state: 'required'}];
            nodeThreats = threats.merge(otmModel, testNode);
            expect(console.warn).not.toHaveBeenCalled();
            expect(nodeThreats.length).toBeGreaterThanOrEqual(1);
            expect(nodeThreats[0].mitigation.length).toBeGreaterThanOrEqual(1);
        });

        it('creates threat minimal mitigation', () => {
            testNode.threats[0].mitigations = [{mitigation: 'minimal-test-mitigation2', state: 'required'}];
            nodeThreats = threats.merge(otmModel, testNode);
            expect(console.warn).not.toHaveBeenCalled();
            expect(nodeThreats.length).toBeGreaterThanOrEqual(1);
            expect(nodeThreats[0].mitigation).toMatch('Mitigation');
        });

        it('creates multiple threats and multiple mitigations', () => {
            nodeThreats = threats.merge(otmModel, testMaxNode);
            expect(console.warn).not.toHaveBeenCalled();
            expect(nodeThreats).toHaveLength(2);
            expect(nodeThreats[0].mitigation).toBeDefined();
            expect(nodeThreats[1].mitigation).toBeDefined();
        });

        it('creates threat when threat mitigation not found', () => {
            testNode.threats[0].mitigations = [{mitigation: 'foo', state: 'required'}];
            nodeThreats = threats.merge(otmModel, testNode);
            expect(console.warn).toHaveBeenCalled();
            expect(nodeThreats.length).toBeGreaterThanOrEqual(1);
            expect(nodeThreats[0].mitigation).toBeDefined();
            expect(nodeThreats[0].mitigation).toHaveLength(0);
        });

        it('creates empty threats when threat not found', () => {
            nodeThreats = threats.merge(otmModel, {threats: [{threat: 'foo', state: 'bar'}]});
            expect(console.warn).toHaveBeenCalled();
            expect(nodeThreats).toHaveLength(0);
        });

        it('creates empty threats on empty node threats', () => {
            nodeThreats = threats.merge(otmModel, {});
            expect(console.warn).not.toHaveBeenCalled();
            expect(nodeThreats).toHaveLength(0);
        });


        it('creates empty threats on empty model threats', () => {
            nodeThreats = threats.merge({}, testNode);
            expect(console.warn).not.toHaveBeenCalled();
            expect(nodeThreats).toHaveLength(0);
        });
    });

    describe('calculating type', () => {
        it('calculates STRIDE type', () => {
            const strideThreat = threats.merge(otmModel, testNode);
            expect(strideThreat).toHaveLength(1);
            expect(strideThreat[0].modelType).toMatch('STRIDE');
            expect(strideThreat[0].type).toMatch('Spoofing');
        });

        it('calculates Generic type', () => {
            const genericThreat = threats.merge(otmModel, testMaxNode);
            expect(genericThreat).toHaveLength(2);
            expect(genericThreat[1].modelType).toMatch('Generic');
            expect(genericThreat[1].type).toMatch('Generic');
        });
    });

    describe('calculating severity', () => {
        it('calculates Critical severity', () => {
            const criticalThreat = threats.merge(otmModel, {threats: [{threat: 'critical-test-threat4', state: 'foo'}]});
            expect(criticalThreat).toHaveLength(1);
            expect(criticalThreat[0].severity).toMatch('Critical');
        });

        it('calculates High severity', () => {
            const highThreat = threats.merge(otmModel, {threats: [{threat: 'high-test-threat3', state: 'foo'}]});
            expect(highThreat).toHaveLength(1);
            expect(highThreat[0].severity).toMatch('High');
        });

        it('calculates Medium severity', () => {
            const mediumThreat = threats.merge(otmModel, testNode);
            expect(mediumThreat).toHaveLength(1);
            expect(mediumThreat[0].severity).toMatch('Medium');
        });

        it('calculates Low severity', () => {
            const lowThreat = threats.merge(otmModel, {threats: [{threat: 'minimal-test-threat2', state: 'foo'}]});
            expect(lowThreat).toHaveLength(1);
            expect(lowThreat[0].severity).toMatch('Low');
        });
    });
});
