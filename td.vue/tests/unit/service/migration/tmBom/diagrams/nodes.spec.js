import nodes from '@/service/migration/tmBom/diagrams/nodes';
import tmBomModel from '../husky-ai-threat-model';

describe('service/migration/tmBom/diagrams/nodes.js', () => {

    describe('import TM-BOM nodes', () => {
        let components;

        beforeEach(() => {
            components = nodes.read(tmBomModel);
        });

        it('finds the components', () => {
            expect(components).toHaveLength(21);
        });
    });

    describe('count nodes in zones', () => {
        it('counts nodes in untrusted zone', () => {
            let components = nodes.findNodes(tmBomModel, null);
            expect(components).toHaveLength(12);
        });

        it('counts components in prod-zone zone', () => {
            let components = nodes.findNodes(tmBomModel, 'prod-zone');
            expect(components).toHaveLength(3);
        });

        it('counts components in experimental-zone zone', () => {
            let components = nodes.findNodes(tmBomModel, 'experimental-zone');
            expect(components).toHaveLength(3);
        });
    });

    describe('place components in untrusted zone', () => {
        let components;
        
        beforeEach(() => {
            const zone = {
                position: { x: 50, y: 100 },
                shape: 'edges'
            };
            components = nodes.placeNodes(nodes.findNodes(tmBomModel, null), zone);            
        });

        it('places all components', () => {
            expect(components).toHaveLength(12);
        });

        it('positions components along edge', () => {
            expect(components[0].position).toStrictEqual({ x: 100, y: 150 });
            expect(components[1].position).toStrictEqual({ x: 100, y: 330 });
            expect(components[2].position).toStrictEqual({ x: 360, y: 150 });
            expect(components[3].position).toStrictEqual({ x: 100, y: 510 });
        });
    });

    describe('place components in trust zone', () => {
        let components;
        
        beforeEach(() => {
            const zone = {
                position: { x: 350, y: 250 },
                shape: 'trust-boundary-box'
            };
            components = nodes.placeNodes(nodes.findNodes(tmBomModel, 'experimental-zone'), zone);            
        });

        it('places all components', () => {
            expect(components).toHaveLength(3);
        });

        it('positions components within zone', () => {
            expect(components[0].position).toStrictEqual({ x: 400, y: 300 });
            expect(components[1].position).toStrictEqual({ x: 400, y: 480 });
            expect(components[2].position).toStrictEqual({ x: 660, y: 300 });
        });
    });
});
