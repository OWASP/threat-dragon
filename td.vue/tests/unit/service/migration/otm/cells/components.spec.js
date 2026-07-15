import components from '@/service/migration/otm/cells/components';

import otmModel from '../../otm-test-model';

describe('service/migration/otm/cells/components.js', () => {

    describe('listing OTM components', () => {
        let testCells;

        it('lists components for Application Code', () => {
            testCells = components.list(otmModel, otmModel.representations[1].id);
            expect(testCells).toHaveLength(1);
        });

        it('lists components for Architecture Diagram', () => {
            testCells = components.list(otmModel, otmModel.representations[2].id);
            expect(testCells.length).toBeGreaterThanOrEqual(3);
        });

        it('lists no components for absent representation', () => {
            testCells = components.list(otmModel, 'foo-bar');
            expect(testCells).toHaveLength(0);
        });
    });

    describe('merging OTM', () => {
        let testCell;

        describe('creating properties for cells', () => {
            const component = {
                name: 'Web Service',
                id: 'web-service',
                description: 'Runs our web application',
                parent: {
                    trustZone: '2ab4effa-40b7-4cd2-ba81-8247d29a6f2d'
                },
                type: 'web-service',
                tags: [
                    'tomcat'
                ],
                threats: [
                    {
                        threat: 'test-threat1',
                        state: 'foo',
                        mitigations: [{mitigation: 'test-mitigation1', state: 'bar'}]
                    }
                ]
            };
            const representation = {
                representation: 'test-representation',
                id: 'test-representation-id',
                position: {
                    x: 100,
                    y: 100
                },
                size: {
                    width: 50,
                    height: 50
                }
            };

            beforeEach(() => {
                testCell = components.merge(otmModel, component, representation);
            });

            it('creates process cell type', () => {
                expect(testCell.shape).toBe('process');
            });

            it('creates cell ID', () => {
                expect(testCell.id).toBe(component.id);
            });

            it('creates cell name', () => {
                expect(testCell.data.name).toBe(component.name);
                expect(testCell.attrs.text.text).toBe(component.name);
            });

            it('creates cell description', () => {
                expect(testCell.data.description).toBe(component.description);
            });

            it('creates cell threats', () => {
                expect(testCell.data.threats).toHaveLength(1);
            });

            it('creates cell size', () => {
                expect(testCell.size).toEqual(representation.size);
            });

            it('creates cell position', () => {
                expect(testCell.position).toEqual(representation.position);
            });

            it('creates compatibility ID', () => {
                expect(testCell.compatibility.otmId).toBe(representation.id);
            });

            it('creates compatibility size and position', () => {
                expect(testCell.compatibility.parent).toBe(component.parent);
                expect(testCell.compatibility.tags).toBe(component.tags);
            });
        });
 
        describe('creating cell properties with minimal values', () => {
            const component = {
                name: 'Web Client',
                id: 'web-client',
                description: 'test description',
                parent: {
                    trustZone: 'f0ba7722-39b6-4c81-8290-a30a248bb8d9'
                },
                type: 'web-client'
            };
            const representation = {
                representation: 'architecture-diagram',
                id: 'web-client-box'
            };

            beforeEach(() => {
                testCell = components.merge(otmModel, component, representation);
            });

            it('creates actor cell type', () => {
                expect(testCell.shape).toBe('actor');
            });

            it('creates cell ID', () => {
                expect(testCell.id).toBe(component.id);
            });

            it('creates cell name', () => {
                expect(testCell.data.name).toBe(component.name);
                expect(testCell.label).toBe(component.name);
            });

            it('creates cell description', () => {
                expect(testCell.data.description).toBe(component.description);
            });

            it('creates cell size', () => {
                expect(testCell.size).not.toEqual(representation.size);
            });

            it('creates default cell position', () => {
                expect(testCell.position.x).toBeGreaterThan(0);
                expect(testCell.position.y).toBeGreaterThan(0);
            });

            it('creates compatibility ID', () => {
                expect(testCell.compatibility.otmId).toBe(representation.id);
            });

            it('creates compatibility size and position', () => {
                expect(testCell.compatibility.parent).toBe(component.parent);
                expect(testCell.compatibility.tags).not.toBeDefined();
            });
        });

        describe('finding the data store cell properties', () => {
            const component = {
                name: 'Data store',
                id: 'web-database',
                parent: {
                    trustZone: '2ab4effa-40b7-4cd2-ba81-8247d29a6f2d'
                },
                type: 'data-store'
            };
            const representation = {
                representation: 'architecture-diagram',
                id: 'box-for-postgress-DB'
            };

            it('creates data store cell type', () => {
                testCell = components.merge(otmModel, component, representation);
                expect(testCell.shape).toBe('store');
            });

        });
    });
});
