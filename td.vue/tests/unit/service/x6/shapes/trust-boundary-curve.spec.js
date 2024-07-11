import { TrustBoundaryCurve } from '@/service/x6/shapes/trust-boundary-curve.js';

describe('service/x6/shapes/trust-boundary-curve.js', () => {
    let victim;

    beforeEach(() => {
        victim = new TrustBoundaryCurve();
        victim.setLabels = jest.fn();
    });

    it('can create the object', () => {
        expect(victim.constructor.name).toEqual('TrustBoundaryCurve');
    });

    describe('get edge victim attributes', () => {
        it('uses the smooth connector', () => {
            expect(victim.connector).toEqual('smooth');
        });

        it('sets the stroke dash array', () => {
            expect(victim.attrs.line.strokeDasharray).toEqual('10 5');
        });

        it('sets the stroke width', () => {
            expect(victim.attrs.line.strokeWidth).toEqual(3);
        });

        it('does not have a source marker', () => {
            expect(victim.attrs.line.sourceMarker).toEqual(null);
        });

        it('does not have a target marker', () => {
            expect(victim.attrs.line.targetMarker).toEqual(null);
        });
    });

    describe('setName', () => {
        it('sets the name', () => {
            const name = 'tbcName';
            victim.setName(name);
            expect(victim.setLabels).toHaveBeenCalledWith([ name ]);
        });
    });

    describe('updateStyle', () => {
        it('is a function', () => {
            expect(typeof victim.updateStyle).toEqual('function');
        });

        it('does not throw an error', () => {
            expect(() => victim.updateStyle()).not.toThrow();
        });
    });
});
