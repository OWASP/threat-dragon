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
    state.page = 1;
    state.pageNext = false;
    state.pagePrev = false;
};


const state = {
    all: [],
    selected: '',
    page: 1,
    pageNext: false,
    pagePrev: false
};

const actions = {
    [REPOSITORY_CLEAR]: ({ commit }) => commit(REPOSITORY_CLEAR),
    [REPOSITORY_FETCH]: async ({ commit, dispatch }, {page, searchQuery}) => {
        dispatch(REPOSITORY_CLEAR);
        const resp = await threatmodelApi.reposAsync(page, searchQuery);
        commit(REPOSITORY_FETCH, {
            'repos': resp.data.repos,
            'page': resp.data.pagination.page,
            'pageNext': resp.data.pagination.next,
            'pagePrev': resp.data.pagination.prev
        });
    },
    [REPOSITORY_SELECTED]: ({ commit }, repo) => commit(REPOSITORY_SELECTED, repo)
};

const mutations = {
    [REPOSITORY_CLEAR]: (state) => clearState(state),
    [REPOSITORY_FETCH]: (state, { repos, page, pageNext, pagePrev }) => {
        state.all.length = 0;
        repos.forEach((repo, idx) => Vue.set(state.all, idx, repo));
        state.page = page;
        state.pageNext = pageNext;
        state.pagePrev = pagePrev;
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
