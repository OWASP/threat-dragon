import { loaderFinished, loaderStarted } from '../actions/loader.js';

const state = {
    loading: false
};

const actions = {
    [loaderFinished]: ({ commit }) => commit(loaderFinished),
    [loaderStarted]: ({ commit }) => commit(loaderStarted)
};

const mutations = {
    [loaderFinished]: (state) => {
        state.loading = false;
    },
    [loaderStarted]: (state) => {
        state.loading = true;
    }
};

const getters = { };

export default {
    state,
    actions,
    mutations,
    getters
};
