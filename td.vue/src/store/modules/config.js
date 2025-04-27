import { CONFIG_CLEAR, CONFIG_LOADED } from '@/store/actions/config';
import api from '@/service/api/api';
import { isElectronMode } from '@/utils/environment';
import logger from '@/utils/logger.js';

// Create a context-specific logger
const log = logger.getLogger('store:config');

export const clearState = (state) => {
    state.config = null;
};

const state = {
    config: null
};

// Default desktop configuration with Google auth disabled
const desktopConfig = {
    githubEnabled: false,
    googleEnabled: false,
    gitlabEnabled: false,
    bitbucketEnabled: false,
    localEnabled: true,
    desktopEnabled: true
};

// Fallback config for web mode when API fails
const webFallbackConfig = {
    githubEnabled: false,
    googleEnabled: false,
    gitlabEnabled: false,
    bitbucketEnabled: false,
    localEnabled: true,
    desktopEnabled: false
};

const actions = {
    [CONFIG_CLEAR]: ({ commit }) => commit(CONFIG_CLEAR),

    CONFIG_FETCH: async ({ commit, dispatch }) => {
        dispatch(CONFIG_CLEAR);

        // In Electron mode, set a default config and skip the API call
        if (isElectronMode()) {
            log.info('DESKTOP MODE: Using desktop config with Google auth disabled');
            commit(CONFIG_LOADED, { config: desktopConfig });
            return;
        }

        try {
            log.info('FETCHING config from server');
            const response = await api.getAsync('/api/config');
            log.info('SERVER CONFIG RECEIVED', { config: response.data });
            commit(CONFIG_LOADED, { config: response.data });
        } catch (error) {
            log.error('Error fetching config', { error });
            // Set a fallback config on error
            log.info('Using fallback config due to API error');
            commit(CONFIG_LOADED, { config: webFallbackConfig });
        }
    }
};

const mutations = {
    [CONFIG_CLEAR]: (state) => clearState(state),

    [CONFIG_LOADED]: (state, { config }) => {
        log.info('CONFIG LOADED', { config });
        state.config = config;
    }
};

const getters = {
    isGoogleEnabled: (state) => {
        return state.config?.googleEnabled === true && !isElectronMode();
    },
    isElectronMode: () => {
        return isElectronMode();
    }
};

//
// const getters = {
//     config: (state) => state.config,
// };

export default {
    state,
    actions,
    mutations,
    getters
};
