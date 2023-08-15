import die from '@/service/threats/models/die.js';

describe('service/threats/models/die.js', () => {
    it('has a translation for distributed', () => {
        expect(die.distributed.length).toBeGreaterThan(0);
    });

    it('has a translation for immutable', () => {
        expect(die.immutable.length).toBeGreaterThan(0);
    });

    it('has a translation for ephemeral', () => {
        expect(die.ephemeral.length).toBeGreaterThan(0);
    });
});
