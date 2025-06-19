import boxes from '@/service/migration/tmBom/diagrams/boxes';
import tmBomModel from '../husky-ai-threat-model';

describe('service/migration/tmBom/diagrams/boxes.js', () => {
    const offset = {'x': 100, 'y': 80};
    let testBoundaryBoxes = boxes.read(tmBomModel, offset);

    describe('import TM-BOM zones', () => {
        it('finds the boundary boxes', () => {
            expect(testBoundaryBoxes).toHaveLength(3);
        });

        it('provides the first boundary box', () => {
            expect(testBoundaryBoxes[0]).toStrictEqual({
                position: { x: 100, y: 80 },
                size: { width: 480, height: 320 },
                attrs: { label: { 'text': 'Production Trust Zone' } },
                visible: true,
                shape: 'trust-boundary-box',
                id: 'prod-zone',
                zIndex: -1,
                data: {
                    type: 'tm.BoundaryBox',
                    name: 'Production Trust Zone',
                    description: 'Internal VPC with the production deployment of HuskyAI',
                    isTrustBoundary: true,
                    hasOpenThreats: false
                }
            });

        });

        it('creates the id strings', () => {
            expect(testBoundaryBoxes[0].id).toBe('prod-zone');
            expect(testBoundaryBoxes[1].id).toBe('experimental-zone');
            expect(testBoundaryBoxes[2].id).toBe('public');
        });

        it('sizes the boundary boxes', () => {
            expect(testBoundaryBoxes[0].size).toStrictEqual({ width: 480, height: 320 });
            expect(testBoundaryBoxes[1].size).toStrictEqual({ width: 480, height: 320 });
            expect(testBoundaryBoxes[2].size).toStrictEqual({ width: 240, height: 160});
        });

        it('places the boundary boxes', () => {
		    expect(testBoundaryBoxes[0].position).toStrictEqual({ x: 100, y: 80 });
		    expect(testBoundaryBoxes[1].position).toStrictEqual({ x: 620, y: 80 });
		    expect(testBoundaryBoxes[2].position).toStrictEqual({ x: 100, y: 440 });
        });

        it('names the boundary boxes', () => {
		    expect(testBoundaryBoxes[0].data.name).toBe('Production Trust Zone');
		    expect(testBoundaryBoxes[1].data.name).toBe('Experimental Trust Zone');
		    expect(testBoundaryBoxes[2].data.name).toBe('Public Internet');
        });

    });
});
