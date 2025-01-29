import Vue from 'vue';

import {
    BRANCH_CLEAR,
    BRANCH_CREATE,
    BRANCH_FETCH,
    BRANCH_SELECTED
} from '../actions/branch.js';
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
    [BRANCH_CLEAR]: ({ commit }) => commit(BRANCH_CLEAR),
    [BRANCH_FETCH]: async ({ commit, dispatch, rootState }, page = 1) => {
        dispatch(BRANCH_CLEAR);
        const resp = await threatmodelApi.branchesAsync(rootState.repo.selected, page);
        commit(BRANCH_FETCH, {
            'branches': resp.data.branches,
            'page': resp.data.pagination.page,
            'pageNext': resp.data.pagination.next,
            'pagePrev': resp.data.pagination.prev
        });
    },
    [BRANCH_SELECTED]: ({ commit }, branch) => commit(BRANCH_SELECTED, branch),
    [BRANCH_CREATE]: async ({ dispatch, rootState }, {branchName, refBranch}) => {
        await threatmodelApi.createBranchAsync(rootState.repo.selected, branchName, refBranch);
        await dispatch(BRANCH_FETCH);
    }
};

const mutations = {
    [BRANCH_CLEAR]: (state) => clearState(state),
    [BRANCH_FETCH]: (state, {branches, page, pageNext, pagePrev }) => {
        branches.forEach((branch, idx) => Vue.set(state.all, idx, branch));
        state.page = page;
        state.pageNext = pageNext;
        state.pagePrev = pagePrev;
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
