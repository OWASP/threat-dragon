/**
 * Single source of truth for threat status values and their semantics.
 *
 * Stored `value` strings are persisted into saved threat-model JSON, so they are
 * stable identifiers and must not be renamed. The human-readable labels come
 * from i18n (see STATUS_TRANSLATION_KEYS) and can be changed freely.
 *
 * "Resolved" statuses are those that represent a decided risk-treatment outcome
 * (the threat is no longer open): Mitigated, Accepted, Transferred, Avoided.
 */
export const THREAT_STATUS = {
    NOT_APPLICABLE: 'NotApplicable',
    OPEN: 'Open',
    MITIGATED: 'Mitigated',
    ACCEPTED: 'Accepted',
    TRANSFERRED: 'Transferred',
    AVOIDED: 'Avoided'
};

export const STATUS_TRANSLATION_KEYS = {
    [THREAT_STATUS.NOT_APPLICABLE]: 'threats.status.notApplicable',
    [THREAT_STATUS.OPEN]: 'threats.status.open',
    [THREAT_STATUS.MITIGATED]: 'threats.status.mitigated',
    [THREAT_STATUS.ACCEPTED]: 'threats.status.accepted',
    [THREAT_STATUS.TRANSFERRED]: 'threats.status.transferred',
    [THREAT_STATUS.AVOIDED]: 'threats.status.avoided'
};

export const STATUS_ORDER = [
    THREAT_STATUS.NOT_APPLICABLE,
    THREAT_STATUS.OPEN,
    THREAT_STATUS.MITIGATED,
    THREAT_STATUS.ACCEPTED,
    THREAT_STATUS.TRANSFERRED,
    THREAT_STATUS.AVOIDED
];

export const RESOLVED_STATUSES = [
    THREAT_STATUS.MITIGATED,
    THREAT_STATUS.ACCEPTED,
    THREAT_STATUS.TRANSFERRED,
    THREAT_STATUS.AVOIDED
];

const lower = (status) => (status || '').toLowerCase();

export const isOpen = (status) => lower(status) === lower(THREAT_STATUS.OPEN);

export const isResolved = (status) =>
    RESOLVED_STATUSES.some((resolved) => lower(resolved) === lower(status));

/**
 * Builds the option list for the status dropdowns.
 * @param {(key: string) => string} translate - i18n translate function
 * @returns {{ value: string, text: string }[]}
 */
export const getStatusOptions = (translate) =>
    STATUS_ORDER.map((value) => ({ value, text: translate(STATUS_TRANSLATION_KEYS[value]) }));

export default {
    THREAT_STATUS,
    STATUS_TRANSLATION_KEYS,
    STATUS_ORDER,
    RESOLVED_STATUSES,
    isOpen,
    isResolved,
    getStatusOptions
};
