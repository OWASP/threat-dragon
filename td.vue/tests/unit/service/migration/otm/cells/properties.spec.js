import properties from '@/service/migration/otm/cells/properties';

describe('service/migration/otm/cells/properties.js', () => {

    describe('merge OTM', () => {
        let testCell;

        describe('creates properties for cells', () => {
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
                testCell = properties.merge(component, representation);
            });

            it('creates cell type', () => {
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
 
        describe('creates cell properties with minimal values', () => {
            const component = {
                name: 'Web Client',
                id: 'web-client',
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
                testCell = properties.merge(component, representation);
            });

            it('creates cell type', () => {
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

            it('creates cell position', () => {
                expect(testCell.position).not.toBeDefined();
            });

            it('creates compatibility ID', () => {
                expect(testCell.compatibility.otmId).toBe(representation.id);
            });

            it('creates compatibility size and position', () => {
                expect(testCell.compatibility.parent).toBe(component.parent);
                expect(testCell.compatibility.tags).not.toBeDefined();
            });
        });

        describe('finds the data store cell properties', () => {
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

            it('creates cell type', () => {
                testCell = properties.merge(component, representation);
                expect(testCell.shape).toBe('store');
            });

        });
    });
});
