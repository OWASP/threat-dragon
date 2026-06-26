import linddun from '@/service/threats/models/linddun.js';

describe('service/threats/models/linddun.js', () => {
    it('has a translation for linkability', () => {
        expect(linddun.actor.linkability.translation.length).toBeGreaterThan(0);
    });

    it('has a translation for identifiability', () => {
        expect(linddun.actor.identifiability.translation.length).toBeGreaterThan(0);
    });

    it('has a translation for non repudiation', () => {
        expect(linddun.default.nonRepudiation.translation.length).toBeGreaterThan(0);
    });

    it('has a translation for detectability', () => {
        expect(linddun.default.detectability.translation.length).toBeGreaterThan(0);
    });

    it('has a translation for disclosure of information', () => {
        expect(linddun.all.disclosureOfInformation.translation.length).toBeGreaterThan(0);
    });

    it('has a translation for unawareness', () => {
        expect(linddun.all.unawareness.translation.length).toBeGreaterThan(0);
    });

    it('has a translation for non compliance', () => {
        expect(linddun.all.nonCompliance.translation.length).toBeGreaterThan(0);
    });

});
