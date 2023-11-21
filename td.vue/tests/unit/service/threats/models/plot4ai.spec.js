import plot4ai from '@/service/threats/models/plot4ai.js';

describe('service/threats/models/plot4ai.js', () => {
    it('has a translation for unawareness', () => {
        expect(plot4ai.actor.unawareness.length).toBeGreaterThan(0);
    });

    it('has a translation for safety', () => {
        expect(plot4ai.actor.safety.length).toBeGreaterThan(0);
    });

    it('has a translation for security', () => {
        expect(plot4ai.flow.security.length).toBeGreaterThan(0);
    });

    it('has a translation for techniqueProcesses', () => {
        expect(plot4ai.flow.techniqueProcesses.length).toBeGreaterThan(0);
    });

    it('has a translation for accessibility', () => {
        expect(plot4ai.store.accessibility.length).toBeGreaterThan(0);
    });

    it('has a translation for identifiability and linkability', () => {
        expect(plot4ai.store.identifiabilityLinkability.length).toBeGreaterThan(0);
    });

    it('has a translation for non compliance', () => {
        expect(plot4ai.process.nonCompliance.length).toBeGreaterThan(0);
    });
    it('has a translation for ethics and human rights', () => {
        expect(plot4ai.all.ethicsHumanRights.length).toBeGreaterThan(0);
    });


});
