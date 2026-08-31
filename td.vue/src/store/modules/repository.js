import {
    repositoryClear,
    repositoryFetch,
    repositorySelected
} from '../actions/repository.js';
import threatmodelApi from '@/service/api/threatmodelApi';

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
    [repositoryClear]: ({ commit }) => commit(repositoryClear),
    [repositoryFetch]: async ({ commit, dispatch }, {page, searchQuery}) => {
        dispatch(repositoryClear);
        const resp = await threatmodelApi.reposAsync(page, searchQuery);
        commit(repositoryFetch, {
            'repos': resp.data.repos,
            'page': resp.data.pagination.page,
            'pageNext': resp.data.pagination.next,
            'pagePrev': resp.data.pagination.prev
        });
    },
    [repositorySelected]: ({ commit }, repo) => commit(repositorySelected, repo)
};

const mutations = {
    [repositoryClear]: (state) => clearState(state),
    [repositoryFetch]: (state, { repos, page, pageNext, pagePrev }) => {
        state.all.length = 0;
        repos.forEach((repo, idx) => state.all[idx] = repo);
        state.page = page;
        state.pageNext = pageNext;
        state.pagePrev = pagePrev;
    },
    [repositorySelected]: (state, repo) => {
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
