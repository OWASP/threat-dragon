import Vue from 'vue';

import {
    REPOSITORY_CLEAR,
    REPOSITORY_FETCH,
    REPOSITORY_SELECTED
} from '../actions/repository.js';
import threatmodelApi from '../../service/api/threatmodelApi.js';

export const clearState = (state) => {
    state.all.length = 0;
    state.selected = '';
};

const state = {
    all: [],
    selected: ''
};

const actions = {
    [REPOSITORY_CLEAR]: ({ commit }) => commit(REPOSITORY_CLEAR),
    [REPOSITORY_FETCH]: async ({ commit, dispatch }) => {
        dispatch(REPOSITORY_CLEAR);
        const resp = await threatmodelApi.reposAsync();
        commit(REPOSITORY_FETCH, resp.data.repos);
    },
    [REPOSITORY_SELECTED]: ({ commit }, repo) => commit(REPOSITORY_SELECTED, repo)
};

const mutations = {
    [REPOSITORY_CLEAR]: (state) => clearState(state),
    [REPOSITORY_FETCH]: (state, repos) => {
        state.all.length = 0;
        repos.forEach((repo, idx) => Vue.set(state.all, idx, repo));
    },
    [REPOSITORY_SELECTED]: (state, repo) => {
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
