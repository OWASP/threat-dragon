import { PROVIDER_CLEAR, PROVIDER_SELECTED } from '../actions/provider.js';
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
    [PROVIDER_CLEAR]: ({ commit }) => commit(PROVIDER_CLEAR),
    [PROVIDER_SELECTED]: ({ commit }, provider) => commit(PROVIDER_SELECTED, provider)
};

const mutations = {
    [PROVIDER_CLEAR]: (state) => clearState(state),
    [PROVIDER_SELECTED]: (state, provider) => {
        if (!allProviders[provider]) {
            throw new Error(`"${provider}" is not a recognized provider`);
        }
        state.provider = provider;
    }
};

const getters = {};

export default {
    state,
    actions,
    mutations,
    getters
};
