import isElectron from 'is-electron';

import { PROVIDER_CLEAR, PROVIDER_FETCH, PROVIDER_SELECTED } from '../actions/provider.js';
import providers from '../../service/provider/providers.js';
import threatmodelApi from '../../service/api/threatmodelApi.js';
import logger from '@/utils/logger.js';

// Create a context-specific logger
const log = logger.getLogger('store:provider');

export const clearState = (state) => {
    state.all.length = 0;
    state.selected = '';
    state.providerUri = '';
    
    // Clear localStorage provider data
    try {
        localStorage.removeItem('td_provider');
        localStorage.removeItem('td_providerUri');
    } catch (e) {
        log.error('Failed to clear provider from localStorage', { error: e });
    }
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
            commit(PROVIDER_SELECTED, {
                providerName: 'desktop',
                providerUri: 'threat-dragon-desktop'
            });
        } else if (providerName === 'local') {
            commit(PROVIDER_SELECTED, {
                providerName: 'local',
                providerUri: 'threat-dragon-local'
            });
        } else {
            const resp = await threatmodelApi.organisationAsync();
            const providerUri = `${resp.protocol}://${resp.hostname}${resp.port ? ':' + resp.port : ''
            }`;
            commit(PROVIDER_SELECTED, { providerName: providerName, providerUri: providerUri });
        }
    }
};

const mutations = {
    [PROVIDER_CLEAR]: (state) => clearState(state),
    [PROVIDER_FETCH]: (state, providers) => {
        // Replace Vue.set with direct array assignment (Vue 3 reactivity)
        state.all = [...providers];
    },
    [PROVIDER_SELECTED]: (state, { providerName, providerUri }) => {
        state.selected = providerName;
        state.providerUri = providerUri;
        
        // Store provider info in localStorage to persist across redirects
        try {
            localStorage.setItem('td_provider', providerName);
            localStorage.setItem('td_providerUri', providerUri);
        } catch (e) {
            log.error('Failed to store provider in localStorage', { error: e });
        }
        
        log.debug('PROVIDER_SELECTED', {
            providerName: state.selected,
            providerUri: state.providerUri
        });
    }
};

const getters = {};

export default {
    state,
    actions,
    mutations,
    getters
};
