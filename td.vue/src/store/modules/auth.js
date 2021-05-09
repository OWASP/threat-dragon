import Vue from 'vue';

import { AUTH_SET_JWT } from '../actions/auth.js';

const state = {
    jwt: '',
    jwtBody: {},
    user: {}
};

const actions = {
    [AUTH_SET_JWT]: ({ commit }, jwt) => commit(AUTH_SET_JWT, jwt)
};

const mutations = {
    [AUTH_SET_JWT]: (state, jwt) => {
        const tokenBody = jwt.split('.')[1];
        const decodedBody = atob(tokenBody);
        const jwtBody = JSON.parse(decodedBody);
        state.jwt = jwt;
        Vue.set(state, 'jwtBody', jwtBody);
        Vue.set(state, 'user', jwtBody.user);
    }
};

// TODO: Getts for isLoggedIn, tokenExpired, etc etc
const getters = {};

export default {
    state,
    actions,
    mutations,
    getters
};
