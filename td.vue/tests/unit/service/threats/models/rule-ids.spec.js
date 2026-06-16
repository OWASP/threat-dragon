import models from '@/service/threats/models/index.js';

describe('service/threats model source rule IDs', () => {
    it('reuses the v1 STRIDE rule ID', () => {
        expect(models.getThreatTypesByElement('STRIDE', 'tm.Process')['threats.model.stride.spoofing'].ruleId)
            .toEqual('b2a6d40d-d3f8-4750-8e4d-c02cc84b13dc');
    });

    it('reuses CIA rule IDs for equivalent CIADIE rules', () => {
        expect(models.getThreatTypesByElement('CIADIE', 'tm.Process')['threats.model.ciadie.confidentiality'].ruleId)
            .toEqual(models.getThreatTypesByElement('CIA', 'tm.Process')['threats.model.cia.confidentiality'].ruleId);
    });

    it('provides a stable ID for a new CIADIE rule', () => {
        expect(models.getThreatTypesByElement('DIE', 'tm.Process')['threats.model.ciadie.distributed'].ruleId)
            .toEqual('f3fb94f4-7a4d-4271-80f4-01c450003128');
    });

    it('provides a stable ID for a PLOT4ai rule', () => {
        expect(models.getThreatTypesByElement('PLOT4ai', 'tm.Process')['threats.model.plot4ai.techniqueProcesses'].ruleId)
            .toEqual('7f26d4ca-597f-4523-b718-fd00f6b5eab0');
    });

    it('keeps the rule ID attached in the generic model view', () => {
        expect(models.getThreatTypesByElement('Generic', 'tm.Process')['threats.model.stride.spoofing'].ruleId)
            .toEqual('b2a6d40d-d3f8-4750-8e4d-c02cc84b13dc');
    });
});
