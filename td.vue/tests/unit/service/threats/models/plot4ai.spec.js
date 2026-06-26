import plot4ai from '@/service/threats/models/plot4ai.js';

describe('service/threats/models/plot4ai.js', () => {
    it('has a translation for unawareness', () => {
        expect(plot4ai.actor.unawareness.translation.length).toBeGreaterThan(0);
    });

    it('has a translation for safety', () => {
        expect(plot4ai.actor.safety.translation.length).toBeGreaterThan(0);
    });

    it('has a translation for security', () => {
        expect(plot4ai.flow.security.translation.length).toBeGreaterThan(0);
    });

    it('has a translation for techniqueProcesses', () => {
        expect(plot4ai.flow.techniqueProcesses.translation.length).toBeGreaterThan(0);
    });

    it('has a translation for accessibility', () => {
        expect(plot4ai.store.accessibility.translation.length).toBeGreaterThan(0);
    });

    it('has a translation for identifiability and linkability', () => {
        expect(plot4ai.store.identifiabilityLinkability.translation.length).toBeGreaterThan(0);
    });

    it('has a translation for non compliance', () => {
        expect(plot4ai.process.nonCompliance.translation.length).toBeGreaterThan(0);
    });
    it('has a translation for ethics and human rights', () => {
        expect(plot4ai.all.ethicsHumanRights.translation.length).toBeGreaterThan(0);
    });


});
