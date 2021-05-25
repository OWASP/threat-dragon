import trustBoundaryBox from '@/service/x6/shapes/trust-boundary-box.js';

describe('service/x6/shapes/trust-boundary-box.js', () => {
    let victim;

    beforeEach(() => {
        victim = new trustBoundaryBox.TrustBoundaryBox();
    });

    it('can create the object', () => {
        expect(victim.constructor.name).toEqual('TrustBoundaryBox');
    });
});
