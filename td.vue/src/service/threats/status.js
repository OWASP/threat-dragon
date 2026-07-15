export const threatStatus = {
    notApplicable: 'NotApplicable',
    open: 'Open',
    mitigated: 'Mitigated',
    accepted: 'Accepted',
    transferred: 'Transferred',
    avoided: 'Avoided',
    eliminated: 'Eliminated'
};

const statusTranslationKeys = {
    [threatStatus.notApplicable]: 'threats.status.notApplicable',
    [threatStatus.open]: 'threats.status.open',
    [threatStatus.mitigated]: 'threats.status.mitigated',
    [threatStatus.accepted]: 'threats.status.accepted',
    [threatStatus.transferred]: 'threats.status.transferred',
    [threatStatus.avoided]: 'threats.status.avoided',
    [threatStatus.eliminated]: 'threats.status.eliminated'
};

export const primaryStatuses = [
    threatStatus.notApplicable,
    threatStatus.open
];

export const treatmentStatuses = [
    threatStatus.mitigated,
    threatStatus.accepted,
    threatStatus.transferred,
    threatStatus.avoided,
    threatStatus.eliminated
];

const lower = (status) => (status || '').toLowerCase();
const getOptions = (statuses, translate) =>
    statuses.map((value) => ({ value, text: translate(statusTranslationKeys[value]) }));

export const isOpen = (status) => lower(status) === lower(threatStatus.open);
export const isResolved = (status) =>
    treatmentStatuses.some((resolved) => lower(resolved) === lower(status));
export const getPrimaryStatusOptions = (translate) => getOptions(primaryStatuses, translate);
export const getTreatmentStatusOptions = (translate) => getOptions(treatmentStatuses, translate);

export default {
    getPrimaryStatusOptions,
    getTreatmentStatusOptions,
    isOpen,
    isResolved
};
