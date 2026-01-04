import { CONFIG_CLEAR, CONFIG_LOADED, CONFIG_ERROR, CONFIG_FETCH } from '@/store/actions/config';
import { RESOLVE_LOCALE } from '@/store/actions/locale';
import { SUPPORTED_LOCALES } from '@/i18n/index';
import api from '@/service/api/api';

const sanitizeConfig = (raw) => {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;

    const out = {};

    if (Array.isArray(raw.allowedLocales) &&
        raw.allowedLocales.every(l => typeof l === 'string' && l.length > 0)) {
        const filtered = raw.allowedLocales.filter(l => SUPPORTED_LOCALES.includes(l));
        if (filtered.length > 0) out.allowedLocales = filtered;
    }

    if (typeof raw.defaultLocale === 'string' && SUPPORTED_LOCALES.includes(raw.defaultLocale)) {
        out.defaultLocale = raw.defaultLocale;
    }

    if (typeof raw.localEnabled === 'boolean') out.localEnabled = raw.localEnabled;
    if (typeof raw.githubEnabled === 'boolean') out.githubEnabled = raw.githubEnabled;
    if (typeof raw.bitbucketEnabled === 'boolean') out.bitbucketEnabled = raw.bitbucketEnabled;
    if (typeof raw.gitlabEnabled === 'boolean') out.gitlabEnabled = raw.gitlabEnabled;
    if (typeof raw.googleEnabled === 'boolean') out.googleEnabled = raw.googleEnabled;

    return Object.keys(out).length > 0 ? out : null;
};

const state = {
    config: null,
    configError: null
};

const actions = {
    [CONFIG_CLEAR]: ({ commit }) => commit(CONFIG_CLEAR),

    [CONFIG_FETCH]: async ({ commit, dispatch }) => {
        dispatch(CONFIG_CLEAR);

        try {
            const response = await api.getAsync('/api/config');
            // The server wraps config in { status: 200, data: { ...config } }
            // but getAsync returns res.data, so response = { status: 200, data: { ...config } }.
            // Extract the inner config object from response.data.
            const configData = response?.data;

            commit(CONFIG_LOADED, { config: configData });
        } catch (error) {
            console.error('Error fetching config:', error);
            commit(CONFIG_ERROR, { error: error.message || 'Unknown error fetching config' });
        }

        await dispatch(RESOLVE_LOCALE, null, { root: true });
    }
};

const mutations = {
    [CONFIG_CLEAR]: (state) => {
        state.config = null;
        state.configError = null;
    },

    [CONFIG_LOADED]: (state, { config }) => {
        const sanitized = sanitizeConfig(config);
        if (sanitized) {
            state.config = sanitized;
            state.configError = null;
        } else {
            state.config = null;
            state.configError = 'Server config rejected: invalid or no usable fields';
        }
    },

    [CONFIG_ERROR]: (state, { error }) => {
        state.configError = error;
    }
};

const getters = {
    allowedLocales: (state) => {
        if (state.config && Array.isArray(state.config.allowedLocales) && state.config.allowedLocales.length > 0) {
            return state.config.allowedLocales;
        }
        return [];  // empty = no restrictions, all supported locales allowed
    },
    defaultLocale: (state) => {
        return state.config?.defaultLocale ?? undefined;
    }
};

export default {
    state,
    actions,
    mutations,
    getters
};

