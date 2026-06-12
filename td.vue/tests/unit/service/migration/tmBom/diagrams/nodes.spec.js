import {convert, merge, createNodes, placeNodes, defaults} from '@/service/migration/tmBom/diagrams/nodes';
import tdModel from '../td-test-model';
import tmBomModel from '../tmbom-test-model';

describe('service/migration/tmBom/diagrams/nodes.js', () => {

    describe('convert / export TM-BOM nodes', () => {
        let tmbomNodes;

        beforeEach(() => {
            tmbomNodes = convert(tdModel);
        });

        it('converts TM-BOM threats', () => {
            expect(tmbomNodes.actors.length).toBeGreaterThan(4);
            expect(tmbomNodes.components.length).toBeGreaterThan(4);
            expect(tmbomNodes.data_stores.length).toBeGreaterThan(4);
        });

        it('populates the array of actors', () => {
            expect(tmbomNodes.actors.find((x) => x.symbolic_name === undefined)).toBeUndefined();
            expect(tmbomNodes.actors.find((x) => x.title === undefined)).toBeUndefined();
            expect(tmbomNodes.actors.find((x) => x.description === undefined)).toBeUndefined();
            expect(tmbomNodes.actors.find((x) => x.type !== defaults.actorType)).toBeUndefined();
            expect(tmbomNodes.actors.find((x) => x.permissions === undefined)).toBeUndefined();
        });

        it('populates the array of components', () => {
            expect(tmbomNodes.components.find((x) => x.symbolic_name === undefined)).toBeUndefined();
            expect(tmbomNodes.components.find((x) => x.title === undefined)).toBeUndefined();
            expect(tmbomNodes.components.find((x) => x.description === undefined)).toBeUndefined();
        });

        it('populates the array of data stores', () => {
            expect(tmbomNodes.data_stores.find((x) => x.symbolic_name === undefined)).toBeUndefined();
            expect(tmbomNodes.data_stores.find((x) => x.title === undefined)).toBeUndefined();
            expect(tmbomNodes.data_stores.find((x) => x.description === undefined)).toBeUndefined();
            expect(tmbomNodes.data_stores.find((x) => x.type !== defaults.storeType)).toBeUndefined();
        });

    });

    describe('merge / import TM-BOM nodes', () => {
        describe('create diagram nodes', () => {
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
                expect(components[6].zIndex).toEqual(0);
                expect(components[7].zIndex).toEqual(0);
                expect(components[8].zIndex).toEqual(1);
            });
        });

        describe('assign nodes to trust zones', () => {
 
            it('creates nodes in untrusted zone', () => {
                const components = createNodes(tmBomModel);
                expect(components).toHaveLength(6);
            });

            it('creates components in first zone', () => {
                const components = createNodes(tmBomModel, 'trust-zone0');
                expect(components).toHaveLength(1);
            });

            it('creates components in third zone', () => {
                const components = createNodes(tmBomModel, 'trust-zone2');
                expect(components).toHaveLength(7);
            });

            it('creates no components in last zone', () => {
                const components = createNodes(tmBomModel, 'trust-zone3');
                expect(components).toHaveLength(0);
            });
        });

        describe('place components in public zone', () => {
            let components;

            beforeEach(() => {
                components = placeNodes(createNodes(tmBomModel, undefined), { x: 50, y: 100 });
            });

            it('places all components', () => {
                expect(components).toHaveLength(6);
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
            const emptyZonesTmBom = JSON.parse(JSON.stringify(tmBomModel));
            delete (emptyZonesTmBom.trust_zones);
            const components = merge(emptyZonesTmBom);

            it('merges all nodes as public', () => {
                expect(components).toHaveLength(tmBomModel.actors.length
                + tmBomModel.components.length
                + tmBomModel.data_stores.length);
            });
        });

        describe('handles absence of actors', () => {
            const emptyActorsTmBom = JSON.parse(JSON.stringify(tmBomModel));
            delete (emptyActorsTmBom.actors);
            const components = merge(emptyActorsTmBom);

            it('merges nodes and boxes', () => {
                expect(components).toHaveLength(tmBomModel.components.length
                + tmBomModel.data_stores.length
                + tmBomModel.trust_zones.length);
            });
        });

        describe('handles absence of components', () => {
            const emptyComponentsTmBom = JSON.parse(JSON.stringify(tmBomModel));
            delete (emptyComponentsTmBom.components);
            const components = merge(emptyComponentsTmBom);

            it('merges nodes and boxes', () => {
                expect(components).toHaveLength(tmBomModel.actors.length
                + tmBomModel.data_stores.length
                + tmBomModel.trust_zones.length);
            });
        });

        describe('handles absence of data stores', () => {
            const emptyStoresTmBom = JSON.parse(JSON.stringify(tmBomModel));
            delete (emptyStoresTmBom.data_stores);
            const components = merge(emptyStoresTmBom);

            it('merges nodes and boxes', () => {
                expect(components).toHaveLength(tmBomModel.actors.length
                + tmBomModel.components.length
                + tmBomModel.trust_zones.length);
            });
        });

        describe('handles absence of diagram nodes', () => {
            const emptyNodesTmBom = JSON.parse(JSON.stringify(tmBomModel));
            delete (emptyNodesTmBom.actors);
            delete (emptyNodesTmBom.components);
            delete (emptyNodesTmBom.data_stores);

            const components = merge(emptyNodesTmBom);

            it('merges nodes and boxes', () => {
                expect(components).toHaveLength(tmBomModel.trust_zones.length);
            });
        });
    });
});
