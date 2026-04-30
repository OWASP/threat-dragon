import {merge, createNodes, placeNodes} from '@/service/migration/tmBom/diagrams/nodes';
import tmBomModel from '../test-model';

describe('service/migration/tmBom/diagrams/nodes.js', () => {

    describe('merge / import TM-BOM nodes', () => {
        let components;

        beforeEach(() => {
            components = merge(tmBomModel);
        });

        it('merges all nodes and boxes', () => {
		    expect(components).toHaveLength(tmBomModel.actors.length
				+ tmBomModel.components.length
				+ tmBomModel.data_stores.length
				+ tmBomModel.trust_zones.length);
        });

        it('sets the component types', () => {
		    expect(components[0].data.type).toContain('tm.');
            expect(components[3].data.type).toContain('tm.');
            expect(components[5].data.type).toContain('tm.');
        });

        it('copies the name', () => {
		    expect(components[0].data.name).toContain('title ');
		    expect(components[4].data.name).toContain('title ');
		    expect(components[8].data.name).toContain('title ');
            expect(components[12].data.name).toContain('title ');
        });

        it('copies the description', () => {
		    expect(components[4].data.description).toContain('description ');
		    expect(components[7].data.description).toContain('description ');
        });

        it('sets the zIndex for a zone', () => {
		    expect(components[0].zIndex).toEqual(0);
		    expect(components[3].zIndex).toEqual(3);
        });

        it('resets the zIndex for a zone', () => {
            expect(components[5].zIndex).toEqual(0);
            expect(components[6].zIndex).toEqual(0);
            expect(components[7].zIndex).toEqual(1);
        });
    });

    describe('create nodes in zones', () => {
        it('creates nodes in untrusted zone', () => {
            let components = createNodes(tmBomModel, null);
            expect(components).toHaveLength(5);
        });

        it('creates components in first zone', () => {
            let components = createNodes(tmBomModel, 'trust-zone0');
            expect(components).toHaveLength(1);
        });

        it('creates components in last zone', () => {
            let components = createNodes(tmBomModel, 'trust-zone2');
            expect(components).toHaveLength(8);
        });
    });

    describe('place components in public zone', () => {
        let components;
        
        beforeEach(() => {
            components = placeNodes(createNodes(tmBomModel, undefined), { x: 50, y: 100 });            
        });

        it('places all components', () => {
            expect(components).toHaveLength(5);
        });

        it('positions components along edge', () => {
            expect(components[0].position.x).toBeGreaterThan(50);
            expect(components[0].position.y).toBeGreaterThan(100);
            expect(components[3].position.x).toBeGreaterThan(100);
		    expect(components[3].position.y).toBeGreaterThan(500);
        });
    });

    describe('place components in trust zone', () => {
        let components;
        
        beforeEach(() => {
            components = placeNodes(createNodes(tmBomModel, 'trust-zone1'), { x: 350, y: 250 });            
        });

        it('places all components', () => {
            expect(components).toHaveLength(4);
        });

        it('positions components within zone', () => {
            expect(components[0].position.x).toBeGreaterThan(350);
            expect(components[0].position.y).toBeGreaterThan(250);
            expect(components[2].position.x).toBeGreaterThan(500);
        });
    });

    describe('handles absence of trust zones', () => {
	    let emptyZonesTmBom = JSON.parse(JSON.stringify(tmBomModel));
	    delete(emptyZonesTmBom.trust_zones);
	    let components = merge(emptyZonesTmBom);
		
	    it('merges only public nodes', () => {
		    expect(components).toHaveLength(5);
	    });
    });

    describe('handles absence of actors', () => {
        let emptyActorsTmBom = JSON.parse(JSON.stringify(tmBomModel));
        delete(emptyActorsTmBom.actors);
        let components = merge(emptyActorsTmBom);
		
        it('merges nodes and boxes', () => {
		    expect(components).toHaveLength(tmBomModel.components.length
				+ tmBomModel.data_stores.length
				+ tmBomModel.trust_zones.length);
        });
    });

    describe('handles absence of components', () => {
	    let emptyComponentsTmBom = JSON.parse(JSON.stringify(tmBomModel));
	    delete(emptyComponentsTmBom.components);
	    let components = merge(emptyComponentsTmBom);
		
	    it('merges nodes and boxes', () => {
		    expect(components).toHaveLength(tmBomModel.actors.length
				+ tmBomModel.data_stores.length
				+ tmBomModel.trust_zones.length);
	    });
    });

    describe('handles absence of data stores', () => {
	    let emptyStoresTmBom = JSON.parse(JSON.stringify(tmBomModel));
	    delete(emptyStoresTmBom.data_stores);
	    let components = merge(emptyStoresTmBom);
		
	    it('merges nodes and boxes', () => {
		    expect(components).toHaveLength(tmBomModel.actors.length
				+ tmBomModel.components.length
				+ tmBomModel.trust_zones.length);
	    });
    });
	
    describe('handles absence of diagram nodes', () => {
        let emptyNodesTmBom = JSON.parse(JSON.stringify(tmBomModel));
        delete(emptyNodesTmBom.actors);
        delete(emptyNodesTmBom.components);
        delete(emptyNodesTmBom.data_stores);

	    let components = merge(emptyNodesTmBom);
	
        it('merges nodes and boxes', () => {
	    expect(components).toHaveLength(tmBomModel.trust_zones.length);
        });
    });
});
