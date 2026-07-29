import Vue from 'vue';
import { isDesktopApp } from '@/service/environment';

import{
    providerClear,
    providerFetch,
    providerSelected
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
    [providerClear]: ({ commit }) => commit(providerClear),
    [providerFetch]: ({ commit, dispatch }) => {
        dispatch(providerClear);
        commit(providerFetch, Object.keys(providers.providerNames));
    },
    [providerSelected]: async ({ commit }, providerName) => {
        if (!providerName || !providers.providerNames[providerName]) {
            throw new Error(`Unknown provider: ${providerName}`);
        }
        if (providerName === 'desktop' || isDesktopApp()) {
            commit(providerSelected, { 'providerName': 'desktop', 'providerUri': 'threat-dragon-desktop' });
        } else if (providerName === 'local') {
            commit(providerSelected, { 'providerName': 'local', 'providerUri': 'threat-dragon-local' });
        } else {
            const resp = await threatmodelApi.organisationAsync(providerName);
            const providerUri = `${resp.protocol}://${resp.hostname}${resp.port ? ':' + resp.port : ''}`;
            commit(providerSelected, { 'providerName': providerName, 'providerUri': providerUri });
        }
    }
};

const mutations = {
    [providerClear]: (state) => clearState(state),
    [providerFetch]: (state, providers) => {
        state.all.length = 0;
        providers.forEach((provider, idx) => Vue.set(state.all, idx, provider));
    },
    [providerSelected]: (state, { providerName, providerUri }) => {
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