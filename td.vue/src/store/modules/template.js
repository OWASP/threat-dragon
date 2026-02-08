import {
    TEMPLATE_FETCH_ALL,
    TEMPLATE_CLEAR,
    TEMPLATE_CREATE,
    TEMPLATE_UPDATE,
    TEMPLATE_DELETE,
    TEMPLATE_FETCH_MODEL_BY_ID,
    TEMPLATE_SET_TEMPLATES,
    TEMPLATE_SET_CONTENT_STORE_STATUS,
    TEMPLATE_BOOTSTRAP
} from '@/store/actions/template';

import templateApi from '@/service/api/templateApi.js';
import { providerTypes } from '@/service/provider/providerTypes';
import { getProviderType } from '@/service/provider/providers';

const state = {
    templates: [],// list of templates
    contentStore: {
        status: null,   // null | 'NOT_CONFIGURED' | 'REPO_NOT_FOUND' | 'NOT_INITIALIZED' | 'FOLDER_NOT_FOUND' | 'READ_ONLY' | 'READ_WRITE'
        canWrite: false // user has write permissions (web: repo push access, desktop: folder write access)
    }
};

const actions = {

    //bootstrap the template content repository with required folder structure
    [TEMPLATE_BOOTSTRAP]: async ({ dispatch }) => {
        await templateApi.bootstrapAsync();
        // After successful bootstrap, refresh template list
        await dispatch(TEMPLATE_FETCH_ALL);
    },

    /**
     * Admin action that adds a new template to the repository
     * @param {dispatch}  - calls fetch all after creation
     * @param {Object} template - The full template object(including metadata and content) from local file
     * @returns {Promise}
     */
    [TEMPLATE_CREATE]: async ({ dispatch, rootState }, { template }) => {
         if (getProviderType(rootState.provider.selected) === providerTypes.desktop) {
                window.electronAPI.importTemplate(template);
                return;
            }
        await templateApi.importTemplateAsync(template);
        await dispatch(TEMPLATE_FETCH_ALL);
    },

    /**
     * Admin action that adds a new template to the repository
     * @param {dispatch}  - calls fetch all after creation
     * @param {Object} templateMetadata - name,description,tags,id of template to update
     * @returns {Promise}
     */
    [TEMPLATE_UPDATE]: async ({ dispatch, rootState }, templateMetadata) => {
        if (getProviderType(rootState.provider.selected) === providerTypes.desktop) {
            window.electronAPI.updateTemplate(templateMetadata);
            return;
        }
        await templateApi.updateTemplateAsync(templateMetadata);
        await dispatch(TEMPLATE_FETCH_ALL);
    },

    [TEMPLATE_DELETE]: async ({ dispatch, rootState }, id) => {
        if(rootState.provider.selected === providerTypes.desktop) {
            window.electronAPI.deleteTemplate(id);
            return;
        }
        await templateApi.deleteTemplateAsync(id);
        await dispatch(TEMPLATE_FETCH_ALL);
    },


    /**
     * Fetches all templates from the backend
     * 
     * Handles multiple repository states:
     * - Normal operation: Returns templates array
     * - NOT_CONFIGURED: Template repository URL not configured
     * - NOT_INITIALIZED: Repository exists but folder structure not bootstrapped
     * - REPO_NOT_FOUND: Repository doesn't exist (404 - not an error)
     * - FOLDER_NOT_FOUND: Repository exists but template folder missing
     * - READ_ONLY / READ_WRITE: Desktop only - folder access permissions
     * 
     * 
     * @async
     * @param {Object} context - Vuex action context
     * @param {Function} context.commit - Vuex commit function
     * @returns {Promise<void>}
     */
    [TEMPLATE_FETCH_ALL]: async ({ commit, rootState }) => {
        try {
            // Desktop: fire IPC request, result comes via onTemplatesResult listener
            if (getProviderType(rootState.provider.selected) === providerTypes.desktop) {
                window.electronAPI.getTemplates();
                return;
            }

            const response = await templateApi.fetchAllAsync();

            // Handle special statuses (NOT_CONFIGURED, NOT_INITIALIZED)
            if (response.data.status) {
                commit(TEMPLATE_SET_CONTENT_STORE_STATUS, {
                    status: response.data.status,
                    canWrite: response.data.canWrite
                });
                commit(TEMPLATE_SET_TEMPLATES, []);
            } else {
                // Normal operation - templates exist, user has write access
                commit(TEMPLATE_SET_CONTENT_STORE_STATUS, {
                    status: null,
                    canWrite: true
                });
                commit(TEMPLATE_SET_TEMPLATES, response.data.templates);
            }
        } catch (error) {
            // Handle 404 (REPO_NOT_FOUND) - it's a STATE, not an error
            if (error.response?.status === 404) {
                commit(TEMPLATE_SET_CONTENT_STORE_STATUS, {
                    status: 'REPO_NOT_FOUND',
                    canWrite: false
                });
                console.log('Template repository not found');
                commit(TEMPLATE_SET_TEMPLATES, []);
            }
        }
    },

    [TEMPLATE_FETCH_MODEL_BY_ID]: async ({rootState}, templateId) => {
         if (getProviderType(rootState.provider.selected) === providerTypes.desktop) {
                window.electronAPI.fetchModelById(templateId);
                return;
            }
        const response = await templateApi.fetchModelByIdAsync(templateId);
        return response.data;
    },

    [TEMPLATE_CLEAR]: ({ commit }) => {
        commit(TEMPLATE_CLEAR);
    }
};

const mutations = {
    [TEMPLATE_SET_CONTENT_STORE_STATUS]: (state, { status, canWrite }) => {
        state.contentStore = {
            status: status || null,
            canWrite: canWrite || false
        };
    },

    [TEMPLATE_SET_TEMPLATES]: (state, templates) => {
        state.templates = templates || [];
    },
    [TEMPLATE_CLEAR]: (state) => {
        state.templates = [];
        state.contentStore = {
            status: null,
            canWrite: false
        };
    }
};

const getters = {
    templates: (state) => state.templates,
    hasTemplates: (state) => state.templates.length > 0,
    contentStoreStatus: (state) => state.contentStore.status,
    canWriteStore: (state) => state.contentStore.canWrite
};

export default {
    state,
    actions,
    mutations,
    getters
};