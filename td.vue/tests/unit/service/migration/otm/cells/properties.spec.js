import properties from '@/service/migration/otm/cells/properties';

import otmModel from '../../otm-test-model';

describe('service/migration/otm/cells/properties.js', () => {

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

    describe('creating base properties', () => {
        let testNode;

        describe('creating an Actor node by default', () => {

            it('creates an Actor node by default', () => {
                testNode = properties.baseProperties(null, null);
                expect(testNode.data).toBeDefined();
                expect(testNode.shape).toBe('actor');
            });

            it('creates an Actor node given a type', () => {
                testNode = properties.baseProperties({type: 'Foo'}, null);
                expect(testNode.data).toBeDefined();
                expect(testNode.shape).toBe('actor');
            });

            it('creates an Actor node given an id', () => {
                testNode = properties.baseProperties({type: 'Foo', id: 'Bar'}, null);
                expect(testNode.shape).toBe('actor');
            });

            it('creates an Actor node given a representation id', () => {
                testNode = properties.baseProperties({type: 'Foo', id: 'Bar'}, {id: 'Baz'},);
                expect(testNode.shape).toBe('actor');
            });
        });

        describe('creating a Process node', () => {

            it('creates a Process node given a type', () => {
                testNode = properties.baseProperties({type: 'SerVice'}, null);
                expect(testNode.data).toBeDefined();
                expect(testNode.shape).toBe('process');
            });

            it('creates a Process node given an id', () => {
                testNode = properties.baseProperties({type: 'Foo', id: 'SERVICE'}, null);
                expect(testNode.shape).toBe('process');
            });

            it('creates a Process node given a representation id', () => {
                testNode = properties.baseProperties({type: 'Foo', id: 'Bar'}, {id: 'service'},);
                expect(testNode.shape).toBe('process');
            });
        });

        describe('creating a Store node', () => {
    
            it('creates a Store node given a type', () => {
                testNode = properties.baseProperties({type: 'DataBase'}, null);
                expect(testNode.data).toBeDefined();
                expect(testNode.shape).toBe('store');
            });
    
            it('creates a Store node given an id', () => {
                testNode = properties.baseProperties({type: 'Foo', id: 'DATABASE'}, null);
                expect(testNode.shape).toBe('store');
            });
    
            it('creates a Store node given a representation id', () => {
                testNode = properties.baseProperties({type: 'Foo', id: 'Bar'}, {id: 'database'},);
                expect(testNode.shape).toBe('store');
            });
        });

    });
});
