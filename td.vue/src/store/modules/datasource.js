import {
    DATASOURCE_PROVIDER_CLEAR,
    DATASOURCE_PROVIDER_SELECTED,
    DATASOURCE_REPOSITORY_SELECTED,
    DATASOURCE_REPOSITORY_CLEAR,
    DATASOURCE_BRANCH_SELECTED
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
    [DATASOURCE_BRANCH_SELECTED]: ({ commit }, branch) => commit(DATASOURCE_BRANCH_SELECTED, branch)
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
    },
    [DATASOURCE_BRANCH_SELECTED]: (state, branch) => {
        state[state.provider].branch = branch;
    }
};

const getters = {};

export default {
    state,
    actions,
    mutations,
    getters
};
