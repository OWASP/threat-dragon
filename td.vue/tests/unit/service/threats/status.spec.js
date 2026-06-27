import {
    threatStatus,
    primaryStatuses,
    treatmentStatuses,
    isOpen,
    isResolved,
    getPrimaryStatusOptions,
    getTreatmentStatusOptions
} from '@/service/threats/status.js';

describe('service/threats/status.js', () => {
    it('exposes stable stored status values', () => {
        expect(threatStatus).toEqual({
            notApplicable: 'NotApplicable',
            open: 'Open',
            mitigated: 'Mitigated',
            accepted: 'Accepted',
            transferred: 'Transferred',
            avoided: 'Avoided',
            eliminated: 'Eliminated'
        });
    });

    it('keeps NotApplicable and Open as primary statuses', () => {
        expect(primaryStatuses).toEqual(['NotApplicable', 'Open']);
    });

    it('lists all treatment statuses as resolved', () => {
        expect(treatmentStatuses).toEqual([
            'Mitigated',
            'Accepted',
            'Transferred',
            'Avoided',
            'Eliminated'
        ]);
    });

    it.each(['Open', 'open'])('recognizes %s as open', (status) => {
        expect(isOpen(status)).toEqual(true);
    });

    it.each(['Mitigated', undefined])('does not recognize %s as open', (status) => {
        expect(isOpen(status)).toEqual(false);
    });

    it.each(['Mitigated', 'Accepted', 'Transferred', 'Avoided', 'Eliminated', 'eliminated'])(
        'recognizes %s as resolved',
        (status) => {
            expect(isResolved(status)).toEqual(true);
        }
    );

    it.each(['Open', 'NotApplicable', ''])('does not recognize %s as resolved', (status) => {
        expect(isResolved(status)).toEqual(false);
    });

    it('builds translated primary status options', () => {
        expect(getPrimaryStatusOptions((key) => key)).toEqual([
            { value: 'NotApplicable', text: 'threats.status.notApplicable' },
            { value: 'Open', text: 'threats.status.open' }
        ]);
    });

    it('builds translated treatment status options', () => {
        expect(getTreatmentStatusOptions((key) => key)).toEqual([
            { value: 'Mitigated', text: 'threats.status.mitigated' },
            { value: 'Accepted', text: 'threats.status.accepted' },
            { value: 'Transferred', text: 'threats.status.transferred' },
            { value: 'Avoided', text: 'threats.status.avoided' },
            { value: 'Eliminated', text: 'threats.status.eliminated' }
        ]);
    });
});
