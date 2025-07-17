import ciaDie from '@/service/threats/models/ciadie.js';

describe('service/threats/models/ciadie.js', () => {
    it('has a translation for distributed', () => {
        expect(ciaDie.distributed.length).toBeGreaterThan(0);
    });

    it('has a translation for immutable', () => {
        expect(ciaDie.immutable.length).toBeGreaterThan(0);
    });

    it('has a translation for ephemeral', () => {
        expect(ciaDie.ephemeral.length).toBeGreaterThan(0);
    });
});
