import {
    TEMPLATE_FETCH_ALL,
    TEMPLATE_CLEAR,
    TEMPLATE_CREATE,
    TEMPLATE_UPDATE,
    TEMPLATE_DELETE,
    TEMPLATE_FETCH_MODEL_BY_ID,
    TEMPLATE_SET_TEMPLATES,
    TEMPLATE_SET_CONTENT_REPO_STATUS,
    TEMPLATE_BOOTSTRAP
} from '@/store/actions/template';

import templateApi from '@/service/api/templateApi.js';

const state = {
    templates: [],// list of templates
    contentRepo: {
        status: null,        // null (initialized & working) | 'NOT_CONFIGURED' | 'REPO_NOT_FOUND' | 'NOT_INITIALIZED'
        canInitialize: false,// determined by the permissions of the current user in context of the repo
        repoName: null,      // Only populated for 'REPO_NOT_FOUND' scenario
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
     * Handles multiple repository states:
     * - Normal operation: Returns templates array
     * - NOT_CONFIGURED: Template repository URL not configured
     * - NOT_INITIALIZED: Repository exists but folder structure not bootstrapped
     * - REPO_NOT_FOUND: Repository doesn't exist (404 - not an error)
     * 
     * @async
     * @param {Object} context - Vuex action context
     * @param {Function} context.commit - Vuex commit function
     * @returns {Promise<void>}
     */
    [TEMPLATE_FETCH_ALL]: async ({ commit }) => {
        try {
            const response = await templateApi.fetchAllAsync();

            // Handle special statuses (NOT_CONFIGURED, NOT_INITIALIZED)
            if (response.data.repoStatus) {
                commit(TEMPLATE_SET_CONTENT_REPO_STATUS, {
                    status: response.data.repoStatus,
                    canInitialize: response.data.canInitialize,
                    repoName: null
                });
                commit(TEMPLATE_SET_TEMPLATES, []);
            } else {
                // Normal operation
                commit(TEMPLATE_SET_CONTENT_REPO_STATUS, {
                    status: null,
                    canInitialize: false,
                    repoName: null
                });
                commit(TEMPLATE_SET_TEMPLATES, response.data.templates);
            }
        } catch (error) {
            // Handle 404 (REPO_NOT_FOUND) - it's a STATE, not an error
            if (error.response?.status === 404) {
                const errorDetails = error.response.data?.details || '';
                const repoMatch = errorDetails.match(/Template repository '([^']+)'/);

                commit(TEMPLATE_SET_CONTENT_REPO_STATUS, {
                    status: 'REPO_NOT_FOUND',
                    canInitialize: false,
                    repoName: repoMatch ? repoMatch[1] : null
                });
                console.log('Template repository not found:', repoMatch ? repoMatch[1] : 'unknown');
                commit(TEMPLATE_SET_TEMPLATES, []);
            }
        }
    },

    [TEMPLATE_FETCH_MODEL_BY_ID]: async (_, templateId) => {
        const response = await templateApi.fetchModelByIdAsync(templateId);
        return response.data;
    },

    [TEMPLATE_CLEAR]: ({ commit }) => {
        commit(TEMPLATE_CLEAR);
    }
};

const mutations = {
    [TEMPLATE_SET_CONTENT_REPO_STATUS]: (state, { status, canInitialize, repoName }) => {
        state.contentRepo = {
            status: status || null,
            canInitialize: canInitialize || false,
            repoName: repoName || null
        };
    },

    [TEMPLATE_SET_TEMPLATES]: (state, templates) => {
        state.templates = templates || [];
    },
    [TEMPLATE_CLEAR]: (state) => {
        state.templates = [];
        state.contentRepo = {
            status: null,
            canInitialize: false,
            repoName: null
        };
    }
};

const getters = {
    templates: (state) => state.templates,
    hasTemplates: (state) => state.templates.length > 0,
    contentRepoStatus: (state) => state.contentRepo.status,
    canInitializeRepo: (state) => state.contentRepo.canInitialize,
    contentRepoName: (state) => state.contentRepo.repoName
};

export default {
    state,
    actions,
    mutations,
    getters
};