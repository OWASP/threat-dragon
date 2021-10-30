import cia from '@/service/threats/models/cia.js';

describe('service/threats/models/cia.js', () => {
    it('has a translation for confidentiality', () => {
        expect(cia.confidentiality.length).toBeGreaterThan(0);
    });

    it('has a translation for integrity', () => {
        expect(cia.integrity.length).toBeGreaterThan(0);
    });

    it('has a translation for availability', () => {
        expect(cia.availability.length).toBeGreaterThan(0);
    });
});
