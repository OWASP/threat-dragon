import { DATASOURCE_PROVIDER_CLEAR, DATASOURCE_PROVIDER_SELECTED } from '../actions/datasource.js';
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
    [DATASOURCE_PROVIDER_SELECTED]: ({ commit }, provider) => commit(DATASOURCE_PROVIDER_SELECTED, provider)
};

const mutations = {
    [DATASOURCE_PROVIDER_CLEAR]: (state) => clearState(state),
    [DATASOURCE_PROVIDER_SELECTED]: (state, provider) => {
        if (!allProviders[provider]) {
            throw new Error(`"${provider}" is not a recognized provider`);
        }
        state.provider = provider;
        state[provider] = {};
    }
};

const getters = {};

export default {
    state,
    actions,
    mutations,
    getters
};
