import { TrustBoundaryCurve } from '@/service/x6/shapes/trust-boundary-curve.js';

describe('service/x6/shapes/trust-boundary-curve.js', () => {
    let victim;

    beforeEach(() => {
        victim = new TrustBoundaryCurve();
    });

    it('can create the object', () => {
        expect(victim.constructor.name).toEqual('TrustBoundaryCurve');
    });

    describe('get edge victim', () => {
        it('uses the smooth connector', () => {
            expect(victim.connector).toEqual('smooth');
        });

        it('sets the stroke dash array', () => {
            expect(victim.attrs.line.strokeDasharray).toEqual('5 5');
        });

        it('does not have a source marker', () => {
            expect(victim.attrs.line.sourceMarker).toEqual(null);
        });

        it('does not have a target marker', () => {
            expect(victim.attrs.line.targetMarker).toEqual(null);
        });
    });
});
