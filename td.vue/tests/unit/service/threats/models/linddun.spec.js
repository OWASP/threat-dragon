import linddun from '@/service/threats/models/linddun.js';

describe('service/threats/models/linddun.js', () => {
    it('has a translation for linkability', () => {
        expect(linddun.linkability.length).toBeGreaterThan(0);
    });

    it('has a translation for identifiability', () => {
        expect(linddun.identifiability.length).toBeGreaterThan(0);
    });

    it('has a translation for non repudiation', () => {
        expect(linddun.nonRepudiation.length).toBeGreaterThan(0);
    });

    it('has a translation for detectability', () => {
        expect(linddun.detectability.length).toBeGreaterThan(0);
    });

    it('has a translation for disclosure of information', () => {
        expect(linddun.disclosureOfInformation.length).toBeGreaterThan(0);
    });

    it('has a translation for unawareness', () => {
        expect(linddun.unawareness.length).toBeGreaterThan(0);
    });

    it('has a translation for non compliance', () => {
        expect(linddun.nonCompliance.length).toBeGreaterThan(0);
    });

});
