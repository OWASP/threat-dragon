import boxes from '@/service/migration/otm/cells/boxes';
import otmModel from '../../otm-test-model';

describe('service/migration/otm/cells/boxes.js', () => {
    describe('merge OTM', () => {
        let testBox;

        describe('creating a trust boundary box', () => {
            const trustZone = {
                name: 'Test trust boundary box name',
                id: 'test-trust-boundary-box-id',
                description: 'test-trust-boundary-box-description',
                attributes: {attr1: 'value1', attr2: 'value2'},
                parent: {trustZone: 'test-trust-boundary-box-parent'},
                risk: {trustRating: 100},
                type: 'test-trust-boundary-box-type'
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
                testBox = boxes.merge(otmModel, trustZone, representation);
            });

            it('creates trust boundary box type', () => {
                expect(testBox.shape).toBe('trust-boundary-box');
            });

            it('creates trust boundary box ID', () => {
                expect(testBox.id).toBe(trustZone.id);
            });

            it('creates trust boundary box name', () => {
                expect(testBox.data.name).toBe(trustZone.name);
                expect(testBox.attrs.label.text).toBe(trustZone.name);
            });

            it('creates trust boundary box description', () => {
                expect(testBox.data.description).toBe(trustZone.description);
            });

            it('creates trust boundary box size', () => {
                expect(testBox.size).toBe(representation.size);
            });

            it('creates trust boundary box position', () => {
                expect(testBox.position).toBe(representation.position);
            });

            it('creates flow trust boundary box risk', () => {
                expect(testBox.compatibility.risk).toEqual(trustZone.risk);
            });

            it('creates trust boundary box compatibility', () => {
                expect(testBox.compatibility.attributes).toEqual(trustZone.attributes);
                expect(testBox.compatibility.parent).toEqual(trustZone.parent);
                expect(testBox.compatibility.type).toEqual(trustZone.type);
            });
        });
 
        describe('creating a minimal trust boundary box', () => {
            const trustZone = {
                name: 'Test trust boundary box name',
                id: 'test-trust-boundary-box-id',
                risk: {trustRating: 100}
            };
            const representation = {
                representation: 'test-representation',
                id: 'test-representation-id'
            };

            beforeEach(() => {
                testBox = boxes.merge(otmModel, trustZone, representation);
            });
            it('creates trust boundary box type', () => {
                expect(testBox.shape).toBe('trust-boundary-box');
            });

            it('creates trust boundary box ID', () => {
                expect(testBox.id).toBe(trustZone.id);
            });

            it('creates trust boundary box name', () => {
                expect(testBox.data.name).toBe(trustZone.name);
                expect(testBox.attrs.label.text).toBe(trustZone.name);
            });
 
            it('creates trust boundary box description', () => {
                expect(testBox.data.description).toBe('');
            });

            it('defaults trust boundary box size', () => {
                expect(testBox.size).toBeDefined();
            });

            it('defaults trust boundary box position', () => {
                expect(testBox.position).toBeDefined();
            });

            it('creates flow trust boundary box risk', () => {
                expect(testBox.compatibility.risk).toEqual(trustZone.risk);
            });

            it('creates trust boundary box compatibility', () => {
                expect(testBox.compatibility.attributes).toBeUndefined();
                expect(testBox.compatibility.parent).toBeUndefined();
                expect(testBox.compatibility.type).toBeUndefined();
            });
        });
    });
});
