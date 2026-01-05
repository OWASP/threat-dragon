import { LOCALE_SELECTED, RESOLVE_LOCALE } from '../actions/locale';
import { isSupportedLocale, resolveLocale, getBrowserLanguages } from '@/service/locale/locale-resolver';
import i18nFactory, { SUPPORTED_LOCALES, DEFAULT_LOCALE } from '@/i18n/index';

const state = {
    locale: 'en'
};

const syncI18nWithServerPolicy = (i18n, rootGetters) => {
    const serverDefault = rootGetters.defaultLocale;

    if (serverDefault) {
        i18n.global.fallbackLocale = {
            ...(i18n.global.fallbackLocale || {}),
            default: serverDefault
        };
    }
};

const actions = {
    [LOCALE_SELECTED]: ({ commit, rootGetters }, locale) => {
        const available = rootGetters.availableLocales;
        if (!available || !available.includes(locale)) return;
        commit(LOCALE_SELECTED, locale);

        const i18n = i18nFactory.get();
        i18n.global.locale = locale;
        syncI18nWithServerPolicy(i18n, rootGetters);
    },

    [RESOLVE_LOCALE]: ({ dispatch, rootGetters, state }) => {
        if (state.locale !== DEFAULT_LOCALE) {
            const available = rootGetters.availableLocales;
            if (available.includes(state.locale)) {
                dispatch(LOCALE_SELECTED, state.locale);
                return;
            }
        }

        const browserLocales = typeof navigator !== 'undefined' ? getBrowserLanguages(navigator) : [];
        const { locale } = resolveLocale({
            browserLanguages: browserLocales,
            serverDefault: rootGetters.defaultLocale,
            allowedLocales: rootGetters.allowedLocales
        });

        dispatch(LOCALE_SELECTED, locale);
    }
};

const mutations = {
    [LOCALE_SELECTED]: (state, locale) => {
        // Safety net: reject non-canonical or non-existent locale formats
        if (!isSupportedLocale(locale)) return;
        state.locale = locale;
    }
};

const getters = {
    availableLocales: (state, getters, rootState, rootGetters) => {
        const allowed = rootGetters?.allowedLocales;
        if (allowed && Array.isArray(allowed) && allowed.length > 0) {
            return SUPPORTED_LOCALES.filter(l => allowed.includes(l));
        }
        return SUPPORTED_LOCALES;
    }
};

export default {
    state,
    actions,
    mutations,
    getters
};

