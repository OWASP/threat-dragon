import defaultProperties from '@/service/entity/default-properties.js';

describe('service/entity/default-properties.js', () => {
    describe('default properties', () => {
        it('defines the actor', () => {
            expect(defaultProperties.defaultData('tm.Actor')).toMatchObject({
			    name: 'Actor',
			    description: '',
			    isTrustBoundary: false,
			    outOfScope: false,
			    reasonOutOfScope: '',
			    hasOpenThreats: false,
			    providesAuthentication: false
            });
        });

        it('defines the  trust boundary', () => {
            expect(defaultProperties.defaultData('tm.Boundary')).toMatchObject({
			    name: 'Trust Boundary',
			    description: '',
			    isTrustBoundary: true,
			    hasOpenThreats: false
            });
        });

        it('defines the trust boundary box', () => {
            expect(defaultProperties.defaultData('tm.BoundaryBox')).toMatchObject({
			    name: 'Trust Boundary',
			    description: '',
			    isTrustBoundary: true,
			    hasOpenThreats: false
            });
        });

        it('defines the flow', () => {
            expect(defaultProperties.defaultData('tm.Flow')).toMatchObject({
			    name: 'Data Flow',
			    description: '',
			    outOfScope: false,
			    isTrustBoundary: false,
			    reasonOutOfScope: '',
			    hasOpenThreats: false,
			    isBidirectional: false,
			    isEncrypted: false,
			    isPublicNetwork: false,
			    protocol: ''
            });
        });

        it('defines the process', () => {
            expect(defaultProperties.defaultData('tm.Process')).toMatchObject({
			    name: 'Process',
			    description: '',
			    outOfScope: false,
			    isTrustBoundary: false,
			    reasonOutOfScope: '',
			    hasOpenThreats: false,
			    handlesCardPayment: false,
			    handlesGoodsOrServices: false,
			    isWebApplication: false,
			    privilegeLevel: ''
            });
        });

        it('defines the data store', () => {
            expect(defaultProperties.defaultData('tm.Store')).toMatchObject({
			    name: 'Store',
			    description: '',
			    outOfScope: false,
			    isTrustBoundary: false,
			    reasonOutOfScope: '',
			    hasOpenThreats: false,
			    isALog: false,
			    isEncrypted: false,
			    isSigned: false,
			    storesCredentials: false,
			    storesInventory: false
            });
        });

        it('defines the text box', () => {
            expect(defaultProperties.defaultData('tm.Text')).toMatchObject({ name: 'Descriptive text' });
        });
    });

    describe('defaultData', () => {
        it('throws an error for an unknown type', () => {
            expect(() => defaultProperties.defaultData('fake'))
                .toThrowError('Unknown entity: fake');
        });

        it('gets actor', () => {
            expect(defaultProperties.defaultData('tm.Actor').type).toEqual('tm.Actor');
        });

        it('gets boundary', () => {
            expect(defaultProperties.defaultData('tm.Boundary').type).toEqual('tm.Boundary');
        });

        it('gets boundaryBox', () => {
            expect(defaultProperties.defaultData('tm.BoundaryBox').type).toEqual('tm.BoundaryBox');
        });

        it('gets flow', () => {
            expect(defaultProperties.defaultData('tm.Flow').type).toEqual('tm.Flow');
        });

        it('gets process', () => {
            expect(defaultProperties.defaultData('tm.Process').type).toEqual('tm.Process');
        });

        it('gets store', () => {
            expect(defaultProperties.defaultData('tm.Store').type).toEqual('tm.Store');
        });

        it('gets text', () => {
            expect(defaultProperties.defaultData('tm.Text').type).toEqual('tm.Text');
        });
    });
});
