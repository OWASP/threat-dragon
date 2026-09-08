import api from '@/service/api/api.js';
import { isDesktopApp } from '@/service/environment.js';

const analyticsPath = '/api/analytics';
const editorTypes = new Set(['diagram', 'threat_model']);
const methodologies = Object.freeze({
    CIA: 'CIA',
    DIE: 'CIADIE',
    CIADIE: 'CIADIE',
    LINDDUN: 'LINDDUN',
    PLOT4ai: 'PLOT4AI',
    STRIDE: 'STRIDE',
    EOP: 'EOP'
});

const methodologyForDiagramType = (diagramType) => methodologies[diagramType] || 'GENERIC';

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
let editSession = null;

const disable = () => {
    enabled = false;
    eventNames = new Set();
    editSession = null;
};

const configure = (config) => {
    if (isDesktopApp() || !config?.enabled || !hasSafeDashboardUrl(config.dashboardUrl) || !Array.isArray(config.eventNames)) {
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

const startEditing = (editor, now = Date.now()) => {
    if (!enabled || editSession !== null || !editorTypes.has(editor)) return false;
    editSession = { editor, startedAt: now };
    return true;
};

const sendWithBeacon = (event, props) => {
    if (!enabled || !eventNames.has(event) || typeof navigator.sendBeacon !== 'function') return false;

    const body = JSON.stringify({ event, props });
    return navigator.sendBeacon(analyticsPath, new Blob([body], { type: 'application/json' }));
};

const finishEditing = (now = Date.now(), useBeacon = false) => {
    if (editSession === null) return false;

    const { editor, startedAt } = editSession;
    editSession = null;
    const props = {
        duration_bucket: durationBucket(Math.max(0, now - startedAt)),
        editor
    };
    if (!useBeacon || !sendWithBeacon('THREAT_MODEL_EDIT_SESSION_ENDED', props)) {
        track('THREAT_MODEL_EDIT_SESSION_ENDED', props);
    }
    return true;
};

window.addEventListener('pagehide', () => finishEditing(Date.now(), true));

export { durationBucket, methodologyForDiagramType };

export default {
    configure,
    disable,
    finishEditing,
    startEditing,
    track
};
