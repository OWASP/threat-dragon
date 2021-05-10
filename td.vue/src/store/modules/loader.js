import { LOADER_FINISHED, LOADER_STARTED } from '../actions/loader.js';

const state = {
    loading: false
};

const actions = {
    [LOADER_FINISHED]: ({ commit }) => commit(LOADER_FINISHED),
    [LOADER_STARTED]: ({ commit }) => commit(LOADER_STARTED)
};

const mutations = {
    [LOADER_FINISHED]: (state) => {
        state.loading = false;
    },
    [LOADER_STARTED]: (state) => {
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
