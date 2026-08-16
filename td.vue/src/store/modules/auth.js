import { authClear, authSetJwt, authSetLocal, logout } from '../actions/auth';
import { branchClear } from '../actions/branch';
import loginApi from '@/service/api/loginApi';
import { providerClear } from '../actions/provider';
import providers from '@/service/provider/providers';
import { repositoryClear } from '../actions/repository';
import { threatmodelClear } from '../actions/threatmodel';

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
    [authClear]: ({ commit }) => commit(authClear),
    [authSetJwt]: ({ commit }, tokens) => commit(authSetJwt, tokens),
    [authSetLocal]: ({ commit }) => commit(authSetLocal),
    [logout]: async ({ dispatch, state, rootState }) => {
        try {
            if (rootState.provider.selected !== providers.allProviders.local.key && rootState.provider.selected !== providers.allProviders.desktop.key) {
                await loginApi.logoutAsync(state.refreshToken);
            }
        } catch (e) {
            console.error('Error calling logout api', e);
        }
        dispatch(authClear);
        dispatch(branchClear);
        dispatch(providerClear);
        dispatch(repositoryClear);
        dispatch(threatmodelClear);
    }
};

const mutations = {
    [authClear]: (state) => clearState(state),
    [authSetJwt]: (state, tokens) => {
        try {
            const { accessToken, refreshToken } = tokens;
            const tokenBody = accessToken.split('.')[1];
            const decodedBody = window.atob(tokenBody);
            const jwtBody = JSON.parse(decodedBody);
            state.jwt = accessToken;
            state.jwtBody = jwtBody;
            state.user = jwtBody.user;
            state.refreshToken = refreshToken;
        } catch (e) {
            console.error('Error decoding JWT', e);
            throw e;
        }
    },
    [authSetLocal]: (state) => {
        state.user = {
            username: 'local-user'
        };
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
