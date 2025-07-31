import boxes from '@/service/migration/tmBom/diagrams/boxes';
import tmBomModel from '../test-model';
const padding = 50;
const nodeSize = { width: 160 + (2 * padding), height: 80 + (2 * padding) };

describe('service/migration/tmBom/diagrams/boxes.js', () => {
    const offset = {'x': 100, 'y': 80};
    const boundaryBoxShape = {
        shape: 'trust-boundary-box',
        data: {
            type: 'tm.BoundaryBox',
            isTrustBoundary: true,
            hasOpenThreats: false
        }
    };
    let testBoundaryBoxes = boxes.read(tmBomModel, offset, nodeSize, padding);

    describe('import TM-BOM zones', () => {
        it('finds the boundary boxes', () => {
            expect(testBoundaryBoxes).toHaveLength(3);
        });

        it('provides the first boundary box', () => {
            expect(testBoundaryBoxes[0]).toMatchObject(boundaryBoxShape);
            expect(testBoundaryBoxes[1]).toMatchObject(boundaryBoxShape);
            expect(testBoundaryBoxes[2]).toMatchObject(boundaryBoxShape);
        });

        it('creates the id strings', () => {
            expect(testBoundaryBoxes[0].id).toBe('prod-zone');
            expect(testBoundaryBoxes[1].id).toBe('experimental-zone');
            expect(testBoundaryBoxes[2].id).toBe('public');
        });

        it('sizes the boundary boxes', () => {
            expect(testBoundaryBoxes[0].size).toStrictEqual({ width: 520, height: 360 });
            expect(testBoundaryBoxes[1].size).toStrictEqual({ width: 520, height: 360 });
            expect(testBoundaryBoxes[2].size).toStrictEqual({ width: 260, height: 180});
        });

        it('places the boundary boxes', () => {
            expect(testBoundaryBoxes[0].position).toStrictEqual({ x: 100, y: 80 });
            expect(testBoundaryBoxes[1].position).toStrictEqual({ x: 670, y: 80 });
            expect(testBoundaryBoxes[2].position).toStrictEqual({ x: 100, y: 490 });
        });

        it('names the boundary boxes', () => {
            expect(testBoundaryBoxes[0].data.name).toBe('Production Trust Zone');
            expect(testBoundaryBoxes[0].attrs.label.text).toBe('Production Trust Zone');
            expect(testBoundaryBoxes[1].data.name).toBe('Experimental Trust Zone');
            expect(testBoundaryBoxes[1].attrs.label.text).toBe('Experimental Trust Zone');
            expect(testBoundaryBoxes[2].data.name).toBe('Public Internet');
            expect(testBoundaryBoxes[2].attrs.label.text).toBe('Public Internet');
        });

        it('provides the description', () => {
            expect(testBoundaryBoxes[0].data.description).toContain('production deployment');
            expect(testBoundaryBoxes[1].data.description).toContain('experimental deployment');
            expect(testBoundaryBoxes[2].data.description).toContain('The public internet');
        });

        it('sets the Z index', () => {
            expect(testBoundaryBoxes[0].zIndex).toBe(-1);
            expect(testBoundaryBoxes[1].zIndex).toBe(-2);
            expect(testBoundaryBoxes[2].zIndex).toBe(-3);
        });

    });
});
