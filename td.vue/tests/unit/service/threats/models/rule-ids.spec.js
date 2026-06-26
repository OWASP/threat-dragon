import models from '@/service/threats/models/index.js';
import cia from '@/service/threats/models/cia.js';
import ciaDie from '@/service/threats/models/ciadie.js';
import linddun from '@/service/threats/models/linddun.js';
import plot4ai from '@/service/threats/models/plot4ai.js';
import stride from '@/service/threats/models/stride.js';

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const sourceModels = {
    cia,
    ciaDie,
    'linddun.actor': linddun.actor,
    'linddun.default': linddun.default,
    'linddun.all': linddun.all,
    'plot4ai.actor': plot4ai.actor,
    'plot4ai.flow': plot4ai.flow,
    'plot4ai.process': plot4ai.process,
    'plot4ai.store': plot4ai.store,
    'plot4ai.all': plot4ai.all,
    'stride.actor': stride.actor,
    'stride.flow': stride.flow,
    'stride.process': stride.process,
    'stride.store': stride.store,
    'stride.all': stride.all
};

const selectedThreatTypes = [
    ['CIA', 'tm.Actor', cia],
    ['CIADIE', 'tm.Process', ciaDie],
    ['DIE', 'tm.Store', ciaDie],
    ['LINDDUN', 'tm.Actor', linddun.actor],
    ['LINDDUN', 'tm.Process', linddun.default],
    ['LINDDUN', 'tm.Store', linddun.default],
    ['LINDDUN', 'tm.Flow', linddun.default],
    ['PLOT4ai', 'tm.Actor', plot4ai.actor],
    ['PLOT4ai', 'tm.Process', plot4ai.process],
    ['PLOT4ai', 'tm.Store', plot4ai.store],
    ['PLOT4ai', 'tm.Flow', plot4ai.flow],
    ['STRIDE', 'tm.Actor', stride.actor],
    ['STRIDE', 'tm.Process', stride.process],
    ['STRIDE', 'tm.Store', stride.store],
    ['STRIDE', 'tm.Flow', stride.flow]
];

describe('service/threats model source rule IDs', () => {
    Object.entries(sourceModels).forEach(([modelName, source]) => {
        it(`defines translation metadata and rule IDs for ${modelName}`, () => {
            Object.entries(source).forEach(([key, threat]) => {
                expect(threat.translation)
                    .toEqual(expect.stringMatching(/^threats\.model\./));
                expect(threat.ruleId)
                    .toEqual(expect.stringMatching(uuidPattern));
                expect(key).toEqual(expect.any(String));
            });
        });
    });

    selectedThreatTypes.forEach(([modelType, cellType, source]) => {
        it(`preserves source metadata for ${modelType} ${cellType}`, () => {
            const threatTypes = models.getThreatTypesByElement(modelType, cellType);

            Object.entries(source).forEach(([key, threat]) => {
                expect(threatTypes[threat.translation]).toEqual({
                    ...threat,
                    key
                });
            });
        });
    });

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

    it('keeps generic headers as non-rule metadata', () => {
        expect(models.getThreatTypesByElement('Generic', 'tm.Process')['threats.model.stride.header'])
            .toEqual({ key: 'strideHeader' });
    });
});
