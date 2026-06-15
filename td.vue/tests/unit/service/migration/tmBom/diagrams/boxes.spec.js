import boxes from '@/service/migration/tmBom/diagrams/boxes';
import tdModel from '../td-test-model';
import tmBomModel from '../tmbom-test-model';

describe('service/migration/tmBom/diagrams/boxes.js', () => {

    describe('convert/export TM-BOM trust zones', () => {
        let trustZones;
        let nodes;
        beforeEach(() => {
            nodes = {
                actors: [{symbolic_name: 'actor0'}, {symbolic_name: 'actor1'}, {symbolic_name: 'test-actor'}],
                components: [{symbolic_name: 'component1'}, {symbolic_name: 'component2'}, {symbolic_name: 'test-component'}],
                data_stores: [{symbolic_name: 'store1'}, {symbolic_name: 'store2'}, {symbolic_name: 'test-store'}]
            };
            trustZones = boxes.convert(tdModel, nodes);
        });

        it('converts boundary boxes to trust zones', () => {
            expect(trustZones.length).toBeGreaterThan(4);
            expect(trustZones.findIndex((x) => x.symbolic_name === 'trust-boundary-box0')).toBeGreaterThanOrEqual(0);
        });

        it('converts boundary curves to trust zones', () => {
            expect(trustZones.findIndex((x) => x.symbolic_name === 'trust-boundary-curve0')).toBeGreaterThanOrEqual(0);
        });

        it('populates the trust zones', () => {
            expect(trustZones.find((x) => x.symbolic_name === undefined)).toBeUndefined();
            expect(trustZones.find((x) => x.title === undefined)).toBeUndefined();
            expect(trustZones.find((x) => x.description === undefined)).toBeUndefined();
        });

        it('provides actors with trust zones', () => {
            expect(nodes.actors.find((x) => x.trust_zone === 'trust-boundary-box1')).toBeDefined();
            expect(nodes.actors.find((x) => x.trust_zone === 'trust-boundary-box2')).toBeUndefined();
            expect(nodes.actors.find((x) => x.trust_zone === 'trust-boundary-curve0')).toBeUndefined();
            expect(nodes.actors.find((x) => x.trust_zone === undefined)).toBeDefined();
        });

        it('provides components with trust zones', () => {
            expect(nodes.components.find((x) => x.trust_zone === 'trust-boundary-box1')).toBeDefined();
            expect(nodes.components.find((x) => x.trust_zone === 'trust-boundary-box2')).toBeDefined();
            expect(nodes.components.find((x) => x.trust_zone === undefined)).toBeDefined();
        });

        it('provides data stores with trust zones', () => {
            expect(nodes.data_stores.find((x) => x.trust_zone === 'trust-boundary-box1')).toBeDefined();
            expect(nodes.data_stores.find((x) => x.trust_zone === 'trust-boundary-box2')).toBeDefined();
            expect(nodes.data_stores.find((x) => x.trust_zone === undefined)).toBeDefined();
        });
    });

    describe('merge/import TM-BOM trust zones', () => {
        let testBoundaryBoxes;
        beforeEach(() => {
            testBoundaryBoxes = boxes.merge(tmBomModel);
        });

        it('finds the boundary boxes', () => {
            expect(testBoundaryBoxes).toHaveLength(tmBomModel.trust_zones.length);
        });

        it('provides boundary box shape', () => {
            expect(testBoundaryBoxes[0].shape).toEqual('trust-boundary-box');
            expect(testBoundaryBoxes[0].data.type).toEqual('tm.BoundaryBox');
            expect(testBoundaryBoxes[0].data.isTrustBoundary).toBe(true);
            expect(testBoundaryBoxes[0].data.hasOpenThreats).toBe(false);
        });

        it('creates the id strings', () => {
            expect(testBoundaryBoxes[0].id).toBe('trust-zone0');
            expect(testBoundaryBoxes[1].id).toBe('trust-zone1');
            expect(testBoundaryBoxes[2].id).toBe('trust-zone2');
            expect(testBoundaryBoxes[3].id).toBe('trust-zone3');
        });

        it('sizes the boundary boxes', () => {
            expect(testBoundaryBoxes[0].size.width).toBeGreaterThanOrEqual(boxes.nodeGeometry.width);
            expect(testBoundaryBoxes[0].size.height).toBeGreaterThanOrEqual(boxes.nodeGeometry.height);
            expect(testBoundaryBoxes[2].size.width).toBeGreaterThan(boxes.nodeGeometry.width);
            expect(testBoundaryBoxes[2].size.height).toBeGreaterThan(boxes.nodeGeometry.height);
        });

        it('places the boundary boxes', () => {
            expect(testBoundaryBoxes[0].position.x).toBeGreaterThanOrEqual(boxes.nodeGeometry.width);
            expect(testBoundaryBoxes[0].position.y).toBeGreaterThanOrEqual(boxes.nodeGeometry.height);
            expect(testBoundaryBoxes[1].position.x).toBeGreaterThan(boxes.nodeGeometry.padding + boxes.nodeGeometry.width);
            expect(testBoundaryBoxes[1].position.y).toBeGreaterThanOrEqual(boxes.nodeGeometry.height);
            expect(testBoundaryBoxes[2].position.x).toBeGreaterThanOrEqual(boxes.nodeGeometry.width);
            expect(testBoundaryBoxes[2].position.y).toBeGreaterThan(boxes.nodeGeometry.padding + boxes.nodeGeometry.height);
        });

        it('names the boundary boxes', () => {
            expect(testBoundaryBoxes[0].data.name).toBe('Test title trust-zone0');
            expect(testBoundaryBoxes[0].attrs.label.text).toBe('Test title trust-zone0');
            expect(testBoundaryBoxes[3].data.name).toBe('Test title trust-zone3');
            expect(testBoundaryBoxes[3].attrs.label.text).toBe('Test title trust-zone3');
        });

        it('provides the description', () => {
            expect(testBoundaryBoxes[0].data.description).toContain('Test description trust-zone0');
            expect(testBoundaryBoxes[3].data.description).toContain('Test description trust-zone3');
        });

        it('sets the Z index', () => {
            expect(testBoundaryBoxes[0].zIndex).toBe(-1);
            expect(testBoundaryBoxes[3].zIndex).toBe(-4);
        });

    });

    describe('handle absence of TM-BOM trust zones', () => {
        const reducedModel = JSON.parse(JSON.stringify(tmBomModel));
        delete (reducedModel.trust_zones);
        const testBoundaryBoxes = boxes.merge(reducedModel);

        it('provides empty boundary box array', () => {
            expect(testBoundaryBoxes).toHaveLength(0);
        });

    });
});
