import stride from '@/service/threats/models/stride.js';

describe('service/threats/models/stride.js', () => {
    it('has a translation for spoofing', () => {
        expect(stride.spoofing.length).toBeGreaterThan(0);
    });

    it('has a translation for tampering', () => {
        expect(stride.tampering.length).toBeGreaterThan(0);
    });

    it('has a translation for repudiation', () => {
        expect(stride.repudiation.length).toBeGreaterThan(0);
    });

    it('has a translation for information disclosure', () => {
        expect(stride.informationDisclosure.length).toBeGreaterThan(0);
    });

    it('has a translation for denial of service', () => {
        expect(stride.denialOfService.length).toBeGreaterThan(0);
    });

    it('has a translation for elevation of privilege', () => {
        expect(stride.elevationOfPrivilege.length).toBeGreaterThan(0);
    });
});
