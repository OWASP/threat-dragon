import boxes from '@/service/migration/tmBom/diagrams/boxes';
import tmBomModel from '../test-model';

describe('service/migration/tmBom/diagrams/boxes.js', () => {
    let testBoundaryBoxes = boxes.merge(tmBomModel);

    describe('import TM-BOM trust zones', () => {
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
            expect(testBoundaryBoxes[1].data.name).toBe('Test title trust-zone1');
            expect(testBoundaryBoxes[1].attrs.label.text).toBe('Test title trust-zone1');
            expect(testBoundaryBoxes[2].data.name).toBe('Test title trust-zone2');
            expect(testBoundaryBoxes[2].attrs.label.text).toBe('Test title trust-zone2');
        });

        it('provides the description', () => {
            expect(testBoundaryBoxes[0].data.description).toContain('Test description trust-zone0');
            expect(testBoundaryBoxes[1].data.description).toContain('Test description trust-zone1');
            expect(testBoundaryBoxes[2].data.description).toContain('Test description trust-zone2');
        });

        it('sets the Z index', () => {
            expect(testBoundaryBoxes[0].zIndex).toBe(-1);
            expect(testBoundaryBoxes[1].zIndex).toBe(-2);
            expect(testBoundaryBoxes[2].zIndex).toBe(-3);
        });

    });

    describe('handle absence of TM-BOM trust zones', () => {
        let reducedModel = JSON.parse(JSON.stringify(tmBomModel));
        delete(reducedModel.trust_zones);
        let testBoundaryBoxes = boxes.merge(reducedModel);

        it('provides empty boundary box array', () => {
            expect(testBoundaryBoxes).toHaveLength(0);
        });

    });
});
