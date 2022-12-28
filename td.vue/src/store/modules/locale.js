import { LOCALE_SELECTED } from '../actions/locale';

const state = {
    locale: 'eng'
};

const actions = {
    [LOCALE_SELECTED]: ({ commit }, locale) => commit(LOCALE_SELECTED, locale)
};

const mutations = {
    [LOCALE_SELECTED]: (state, locale) => {
        state.locale = locale;
    }
};

const getters = { };

export default {
    state,
    actions,
    mutations,
    getters
};
