import { AUTH_PROVIDER_CLEAR, AUTH_PROVIDER_SELECTED } from '../actions/auth.js';
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
    [AUTH_PROVIDER_CLEAR]: ({ commit }) => commit(AUTH_PROVIDER_CLEAR),
    [AUTH_PROVIDER_SELECTED]: ({ commit }, provider) => commit(AUTH_PROVIDER_SELECTED, provider)
};

const mutations = {
    [AUTH_PROVIDER_CLEAR]: (state) => clearState(state),
    [AUTH_PROVIDER_SELECTED]: (state, provider) => {
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
