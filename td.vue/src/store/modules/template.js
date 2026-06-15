import { THREATMODEL_SELECTED } from '@/store/actions/threatmodel';
import {
    TEMPLATE_FETCH_ALL,
    TEMPLATE_CLEAR,
    TEMPLATE_CREATE,
    TEMPLATE_UPDATE,
    TEMPLATE_DELETE,
    TEMPLATE_FETCH_MODEL_BY_ID,
    TEMPLATE_SET_TEMPLATES,
    TEMPLATE_SET_CONTENT_REPO_STATUS,
    TEMPLATE_BOOTSTRAP,
    TEMPLATE_DOWNLOAD,
    TEMPLATE_LOAD,
} from '@/store/actions/template';
import templateApi from '@/service/api/templateApi.js';
import save from '@/service/save';
import { v4 } from 'uuid';

const state = {
    templates: [], // list of templates
    contentRepo: {
        status: null, // null (initialized & working) | 'NOT_CONFIGURED' | 'REPO_NOT_FOUND' | 'NOT_INITIALIZED'
        canInitialize: false, // determined by the permissions of the current user in context of the repo
        repoName: null, // Only populated for 'REPO_NOT_FOUND' scenario
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
    },

    [TEMPLATE_DOWNLOAD]: async (modelData, templateMetadata) => {
	    const model = JSON.parse(JSON.stringify(modelData));
	    // fix up template values
	    model.summary.id = '';
	    model.summary.owner = '';
	    model.summary.title = templateMetadata.name || '';
	    model.summary.description = templateMetadata.description || '';

	    if (model.detail.reviewer !== undefined) {
	        model.detail.reviewer = '';
	    }

	    if (model.detail.contributors) {
	        model.detail.contributors = [];
	    }

	    // Create the template structure
	    const templateData = {
	        templateMetadata: {
	            id: v4(), // Don't forget the GUID!
	            name: templateMetadata.name,
	            description: templateMetadata.description,
	            tags: templateMetadata.tags,
	            modelRef: v4()
	        },
	        model: model
	    };
	    const fileName = `${templateMetadata.name}.json`;
	    return await save.template(templateData, fileName);
    },

    /**
	 * Loads a template into the threat model state, regenerating cell and port IDs
	 * 
	 * Creates a new threat model from a template by deep cloning the model data and
	 * regenerating UUIDs for all diagram cells and ports to ensure uniqueness.
	 * Diagram IDs are preserved as they are model-scoped.
	 * 
	 * @async
	 * @param {Object} context - Vuex action context
	 * @param {Function} context.commit - Vuex commit function
	 * @param {Object} templateData - Template model data (threat model JSON structure)
	 * @returns {Promise<void>}
	 */
    [TEMPLATE_LOAD]: async ({ commit }, { templateData }) => {
	    const model = JSON.parse(JSON.stringify(templateData));
	    const idMap = {};
	
	    model.detail.diagrams.forEach(diagram => {
	        // First pass: map all cell and port IDs
	        if (diagram.cells && Array.isArray(diagram.cells)) {
	            diagram.cells.forEach(cell => {
	                idMap[cell.id] = v4();
	
	                if (cell.ports?.items) {
	                    cell.ports.items.forEach(port => {
	                        idMap[port.id] = v4();
	                    });
	                }
	            });
	
	            // Second pass: apply new IDs and update references
	            diagram.cells.forEach(cell => {
	                cell.id = idMap[cell.id];
	
	                if (cell.ports?.items) {
	                    cell.ports.items.forEach(port => {
	                        port.id = idMap[port.id];
	                    });
	                }
	
	                if (cell.source?.cell) {
	                    cell.source.cell = idMap[cell.source.cell];
	                    cell.source.port = idMap[cell.source.port];
	                }
	
	                if (cell.target?.cell) {
	                    cell.target.cell = idMap[cell.target.cell];
	                    cell.target.port = idMap[cell.target.port];
	                }
	            });
	        }
	    });
	    commit(THREATMODEL_SELECTED, model);
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