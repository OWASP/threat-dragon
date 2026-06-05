import {
    THREAT_STATUS,
    STATUS_ORDER,
    RESOLVED_STATUSES,
    isOpen,
    isResolved,
    getStatusOptions
} from '@/service/threats/status.js';

describe('service/threats/status.js', () => {
    describe('THREAT_STATUS constants', () => {
        it('exposes the legacy statuses with their stored values', () => {
            expect(THREAT_STATUS.NOT_APPLICABLE).toEqual('NotApplicable');
            expect(THREAT_STATUS.OPEN).toEqual('Open');
            expect(THREAT_STATUS.MITIGATED).toEqual('Mitigated');
        });

        it('exposes the new risk-treatment statuses', () => {
            expect(THREAT_STATUS.ACCEPTED).toEqual('Accepted');
            expect(THREAT_STATUS.TRANSFERRED).toEqual('Transferred');
            expect(THREAT_STATUS.AVOIDED).toEqual('Avoided');
        });
    });

    describe('STATUS_ORDER', () => {
        it('lists all six statuses', () => {
            expect(STATUS_ORDER).toHaveLength(6);
        });

        it('keeps Open as the second option', () => {
            expect(STATUS_ORDER[1]).toEqual('Open');
        });
    });

    describe('RESOLVED_STATUSES', () => {
        it('contains Mitigated, Accepted, Transferred and Avoided', () => {
            expect(RESOLVED_STATUSES).toEqual(['Mitigated', 'Accepted', 'Transferred', 'Avoided']);
        });

        it('does not contain Open', () => {
            expect(RESOLVED_STATUSES).not.toContain('Open');
        });

        it('does not contain NotApplicable', () => {
            expect(RESOLVED_STATUSES).not.toContain('NotApplicable');
        });
    });

    describe('isOpen', () => {
        it('is true for Open', () => {
            expect(isOpen('Open')).toEqual(true);
        });

        it('is case insensitive', () => {
            expect(isOpen('open')).toEqual(true);
        });

        it('is false for Mitigated', () => {
            expect(isOpen('Mitigated')).toEqual(false);
        });

        it('is false for undefined', () => {
            expect(isOpen(undefined)).toEqual(false);
        });
    });

    describe('isResolved', () => {
        it('is true for Mitigated', () => {
            expect(isResolved('Mitigated')).toEqual(true);
        });

        it('is true for Accepted', () => {
            expect(isResolved('Accepted')).toEqual(true);
        });

        it('is true for Transferred', () => {
            expect(isResolved('Transferred')).toEqual(true);
        });

        it('is true for Avoided', () => {
            expect(isResolved('Avoided')).toEqual(true);
        });

        it('is case insensitive', () => {
            expect(isResolved('avoided')).toEqual(true);
        });

        it('is false for Open', () => {
            expect(isResolved('Open')).toEqual(false);
        });

        it('is false for NotApplicable', () => {
            expect(isResolved('NotApplicable')).toEqual(false);
        });

        it('is false for an empty status', () => {
            expect(isResolved('')).toEqual(false);
        });
    });

    describe('getStatusOptions', () => {
        const options = getStatusOptions((key) => key);

        it('returns one option per status', () => {
            expect(options).toHaveLength(6);
        });

        it('maps each value to its translation key via the translate function', () => {
            const accepted = options.find((o) => o.value === 'Accepted');
            expect(accepted.text).toEqual('threats.status.accepted');
        });
    });
});
