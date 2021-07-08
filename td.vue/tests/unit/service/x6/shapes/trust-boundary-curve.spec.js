import trustBoundaryCurve from '@/service/x6/shapes/trust-boundary-curve.js';

describe('service/x6/shapes/trust-boundary-curve.js', () => {
    let victim;

    beforeEach(() => {
        victim = new trustBoundaryCurve.TrustBoundaryCurve();
    });

    it('can create the object', () => {
        expect(victim.constructor.name).toEqual('TrustBoundaryCurve');
    });

    describe('get edge config', () => {
        let config;
        const position = { x: 100, y: 500 };

        beforeEach(() => {
            config = trustBoundaryCurve.getEdgeConfig(position);
        });

        it('sets the source position', () => {
            expect(config.source).toEqual(position);
        });

        it('sets the target position', () => {
            expect(config.target).toEqual({ x: position.x + 100, y: position.y + 100 });
        });

        it('uses the smooth connector', () => {
            expect(config.connector).toEqual('smooth');
        });

        it('sets the stroke dash array', () => {
            expect(config.attrs.line.strokeDasharray).toEqual('5 5');
        });

        it('does not have a source marker', () => {
            expect(config.attrs.line.sourceMarker).toEqual(null);
        });

        it('does not have a target marker', () => {
            expect(config.attrs.line.targetMarker).toEqual(null);
        });
    });
});
