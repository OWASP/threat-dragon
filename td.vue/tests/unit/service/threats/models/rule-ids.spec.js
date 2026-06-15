import { getRuleId } from '@/service/threats/models/rule-ids.js';

describe('service/threats/models/rule-ids.js', () => {
    it('reuses the v1 STRIDE rule ID', () => {
        expect(getRuleId('STRIDE', 'spoofing'))
            .toEqual('b2a6d40d-d3f8-4750-8e4d-c02cc84b13dc');
    });

    it('reuses CIA rule IDs for equivalent CIADIE rules', () => {
        expect(getRuleId('CIADIE', 'confidentiality'))
            .toEqual(getRuleId('CIA', 'confidentiality'));
    });

    it('provides a stable ID for a new CIADIE rule', () => {
        expect(getRuleId('DIE', 'distributed'))
            .toEqual('f3fb94f4-7a4d-4271-80f4-01c450003128');
    });

    it('provides a stable ID for a PLOT4ai rule', () => {
        expect(getRuleId('PLOT4ai', 'techniqueProcesses'))
            .toEqual('7f26d4ca-597f-4523-b718-fd00f6b5eab0');
    });

    it('uses the translation key to identify rules in a generic model', () => {
        expect(getRuleId('Generic', 'spoofing', 'threats.model.stride.spoofing'))
            .toEqual('b2a6d40d-d3f8-4750-8e4d-c02cc84b13dc');
    });

    it('returns undefined for an unknown rule', () => {
        expect(getRuleId('STRIDE', 'unknown')).toBeUndefined();
    });
});
