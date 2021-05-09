import Vue from 'vue';

import { THREATMODEL_FETCH } from '../actions/threatmodel.js';

const state = {
    selected: {}
};

const actions = {
    [THREATMODEL_FETCH]: ({ commit }, id) => {
        // TODO: Make async
        // TODO: Call API to get threat model
        commit(THREATMODEL_FETCH, {});
    }
};

const mutations = {
    [THREATMODEL_FETCH]: (state, threatmodel) => {
        Vue.set(state, 'selected', threatmodel);
    }
};

const getters = {};

export default {
    state,
    actions,
    mutations,
    getters
};
