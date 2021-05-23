import trustBoundary from '@/service/x6/shapes/trust-boundary.js';

describe('service/x6/shapes/trust-boundary.js', () => {
    let victim;

    beforeEach(() => {
        victim = new trustBoundary.TrustBoundary();
    });

    it('can create the object', () => {
        expect(victim.constructor.name).toEqual('TrustBoundary');
    });
});
