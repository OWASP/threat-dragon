import properties from '@/service/migration/otm/cells/properties';

import otmModel from '../../otm-test-model';

describe('service/migration/otm/cells/properties.js', () => {

    describe('creating description', () => {
        let description;
        const testDescription = 'test description';

        beforeEach(() => {
            console.warn = jest.fn();
        });

        it('creates default description', () => {
            description = properties.combineDescription({}, {});
            expect(description).toBe('');
            expect(console.warn).not.toHaveBeenCalled();
        });

        it('copies description', () => {
            description = properties.combineDescription({}, {description: testDescription});
            expect(description).toBe(testDescription);
            expect(console.warn).not.toHaveBeenCalled();
        });

        describe('creating descriptions for components', () => {

            describe('creating descriptions for processed assets', () => {
                it('creates description', () => {
                    description = properties.combineDescription(otmModel, {description: testDescription, assets: {processed: ['public-info']}});
                    expect(description).toMatch(testDescription);
                    expect(description).toMatch('processed');
                    expect(console.warn).not.toHaveBeenCalled();
                });
    
                it('creates description of risk', () => {
                    description = properties.combineDescription(otmModel, {description: testDescription, assets: {processed: ['public-info']}});
                    expect(description).toMatch('Asset');
                    expect(description).toMatch('Confidentiality');
                    expect(description).toMatch('Integrity');
                    expect(description).toMatch('Availability');
                    expect(description).toMatch('evaluation');
                    expect(console.warn).not.toHaveBeenCalled();
                });
    
                it('creates minimal description', () => {
                    description = properties.combineDescription(otmModel, {assets: {processed: ['minimal-asset']}});
                    expect(description).toMatch('processed');
                    expect(description).toMatch('Asset');
                    expect(description).toMatch('Confidentiality');
                    expect(description).toMatch('Integrity');
                    expect(description).toMatch('Availability');
                    expect(description).not.toMatch('evaluation');
                    expect(console.warn).not.toHaveBeenCalled();
                });
    
                it('warns if asset not found', () => {
                    description = properties.combineDescription(otmModel, {assets: {processed: ['foo']}});
                    expect(description).toMatch('processed');
                    expect(console.warn).toHaveBeenCalled();
                });
            });

            describe('creating descriptions for stored assets', () => {
                it('creates description', () => {
                    description = properties.combineDescription(otmModel, {description: testDescription, assets: {stored: ['public-info']}});
                    expect(description).toMatch(testDescription);
                    expect(description).toMatch('stored');
                    expect(console.warn).not.toHaveBeenCalled();
                });

                it('creates description of risk', () => {
                    description = properties.combineDescription(otmModel, {description: testDescription, assets: {stored: ['cc-data']}});
                    expect(description).toMatch('Asset');
                    expect(description).toMatch('Confidentiality');
                    expect(description).toMatch('Integrity');
                    expect(description).toMatch('Availability');
                    expect(description).toMatch('evaluation');
                    expect(console.warn).not.toHaveBeenCalled();
                });

                it('creates minimal description', () => {
                    description = properties.combineDescription(otmModel, {assets: {stored: ['minimal-asset']}});
                    expect(description).toMatch('stored');
                    expect(description).toMatch('Asset');
                    expect(description).toMatch('Confidentiality');
                    expect(description).toMatch('Integrity');
                    expect(description).toMatch('Availability');
                    expect(description).not.toMatch('evaluation');
                    expect(console.warn).not.toHaveBeenCalled();
                });

                it('warns if asset not found', () => {
                    description = properties.combineDescription(otmModel, {assets: {stored: ['foo']}});
                    expect(description).toMatch('stored');
                    expect(console.warn).toHaveBeenCalled();
                });
            });
        });

        it('creates description for multiple assets', () => {
            description = properties.combineDescription(otmModel, {description: testDescription, assets: {processed: ['public-info'], stored: ['cc-data', 'minimal-asset']}});
            expect(description).toMatch(testDescription);
            expect(description).toMatch('processed');
            expect(description).toMatch('stored');
            expect(console.warn).not.toHaveBeenCalled();
        });

        describe('creating descriptions for dataflows', () => {
            it('creates description', () => {
                description = properties.combineDescription(otmModel, {description: testDescription, assets: ['cc-data']});
                expect(description).toMatch(testDescription);
                expect(description).toMatch('transit');
                expect(console.warn).not.toHaveBeenCalled();
            });
    
            it('creates description for multiple assets', () => {
                description = properties.combineDescription(otmModel, {description: testDescription, assets: ['public-info', 'cc-data', 'minimal-asset']});
                expect(description).toMatch(testDescription);
                expect(description).toMatch('transit');
                expect(console.warn).not.toHaveBeenCalled();
            });

            it('creates description of risk', () => {
                description = properties.combineDescription(otmModel, {description: testDescription, assets: ['cc-data']});
                expect(description).toMatch('Asset');
                expect(description).toMatch('Confidentiality');
                expect(description).toMatch('Integrity');
                expect(description).toMatch('Availability');
                expect(description).toMatch('evaluation');
                expect(console.warn).not.toHaveBeenCalled();
            });
    
            it('creates minimal description', () => {
                description = properties.combineDescription(otmModel, {assets: ['minimal-asset']});
                expect(description).toMatch('transit');
                expect(description).toMatch('Asset');
                expect(description).toMatch('Confidentiality');
                expect(description).toMatch('Integrity');
                expect(description).toMatch('Availability');
                expect(description).not.toMatch('evaluation');
                expect(console.warn).not.toHaveBeenCalled();
            });
    
            it('warns if asset not found', () => {
                description = properties.combineDescription(otmModel, {assets: ['foo']});
                expect(description).toMatch('transit');
                expect(console.warn).toHaveBeenCalled();
            });
        });
    });

    describe('creating position', () => {
        const testRepId = 'architecture-diagram';
        const testPosition = {x: 100, y: 200};
        let position;

        beforeEach(() => {
            console.warn = jest.fn();
        });

        it('creates default position', () => {
            position = properties.findPosition(otmModel, null, null, null);
            expect(position.x).toBeGreaterThan(0);
            expect(position.y).toBeGreaterThan(0);
            expect(console.warn).not.toHaveBeenCalled();
        });

        it('returns the position from top of hierarchy', () => {
            const topPosition = {x: 'foo', y: 'bar'};
            position = properties.findPosition(otmModel, null, null, topPosition);
            expect(position).toEqual(topPosition);
            expect(console.warn).not.toHaveBeenCalled();
        });

        it('warns when parent is not found', () => {
            position = properties.findPosition(otmModel, testRepId, {foo: 'bar'}, testPosition);
            expect(position).toEqual(testPosition);
            expect(console.warn).toHaveBeenCalled();
        });

        it('warns when representation ID is not found for a trust zone parent', () => {
            const testParent = {trustZone: 'internet-trust-zone-id'};
            position = properties.findPosition(otmModel, 'fooBar', testParent, testPosition);
            expect(position).toEqual(testPosition);
            expect(console.warn).toHaveBeenCalled();
        });

        it('returns the position for a trust zone parent', () => {
            const testParent = {trustZone: 'internet-trust-zone-id'};
            position = properties.findPosition(otmModel, testRepId, testParent, testPosition);
            expect(position.x).toBeDefined();
            expect(position.y).toBeDefined();
            expect(console.warn).not.toHaveBeenCalled();
        });

        it('returns the position for a component parent', () => {
            const testParent = {component: 'web-botnet-id'};
            position = properties.findPosition(otmModel, testRepId, testParent, testPosition);
            expect(position.x).toBeDefined();
            expect(position.y).toBeDefined();
            expect(console.warn).not.toHaveBeenCalled();
        });

        it('warns when representation ID is not found for a component parent', () => {
            const testParent = {component: 'web-botnet-id'};
            position = properties.findPosition(otmModel, 'fooBar', testParent, testPosition);
            expect(position).toEqual(testPosition);
            expect(console.warn).toHaveBeenCalled();
        });
    });

    describe('creating cell properties', () => {
        let testCell;

        describe('creating an Actor cell by default', () => {

            it('creates an Actor cell by default', () => {
                testCell = properties.cellProperties({name: 'foo'}, null);
                expect(testCell.data).toBeDefined();
                expect(testCell.shape).toBe('actor');
            });

            it('creates an Actor cell name', () => {
                testCell = properties.cellProperties({name: 'test-name'}, null);
                expect(testCell.data.name).toBe('test-name');
                expect(testCell.label).toBe('test-name');
            });

            it('creates an Actor cell given a type', () => {
                testCell = properties.cellProperties({type: 'Foo'}, null);
                expect(testCell.data).toBeDefined();
                expect(testCell.shape).toBe('actor');
            });

            it('creates an Actor cell given an id', () => {
                testCell = properties.cellProperties({type: 'Foo', id: 'Bar'}, null);
                expect(testCell.shape).toBe('actor');
            });

            it('creates an Actor cell given a representation id', () => {
                testCell = properties.cellProperties({type: 'Foo', id: 'Bar'}, {id: 'Baz'},);
                expect(testCell.shape).toBe('actor');
            });
        });

        describe('creating a Process node', () => {

            it('creates a Process cell given a type', () => {
                testCell = properties.cellProperties({type: 'SerVice'}, null);
                expect(testCell.data).toBeDefined();
                expect(testCell.shape).toBe('process');
            });

            it('creates a Process cell name', () => {
                testCell = properties.cellProperties({name: 'test-name', type: 'SerVice'}, null);
                expect(testCell.data.name).toBe('test-name');
                expect(testCell.attrs.text.text).toBe('test-name');
            });

            it('creates a Process cell given an id', () => {
                testCell = properties.cellProperties({type: 'Foo', id: 'SERVICE'}, null);
                expect(testCell.shape).toBe('process');
            });

            it('creates a Process cell given a representation id', () => {
                testCell = properties.cellProperties({type: 'Foo', id: 'Bar'}, {id: 'service'},);
                expect(testCell.shape).toBe('process');
            });
        });

        describe('creating a Store node', () => {
    
            it('creates a Store cell given a type', () => {
                testCell = properties.cellProperties({type: 'DataBase'}, null);
                expect(testCell.data).toBeDefined();
                expect(testCell.shape).toBe('store');
            });
    
            it('creates a Store cell name', () => {
                testCell = properties.cellProperties({name: 'test-name', type: 'DataBase'}, null);
                expect(testCell.data.name).toBe('test-name');
                expect(testCell.attrs.text.text).toBe('test-name');
            });

            it('creates a Store cell given an id', () => {
                testCell = properties.cellProperties({type: 'Foo', id: 'DATABASE'}, null);
                expect(testCell.shape).toBe('store');
            });
    
            it('creates a Store cell given a representation id', () => {
                testCell = properties.cellProperties({type: 'Foo', id: 'Bar'}, {id: 'database'},);
                expect(testCell.shape).toBe('store');
            });
        });

        describe('creating a trust Boundary Box', () => {

            it('creates a trust zone', () => {
                testCell = properties.zoneProperties({name: 'foo'});
                expect(testCell.data).toBeDefined();
                expect(testCell.shape).toBe('trust-boundary-box');
            });

            it('creates the trust zone name', () => {
                testCell = properties.zoneProperties({name: 'test-name'});
                expect(testCell.data.name).toBe('test-name');
                expect(testCell.attrs.label.text).toBe('test-name');
            });
        });

        describe('creating a data flow', () => {

            it('creates a data flow', () => {
                testCell = properties.flowProperties({name: 'foo'});
                expect(testCell.data).toBeDefined();
                expect(testCell.shape).toBe('flow');
            });

            it('creates the data flow name', () => {
                testCell = properties.flowProperties({name: 'test-name'});
                expect(testCell.data.name).toBe('test-name');
                expect(testCell.labels[0].attrs.labelText.text).toBe('test-name');
            });
        });
    });
    
    describe('combines description', () => {
        let description;

        it('returns the description by default', () => {
            description = properties.combineDescription(null, {description: 'test-description'});
            expect(description).toBe('test-description');
        });
    });

    describe('determining size', () => {
        let size;

        it('creates default size', () => {
            size = properties.findSize(null);
            expect(size.width).toBeGreaterThan(0);
            expect(size.height).toBeGreaterThan(0);
        });

        it('creates default when no size given', () => {
            size = properties.findSize({foo: 'bar'});
            expect(size.width).toBeGreaterThan(0);
            expect(size.height).toBeGreaterThan(0);
        });

        it('returns valid size', () => {
            const representation = {size: {width: 'test-width', height: 'test-height'}};
            size = properties.findSize(representation);
            expect(size.width).toBe(representation.size.width);
            expect(size.height).toBe(representation.size.height);
        });
    });
});
