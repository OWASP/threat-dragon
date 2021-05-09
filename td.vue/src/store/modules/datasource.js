import Vue from 'vue';

import {
    DATASOURCE_PROVIDER_CLEAR,
    DATASOURCE_PROVIDER_SELECTED,
    DATASOURCE_REPOSITORY_SELECTED,
    DATASOURCE_REPOSITORY_CLEAR,
    DATASOURCE_BRANCH_FETCH,
    DATASOURCE_BRANCH_SELECTED,
    DATASOURCE_BRANCH_CLEAR,
    DATASOURCE_THREATMODELS_FETCH,
    DATASOURCE_THREATMODEL_CLEAR,
    DATASOURCE_THREATMODEL_SELECTED,
    DATASOURCE_REPOSITORY_FETCH
} from '../actions/datasource.js';
import { allProviders } from '../../service/providers.js';
import threatmodelApi from '../../service/threatmodelApi.js';

/**
 * Clears the state, thus setting it back to its initial form
 * Useful for logging out
 * @param {object} state
 */
const clearState = (state) => {
    state.provider = '';
    state.repos.length = 0;
    state.branches.length = 0;
    state.models.length = 0;
    state.threatModel = {};
};

const state = {
    provider: '',
    repos: [],
    branches: [],
    models: [],
    threatModel: {}
};

const actions = {
    [DATASOURCE_PROVIDER_CLEAR]: ({ commit }) => commit(DATASOURCE_PROVIDER_CLEAR),
    [DATASOURCE_PROVIDER_SELECTED]: ({ commit }, provider) => commit(DATASOURCE_PROVIDER_SELECTED, provider),
    [DATASOURCE_REPOSITORY_FETCH]: async ({ commit }) => {
        const resp = await threatmodelApi.reposAsync();
        commit(DATASOURCE_REPOSITORY_FETCH, resp.data.repos);
    },
    [DATASOURCE_REPOSITORY_SELECTED]: ({ commit }, repositoryName) => commit(DATASOURCE_REPOSITORY_SELECTED, repositoryName),
    [DATASOURCE_REPOSITORY_CLEAR]: ({ commit }) => commit(DATASOURCE_REPOSITORY_CLEAR),
    [DATASOURCE_BRANCH_FETCH]: async ({ commit }, repoName) => {
        const resp = await threatmodelApi.branchesAsync(repoName);
        commit(DATASOURCE_BRANCH_FETCH, resp.data.branches);
    },
    [DATASOURCE_BRANCH_SELECTED]: ({ commit }, branch) => commit(DATASOURCE_BRANCH_SELECTED, branch),
    [DATASOURCE_BRANCH_CLEAR]: ({ commit }) => commit(DATASOURCE_BRANCH_CLEAR),
    [DATASOURCE_THREATMODELS_FETCH]: async ({ commit }, repoDeets) => {
        const { repoName, branch } = repoDeets;
        const resp = await threatmodelApi.modelsAsync(repoName, branch);
        commit(DATASOURCE_THREATMODELS_FETCH, resp.data);
    },
    [DATASOURCE_THREATMODEL_SELECTED]: async ({ commit }, deets) => {
        const { repoName, branch, threatModel } = deets;
        const resp = await threatmodelApi.modelAsync(repoName, branch, threatModel);
        commit(DATASOURCE_THREATMODEL_SELECTED, resp.data);
    },
    [DATASOURCE_THREATMODEL_CLEAR]: ({ commit }) => commit(DATASOURCE_THREATMODEL_CLEAR)
};

const mutations = {
    [DATASOURCE_PROVIDER_CLEAR]: (state) => clearState(state),
    [DATASOURCE_PROVIDER_SELECTED]: (state, provider) => {
        if (!allProviders[provider]) {
            throw new Error(`"${provider}" is not a recognized provider`);
        }
        state.provider = provider;
        state[provider] = {};
    },
    [DATASOURCE_REPOSITORY_FETCH]: (state, repos) => {
        state.repos.length = 0;
        repos.forEach((repo, idx) => {
            Vue.set(state.repos, idx, repo);
        });
    },
    [DATASOURCE_REPOSITORY_SELECTED]: (state, repositoryName) => {
        state[state.provider].repositoryName = repositoryName;
    },
    [DATASOURCE_REPOSITORY_CLEAR]: (state) => {
        state[state.provider].repositoryName = '';
        state[state.provider].branch = '';
    },
    [DATASOURCE_BRANCH_FETCH]: (state, branches) => {
        state.branches.length = 0;
        branches.forEach((branch, idx) => {
            Vue.set(state.branches, idx, branch);
        });
    },
    [DATASOURCE_BRANCH_SELECTED]: (state, branch) => {
        state[state.provider].branch = branch;
    },
    [DATASOURCE_BRANCH_CLEAR]: (state) => {
        state[state.provider].branch = '';
    },
    [DATASOURCE_THREATMODELS_FETCH]: (state, models) => {
        state.models.length = 0;
        models.forEach((model, idx) => {
            Vue.set(state.models, idx, model);
        });
    },
    [DATASOURCE_THREATMODEL_SELECTED]: (state, threatModel) => {
        state.threatModel = threatModel;
    },
    [DATASOURCE_THREATMODEL_CLEAR]: (state) => {
        state[state.provider].threatModel = '';
    }
};

const getters = {};

export default {
    state,
    actions,
    mutations,
    getters
};
