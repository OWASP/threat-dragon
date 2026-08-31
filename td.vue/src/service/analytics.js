import api from '@/service/api/api.js';

const analyticsPath = '/api/analytics';
const durationBucket = (durationMs) => {
    if (durationMs < 5 * 60 * 1000) return 'LESS_THAN_5_MINUTES';
    if (durationMs < 15 * 60 * 1000) return 'FIVE_TO_FIFTEEN_MINUTES';
    if (durationMs < 30 * 60 * 1000) return 'FIFTEEN_TO_THIRTY_MINUTES';
    if (durationMs < 60 * 60 * 1000) return 'THIRTY_TO_SIXTY_MINUTES';
    return 'SIXTY_PLUS_MINUTES';
};

const hasSafeDashboardUrl = (value) => {
    try {
        const url = new URL(value);
        return url.protocol === 'https:' || url.protocol === 'http:';
    } catch {
        return false;
    }
};

let enabled = false;
let eventNames = new Set();
let editStartedAt = null;

const disable = () => {
    enabled = false;
    eventNames = new Set();
    editStartedAt = null;
};

const configure = (config) => {
    if (!config?.enabled || !hasSafeDashboardUrl(config.dashboardUrl) || !Array.isArray(config.eventNames)) {
        disable();
        return false;
    }

    eventNames = new Set(config.eventNames.filter(event => typeof event === 'string'));
    if (eventNames.size === 0) {
        disable();
        return false;
    }

    enabled = true;
    return true;
};

const track = async (event, props) => {
    if (!enabled || !eventNames.has(event)) return false;

    const body = { event };
    if (props) body.props = props;

    try {
        await api.postAsync(analyticsPath, body);
        return true;
    } catch {
        return false;
    }
};

const startEditing = (now = Date.now()) => {
    if (!enabled || editStartedAt !== null) return false;
    editStartedAt = now;
    return true;
};

const finishEditing = (now = Date.now()) => {
    if (editStartedAt === null) return false;

    const startedAt = editStartedAt;
    editStartedAt = null;
    track('THREAT_MODEL_EDIT_SESSION_ENDED', {
        duration_bucket: durationBucket(Math.max(0, now - startedAt))
    });
    return true;
};

window.addEventListener('pagehide', () => finishEditing());

export { durationBucket };

export default {
    configure,
    disable,
    finishEditing,
    startEditing,
    track
};
