import nodes from '@/service/migration/tmBom/diagrams/nodes';
import tmBomModel from '../test-model';

describe('service/migration/tmBom/diagrams/nodes.js', () => {

    describe('import TM-BOM nodes', () => {
        let components;

        beforeEach(() => {
            components = nodes.read(tmBomModel);
        });

        it('sets the type', () => {
		    expect(components[0].data.type).toEqual('tm.Actor');
            expect(components[11].data.type).toEqual('tm.Store');
            expect(components[12].data.type).toEqual('tm.Process');
		    expect(components[15].data.type).toEqual('tm.Process');
        });

        it('sets the name', () => {
		    expect(components[0].data.name).toBe('Data Engineer');
		    expect(components[10].data.name).toBe('Bastion Logs Storage');
		    expect(components[17].data.name).toBe('Deployment Service');
        });

        it('copies the description', () => {
		    expect(components[0].data.description).toContain('An engineer responsible for building');
		    expect(components[10].data.description).toContain('Contains logs related to SSH access');
		    expect(components[17].data.description).toContain('Handles the deployment');
        });

        it('sets the zIndex for a zone', () => {
		    expect(components[0].zIndex).toEqual(0);
		    expect(components[5].zIndex).toEqual(5);
		    expect(components[11].zIndex).toEqual(11);
        });

        it('resets the zIndex for a zone', () => {
		    expect(components[12].zIndex).toEqual(0);
		    expect(components[14].zIndex).toEqual(2);
		    expect(components[15].zIndex).toEqual(0);
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
            expect(components[0].position).toStrictEqual({ x: 112.5, y: 162.5 });
            expect(components[1].position).toStrictEqual({ x: 112.5, y: 367.5 });
            expect(components[2].position).toStrictEqual({ x: 397.5, y: 162.5 });
            expect(components[3].position).toStrictEqual({ x: 112.5, y: 572.5 });
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
            expect(components[0].position).toStrictEqual({ x: 412.5, y: 312.5 });
            expect(components[1].position).toStrictEqual({ x: 412.5, y: 517.5 });
            expect(components[2].position).toStrictEqual({ x: 697.5, y: 312.5 });
        });
    });
});
