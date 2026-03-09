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
        status: null,   // null (READY) | 'NOT_CONFIGURED' | 'NOT_FOUND' | 'NOT_INITIALIZED'
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
    [TEMPLATE_CREATE]: async ({ dispatch }, { template }) => {
        await templateApi.importTemplateAsync(template);
        await dispatch(TEMPLATE_FETCH_ALL);
    },

    /**
     * Admin action that adds a new template to the repository
     * @param {dispatch}  - calls fetch all after creation
     * @param {Object} templateMetadata - name,description,tags,id of template to update
     * @returns {Promise}
     */
    [TEMPLATE_UPDATE]: async ({ dispatch }, templateMetadata) => {
        await templateApi.updateTemplateAsync(templateMetadata);
        await dispatch(TEMPLATE_FETCH_ALL);
    },

    [TEMPLATE_DELETE]: async ({ dispatch }, id) => {
        await templateApi.deleteTemplateAsync(id);
        await dispatch(TEMPLATE_FETCH_ALL);
    },


    /**
     * Fetches all templates from the backend
     *
     * Handles unified statuses (desktop + web):
     * - null (READY): Normal operation, templates available
     * - NOT_CONFIGURED: Storage location not set up
     * - NOT_FOUND: Storage was configured but no longer exists (404)
     * - NOT_INITIALIZED: Storage exists but no template index
     *
     * canWrite flag indicates write permissions (repo push / folder write access)
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
            // Handle 404 (NOT_FOUND) - it's a STATE, not an error
            if (error.response?.status === 404) {
                commit(TEMPLATE_SET_CONTENT_STORE_STATUS, {
                    status: 'NOT_FOUND',
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