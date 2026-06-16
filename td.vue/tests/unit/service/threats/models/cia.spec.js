import cia from '@/service/threats/models/cia.js';

describe('service/threats/models/cia.js', () => {
    it('has a translation for confidentiality', () => {
        expect(cia.confidentiality.translation.length).toBeGreaterThan(0);
    });

    it('has a translation for integrity', () => {
        expect(cia.integrity.translation.length).toBeGreaterThan(0);
    });

    it('has a translation for availability', () => {
        expect(cia.availability.translation.length).toBeGreaterThan(0);
    });
});
