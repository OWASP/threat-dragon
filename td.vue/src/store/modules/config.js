import { configClear, configLoaded, configError, configFetch } from '@/store/actions/config';
import { resolveLocale } from '@/store/actions/locale';
import { supportedLocales } from '@/i18n/index';
import { initPlausible } from '@/service/plausible';
import api from '@/service/api/api';

const sanitizeConfig = (raw) => {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
        return null;
    }

    const out = {};

    if (Array.isArray(raw.allowedLocales) &&
        raw.allowedLocales.every(locale => typeof locale === 'string' && locale.length > 0)) {
        const filtered = raw.allowedLocales.filter(locale => supportedLocales.includes(locale));
        if (filtered.length > 0) {
            out.allowedLocales = filtered;
        }
    }

    if (typeof raw.defaultLocale === 'string' && supportedLocales.includes(raw.defaultLocale)) {
        out.defaultLocale = raw.defaultLocale;
    }
    if (typeof raw.localEnabled === 'boolean') {
        out.localEnabled = raw.localEnabled;
    }
    if (typeof raw.githubEnabled === 'boolean') {
        out.githubEnabled = raw.githubEnabled;
    }
    if (typeof raw.bitbucketEnabled === 'boolean') {
        out.bitbucketEnabled = raw.bitbucketEnabled;
    }
    if (typeof raw.gitlabEnabled === 'boolean') {
        out.gitlabEnabled = raw.gitlabEnabled;
    }
    if (typeof raw.googleEnabled === 'boolean') {
        out.googleEnabled = raw.googleEnabled;
    }

    if (raw.plausible && typeof raw.plausible === 'object' && !Array.isArray(raw.plausible)) {
        const p = {};
        if (typeof raw.plausible.enabled === 'boolean') {
            p.enabled = raw.plausible.enabled;
        }
        if (typeof raw.plausible.url === 'string') {
            p.url = raw.plausible.url;
        }
        if (typeof raw.plausible.domain === 'string') {
            p.domain = raw.plausible.domain;
        }
        if (Object.keys(p).length > 0) {
            out.plausible = p;
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

    [configFetch]: async ({ commit, dispatch, state }) => {
        dispatch(configClear);

        try {
            const response = await api.getAsync('/api/config', { timeout: 5000 });
            // The server wraps config in { status: 200, data: { ...config } }
            // but getAsync returns res.data, so response = { status: 200, data: { ...config } }.
            // Extract the inner config object from response.data.
            const configData = response?.data;

            commit(configLoaded, { config: configData });
        } catch (error) {
            console.error('Error fetching config:', error);
            commit(configError, { error: error.message || 'Unknown error fetching config' });
        }

        // Initialize Plausible analytics if enabled
        try {
            const plausibleConfig = state?.config?.plausible;
            if (plausibleConfig) {
                initPlausible(plausibleConfig);
            }
        } catch (e) {
            console.warn('Failed to initialize Plausible analytics:', e);
        }

        await dispatch(resolveLocale, null, { root: true });
    }
};

const mutations = {
    [configClear]: (state) => {
        state.config = null;
        state.configError = null;
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
    plausibleConfig: (state) => {
        return state.config?.plausible ?? { enabled: false };
    }
};

export default {
    state,
    actions,
    mutations,
    getters
};
