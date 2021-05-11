import { AUTH_CLEAR, AUTH_SET_JWT } from '../actions/auth.js';

export const clearState = (state) => {
    state.jwt = '';
    state.refreshToken = '';
    state.jwtBody = {};
    state.user = {};
};

const state = {
    jwt: '',
    refreshToken: '',
    jwtBody: {},
    user: {}
};

const actions = {
    [AUTH_CLEAR]: ({ commit }) => commit(AUTH_CLEAR),
    [AUTH_SET_JWT]: ({ commit }, tokens) => commit(AUTH_SET_JWT, tokens)
};

const mutations = {
    [AUTH_CLEAR]: (state) => clearState(state),
    [AUTH_SET_JWT]: (state, tokens) => {
        const { accessToken, refreshToken } = tokens;
        const tokenBody = accessToken.split('.')[1];
        const decodedBody = atob(tokenBody);
        const jwtBody = JSON.parse(decodedBody);
        state.jwt = accessToken;
        state.jwtBody = jwtBody;
        state.user = jwtBody.user;
        state.refreshToken = refreshToken;
    }
};

const getters = {
    username: (state) => state.user.username || ''
};

export default {
    state,
    actions,
    mutations,
    getters
};
