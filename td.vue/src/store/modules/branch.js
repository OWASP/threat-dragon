import Vue from 'vue';

import {
    BRANCH_CLEAR,
    BRANCH_FETCH,
    BRANCH_SELECTED
} from '../actions/branch.js';
import threatmodelApi from '../../service/threatmodelApi.js';

export const clearState = (state) => {
    state.all.length = 0;
    state.selected = '';
};

const state = {
    all: [],
    selected: ''
};

const actions = {
    [BRANCH_CLEAR]: ({ commit }) => commit(BRANCH_CLEAR),
    [BRANCH_FETCH]: async ({ commit, rootState }) => {
        const resp = await threatmodelApi.branchesAsync(rootState.repo.selected);
        commit(BRANCH_FETCH, resp.data.branches);
    },
    [BRANCH_SELECTED]: ({ commit }, branch) => commit(BRANCH_SELECTED, branch)
};

const mutations = {
    [BRANCH_CLEAR]: (state) => clearState(state),
    [BRANCH_FETCH]: (state, branches) => {
        state.all.length = 0;
        branches.forEach((branch, idx) => Vue.set(state.all, idx, branch));
    },
    [BRANCH_SELECTED]: (state, repo) => {
        state.selected = repo;
    }
};

const getters = {};

export default {
    state,
    actions,
    mutations,
    getters
};
