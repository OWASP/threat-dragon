import { configClear, configLoaded, configError, configFetch } from '@/store/actions/config';
import { resolveLocale } from '@/store/actions/locale';
import { supportedLocales } from '@/i18n/index';
import api from '@/service/api/api';
import analytics from '@/service/analytics.js';

const hasSafeDashboardUrl = (value) => {
    try {
        const url = new URL(value);
        return url.protocol === 'https:' || url.protocol === 'http:';
    } catch {
        return false;
    }
};

const sanitizeConfig = (raw) => {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;

    const out = {};

    if (Array.isArray(raw.allowedLocales) &&
        raw.allowedLocales.every(l => typeof l === 'string' && l.length > 0)) {
        const filtered = raw.allowedLocales.filter(l => supportedLocales.includes(l));
        if (filtered.length > 0) out.allowedLocales = filtered;
    }

    if (typeof raw.defaultLocale === 'string' && supportedLocales.includes(raw.defaultLocale)) {
        out.defaultLocale = raw.defaultLocale;
    }

    if (typeof raw.localEnabled === 'boolean') out.localEnabled = raw.localEnabled;
    if (typeof raw.githubEnabled === 'boolean') out.githubEnabled = raw.githubEnabled;
    if (typeof raw.bitbucketEnabled === 'boolean') out.bitbucketEnabled = raw.bitbucketEnabled;
    if (typeof raw.gitlabEnabled === 'boolean') out.gitlabEnabled = raw.gitlabEnabled;
    if (typeof raw.googleEnabled === 'boolean') out.googleEnabled = raw.googleEnabled;

    if (raw.analytics && typeof raw.analytics === 'object' && !Array.isArray(raw.analytics)) {
        const { enabled, dashboardUrl, eventNames } = raw.analytics;
        if (typeof enabled === 'boolean' &&
            ((!enabled && dashboardUrl === null) || (enabled && hasSafeDashboardUrl(dashboardUrl))) &&
            Array.isArray(eventNames) && eventNames.every(event => typeof event === 'string')) {
            out.analytics = { enabled, dashboardUrl, eventNames };
        }
    }

    return Object.keys(out).length > 0 ? out : null;
};

const state = {
    config: null,
    configError: null
};

const actions = {
    [configClear]: ({ commit }) => commit(configClear),

    [configFetch]: async ({ commit, dispatch }) => {
        dispatch(configClear);

        try {
            const response = await api.getAsync('/api/config', { timeout: 5000 });
            // The server wraps config in { status: 200, data: { ...config } }
            // but getAsync returns res.data, so response = { status: 200, data: { ...config } }.
            // Extract the inner config object from response.data.
            const configData = response?.data;

            commit(configLoaded, { config: configData });
            analytics.configure(configData?.analytics);
        } catch (error) {
            console.error('Error fetching config:', error);
            commit(configError, { error: error.message || 'Unknown error fetching config' });
        }

        await dispatch(resolveLocale, null, { root: true });
    }
};

const mutations = {
    [configClear]: (state) => {
        state.config = null;
        state.configError = null;
        analytics.disable();
    },

    [configLoaded]: (state, { config }) => {
        const sanitized = sanitizeConfig(config);
        if (sanitized) {
            state.config = sanitized;
            state.configError = null;
        } else {
            state.config = null;
            state.configError = 'Server config rejected: invalid or no usable fields';
        }
    },

    [configError]: (state, { error }) => {
        state.configError = error;
    }
};

const getters = {
    allowedLocales: (state) => {
        if (state.config && Array.isArray(state.config.allowedLocales) && state.config.allowedLocales.length > 0) {
            return state.config.allowedLocales;
        }
        return []; // empty = no restrictions, all supported locales allowed
    },
    defaultLocale: (state) => {
        return state.config?.defaultLocale ?? undefined;
    },
    analyticsEnabled: (state) => state.config?.analytics?.enabled === true,
    analyticsDashboardUrl: (state) => state.config?.analytics?.dashboardUrl ?? null
};

export default {
    state,
    actions,
    mutations,
    getters
};
