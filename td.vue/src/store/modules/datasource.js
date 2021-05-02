import {
    DATASOURCE_PROVIDER_CLEAR,
    DATASOURCE_PROVIDER_SELECTED,
    DATASOURCE_REPOSITORY_SELECTED,
    DATASOURCE_REPOSITORY_CLEAR,
    DATASOURCE_BRANCH_SELECTED,
    DATASOURCE_BRANCH_CLEAR,
    DATASOURCE_THREATMODEL_CLEAR,
    DATASOURCE_THREATMODEL_SELECTED
} from '../actions/datasource.js';
import { allProviders } from '../../service/providers.js';

/**
 * Clears the state, thus setting it back to its initial form
 * Useful for logging out
 * @param {object} state
 */
const clearState = (state) => {
    state.provider = '';
};

const state = {
    provider: ''
};

const actions = {
    [DATASOURCE_PROVIDER_CLEAR]: ({ commit }) => commit(DATASOURCE_PROVIDER_CLEAR),
    [DATASOURCE_PROVIDER_SELECTED]: ({ commit }, provider) => commit(DATASOURCE_PROVIDER_SELECTED, provider),
    [DATASOURCE_REPOSITORY_SELECTED]: ({ commit }, repositoryName) => commit(DATASOURCE_REPOSITORY_SELECTED, repositoryName),
    [DATASOURCE_REPOSITORY_CLEAR]: ({ commit }) => commit(DATASOURCE_REPOSITORY_CLEAR),
    [DATASOURCE_BRANCH_SELECTED]: ({ commit }, branch) => commit(DATASOURCE_BRANCH_SELECTED, branch),
    [DATASOURCE_BRANCH_CLEAR]: ({ commit }) => commit(DATASOURCE_BRANCH_CLEAR),
    [DATASOURCE_THREATMODEL_SELECTED]: ({ commit }, threatModel) => commit(DATASOURCE_THREATMODEL_SELECTED, threatModel),
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
    [DATASOURCE_REPOSITORY_SELECTED]: (state, repositoryName) => {
        state[state.provider].repositoryName = repositoryName;
    },
    [DATASOURCE_REPOSITORY_CLEAR]: (state) => {
        state[state.provider].repositoryName = '';
        state[state.provider].branch = '';
    },
    [DATASOURCE_BRANCH_SELECTED]: (state, branch) => {
        state[state.provider].branch = branch;
    },
    [DATASOURCE_BRANCH_CLEAR]: (state) => {
        state[state.provider].branch = '';
    },
    [DATASOURCE_THREATMODEL_SELECTED]: (state, threatModel) => {
        state[state.provider].threatModel = threatModel;
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
