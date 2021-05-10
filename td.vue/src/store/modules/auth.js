import { AUTH_CLEAR, AUTH_SET_JWT } from '../actions/auth.js';

export const clearState = (state) => {
    state.jwt = '';
    state.jwtBody = {};
    state.user = {};
};

const state = {
    jwt: '',
    jwtBody: {},
    user: {}
};

const actions = {
    [AUTH_CLEAR]: ({ commit }) => commit(AUTH_CLEAR),
    [AUTH_SET_JWT]: ({ commit }, jwt) => commit(AUTH_SET_JWT, jwt)
};

const mutations = {
    [AUTH_CLEAR]: (state) => clearState(state),
    [AUTH_SET_JWT]: (state, jwt) => {
        const tokenBody = jwt.split('.')[1];
        const decodedBody = atob(tokenBody);
        const jwtBody = JSON.parse(decodedBody);
        state.jwt = jwt;
        state.jwtBody = jwtBody;
        state.user = jwtBody.user;
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
