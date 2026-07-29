import Vue from 'vue';

import {
    branchClear,
    branchCreate,
    branchFetch,
    branchSelected
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
    [branchClear]: ({ commit }) => commit(branchClear),
    [branchFetch]: async ({ commit, dispatch, rootState }, { page = 1 } = {}) => {
        dispatch(branchClear);
        const resp = await threatmodelApi.branchesAsync(rootState.repo.selected, page);
        commit(branchFetch, {
            'branches': resp.data.branches,
            'page': resp.data.pagination.page,
            'pageNext': resp.data.pagination.next,
            'pagePrev': resp.data.pagination.prev
        });
    },
    [branchSelected]: ({ commit }, branch) => commit(branchSelected, branch),
    [branchCreate]: async ({ dispatch, rootState }, {branchName, refBranch}) => {
        await threatmodelApi.createBranchAsync(rootState.repo.selected, branchName, refBranch);
        await dispatch(branchFetch);
    }
};

const mutations = {
    [branchClear]: (state) => clearState(state),
    [branchFetch]: (state, {branches, page, pageNext, pagePrev }) => {
        branches.forEach((branch, idx) => Vue.set(state.all, idx, branch));
        state.page = page;
        state.pageNext = pageNext;
        state.pagePrev = pagePrev;
    },
    [branchSelected]: (state, repo) => {
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

