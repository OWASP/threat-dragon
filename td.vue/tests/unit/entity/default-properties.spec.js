import defaultProperties from '../../../src/service/entity/default-properties.js';

describe('service/entity/default-properties.js', () => {
    describe('actor', () => {
        it('defines the type', () => {
            expect(defaultProperties.actor.type).toEqual('tm.Actor');
        });

        it('defines name', () => {
            expect(defaultProperties.actor.name).toEqual('Actor');
        });

        it('defines description', () => {
            expect(defaultProperties.actor.description).toEqual('');
        });

        it('defines outOfScope', () => {
            expect(defaultProperties.actor.outOfScope).toEqual(false);
        });

        it('defines reasonOutOfScope', () => {
            expect(defaultProperties.actor.reasonOutOfScope).toEqual('');
        });

        it('defines providesAuthentication', () => {
            expect(defaultProperties.actor.providesAuthentication).toEqual(false);
        });

        it('defines hasOpenThreats', () => {
            expect(defaultProperties.actor.hasOpenThreats).toEqual(false);
        });

        it('defines threats', () => {
            expect(defaultProperties.actor.threats).toEqual([]);
        });
    });

    describe('boundary', () => {
        it('defines the type', () => {
            expect(defaultProperties.boundary.type).toEqual('tm.Boundary');
        });

        it('has a blank description', () => {
            expect(defaultProperties.boundary.description).toEqual('');
        });

        it('is a trust boundary', () => {
            expect(defaultProperties.boundary.isTrustBoundary).toEqual(true);
        });
    });

    describe('boundaryBox', () => {
        it('defines the type', () => {
            expect(defaultProperties.boundaryBox.type).toEqual('tm.BoundaryBox');
        });

        it('has a name', () => {
            expect(defaultProperties.boundaryBox.name).toEqual('Trust Boundary');
        });

        it('has a blank description', () => {
            expect(defaultProperties.boundaryBox.description).toEqual('');
        });

        it('is a trust boundary', () => {
            expect(defaultProperties.boundaryBox.isTrustBoundary).toEqual(true);
        });
    });

    describe('flow', () => {
        it('defines the type', () => {
            expect(defaultProperties.flow.type).toEqual('tm.Flow');
        });

        it('has a name', () => {
            expect(defaultProperties.flow.name).toEqual('Data Flow');
        });

        it('has a blank description', () => {
            expect(defaultProperties.flow.description).toEqual('');
        });

        it('defines outOfScope', () => {
            expect(defaultProperties.flow.outOfScope).toEqual(false);
        });

        it('defines bidirection', () => {
            expect(defaultProperties.flow.isBidirectional).toEqual(false);
        });

        it('defines reasonOutOfScope', () => {
            expect(defaultProperties.flow.reasonOutOfScope).toEqual('');
        });

        it('defines protocol', () => {
            expect(defaultProperties.flow.protocol).toEqual('');
        });

        it('defines isEncrypted', () => {
            expect(defaultProperties.flow.isEncrypted).toEqual(false);
        });

        it('defines isPublicNetwork', () => {
            expect(defaultProperties.flow.isPublicNetwork).toEqual(false);
        });

        it('defines hasOpenThreats', () => {
            expect(defaultProperties.flow.hasOpenThreats).toEqual(false);
        });

        it('defines threats', () => {
            expect(defaultProperties.flow.threats).toEqual([]);
        });
    });

    describe('process', () => {
        it('defines the type', () => {
            expect(defaultProperties.tmProcess.type).toEqual('tm.Process');
        });

        it('defines the name', () => {
            expect(defaultProperties.tmProcess.name).toEqual('Process');
        });

        it('defines description', () => {
            expect(defaultProperties.tmProcess.description).toEqual('');
        });

        it('defines outOfScope', () => {
            expect(defaultProperties.tmProcess.outOfScope).toEqual(false);
        });

        it('defines reasonOutOfScope', () => {
            expect(defaultProperties.tmProcess.reasonOutOfScope).toEqual('');
        });

        it('defines hasOpenThreats', () => {
            expect(defaultProperties.tmProcess.hasOpenThreats).toEqual(false);
        });

        it('defines handlesCardPayment', () => {
            expect(defaultProperties.tmProcess.handlesCardPayment).toEqual(false);
        });

        it('defines handlesGoodsOrServices', () => {
            expect(defaultProperties.tmProcess.handlesGoodsOrServices).toEqual(false);
        });

        it('defines isWebApplication', () => {
            expect(defaultProperties.tmProcess.isWebApplication).toEqual(false);
        });

        it('defines privilegeLevel', () => {
            expect(defaultProperties.tmProcess.privilegeLevel).toEqual('');
        });

        it('defines threats', () => {
            expect(defaultProperties.tmProcess.threats).toEqual([]);
        });
    });

    describe('store', () => {
        it('defines the type', () => {
            expect(defaultProperties.store.type).toEqual('tm.Store');
        });

        it('defines name', () => {
            expect(defaultProperties.store.name).toEqual('Store');
        });

        it('defines outOfScope', () => {
            expect(defaultProperties.store.outOfScope).toEqual(false);
        });

        it('defines reasonOutOfScope', () => {
            expect(defaultProperties.store.reasonOutOfScope).toEqual('');
        });

        it('defines hasOpenThreats', () => {
            expect(defaultProperties.store.hasOpenThreats).toEqual(false);
        });

        it('defines isALog', () => {
            expect(defaultProperties.store.isALog).toEqual(false);
        });

        it('defines isEncrypted', () => {
            expect(defaultProperties.store.isEncrypted).toEqual(false);
        });

        it('defines isSigned', () => {
            expect(defaultProperties.store.isSigned).toEqual(false);
        });

        it('defines storesCredentials', () => {
            expect(defaultProperties.store.storesCredentials).toEqual(false);
        });

        it('defines storesInventory', () => {
            expect(defaultProperties.store.storesInventory).toEqual(false);
        });

        it('defines threats', () => {
            expect(defaultProperties.store.threats).toEqual([]);
        });
    });

    describe('text', () => {
        it('defines the type', () => {
            expect(defaultProperties.text.type).toEqual('tm.Text');
        });

        it('defines name', () => {
            expect(defaultProperties.text.name).toEqual('Descriptive text');
        });
    });

    describe('getByType', () => {
        it('throws an error for an unknown type', () => {
            expect(() => defaultProperties.getByType('fake'))
                .toThrowError('Unknown entity: fake');
        });

        it('gets actor', () => {
            expect(defaultProperties.getByType('tm.Actor')).toEqual(defaultProperties.actor);
        });

        it('gets boundary', () => {
            expect(defaultProperties.getByType('tm.Boundary')).toEqual(defaultProperties.boundary);
        });

        it('gets boundaryBox', () => {
            expect(defaultProperties.getByType('tm.BoundaryBox')).toEqual(defaultProperties.boundaryBox);
        });

        it('gets flow', () => {
            expect(defaultProperties.getByType('tm.Flow')).toEqual(defaultProperties.flow);
        });

        it('gets process', () => {
            expect(defaultProperties.getByType('tm.Process')).toEqual(defaultProperties.tmProcess);
        });

        it('gets store', () => {
            expect(defaultProperties.getByType('tm.Store')).toEqual(defaultProperties.store);
        });

        it('gets text', () => {
            expect(defaultProperties.getByType('tm.Text')).toEqual(defaultProperties.text);
        });
    });
});
