import Vue from 'vue';
import isElectron from 'is-electron';

import {
    PROVIDER_CLEAR,
    PROVIDER_FETCH,
    PROVIDER_SELECTED
} from '../actions/provider.js';
import providers from '../../service/provider/providers.js';
import threatmodelApi from '../../service/api/threatmodelApi.js';

export const clearState = (state) => {
    state.all.length = 0;
    state.selected = '';
    state.providerUri = '';
};

const state = {
    all: [],
    selected: '',
    providerUri: ''
};

const actions = {
    [PROVIDER_CLEAR]: ({ commit }) => commit(PROVIDER_CLEAR),
    [PROVIDER_FETCH]: ({ commit, dispatch }) => {
        dispatch(PROVIDER_CLEAR);
        commit(PROVIDER_FETCH, Object.keys(providers.providerNames));
    },
    [PROVIDER_SELECTED]: async ({ commit }, providerName) => {
        if (!providerName || !providers.providerNames[providerName]) {
            throw new Error(`Unknown provider: ${providerName}`);
        }
        if (providerName === 'desktop' || isElectron()) {
            commit(PROVIDER_SELECTED, { 'providerName': 'desktop', 'providerUri': 'threat-dragon-desktop' });
        } else if (providerName === 'local') {
            commit(PROVIDER_SELECTED, { 'providerName': 'local', 'providerUri': 'threat-dragon-local' });
        } else {
            const resp = await threatmodelApi.organisationAsync();
            const providerUri = `${resp.protocol}://${resp.hostname}${resp.port ? ':' + resp.port : ''}`;
            commit(PROVIDER_SELECTED, { 'providerName': providerName, 'providerUri': providerUri });
        }
    }
};

const mutations = {
    [PROVIDER_CLEAR]: (state) => clearState(state),
    [PROVIDER_FETCH]: (state, providers) => {
        state.all.length = 0;
        providers.forEach((provider, idx) => Vue.set(state.all, idx, provider));
    },
    [PROVIDER_SELECTED]: (state, { providerName, providerUri }) => {
        state.selected = providerName;
        state.providerUri = providerUri;
        console.debug('PROVIDER_SELECTED providerName: ' + state.selected + ', providerUri: ' + state.providerUri);
    }
};

const getters = {};

export default {
    state,
    actions,
    mutations,
    getters
};
