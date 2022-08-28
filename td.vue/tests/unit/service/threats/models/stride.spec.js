import stride from '@/service/threats/models/stride.js';

describe('service/threats/models/stride.js', () => {
    it('has a translation for spoofing', () => {
        expect(stride.actor.spoofing.length).toBeGreaterThan(0);
    });

    it('has a translation for tampering', () => {
        expect(stride.store.tampering.length).toBeGreaterThan(0);
    });

    it('has a translation for repudiation', () => {
        expect(stride.process.repudiation.length).toBeGreaterThan(0);
    });

    it('has a translation for information disclosure', () => {
        expect(stride.flow.informationDisclosure.length).toBeGreaterThan(0);
    });

    it('has a translation for denial of service', () => {
        expect(stride.all.denialOfService.length).toBeGreaterThan(0);
    });

    it('has a translation for elevation of privilege', () => {
        expect(stride.all.elevationOfPrivilege.length).toBeGreaterThan(0);
    });
});
