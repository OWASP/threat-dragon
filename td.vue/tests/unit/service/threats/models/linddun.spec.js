import linddun from '@/service/threats/models/linddun.js';

describe('service/threats/models/linddun.js', () => {
    it('has a translation for linkability', () => {
        expect(linddun.actor.linkability.length).toBeGreaterThan(0);
    });

    it('has a translation for identifiability', () => {
        expect(linddun.actor.identifiability.length).toBeGreaterThan(0);
    });

    it('has a translation for non repudiation', () => {
        expect(linddun.default.nonRepudiation.length).toBeGreaterThan(0);
    });

    it('has a translation for detectability', () => {
        expect(linddun.default.detectability.length).toBeGreaterThan(0);
    });

    it('has a translation for disclosure of information', () => {
        expect(linddun.all.disclosureOfInformation.length).toBeGreaterThan(0);
    });

    it('has a translation for unawareness', () => {
        expect(linddun.all.unawareness.length).toBeGreaterThan(0);
    });

    it('has a translation for non compliance', () => {
        expect(linddun.all.nonCompliance.length).toBeGreaterThan(0);
    });

});
