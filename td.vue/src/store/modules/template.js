import { threatmodelSelected } from '@/store/actions/threatmodel';
import {
    templateFetchAll,
    templateClear,
    templateCreate,
    templateUpdate,
    templateDelete,
    templateFetchModelById,
    templateSetTemplates,
    templateSetContentRepoStatus,
    templateBootstrap,
    templateDownload,
    templateLoad,
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
    [templateBootstrap]: async ({ dispatch }) => {
        await templateApi.bootstrapAsync();
        // After successful bootstrap, refresh template list
        await dispatch(templateFetchAll);
    },

    /**
     * Admin action that adds a new template to the repository
     * @param {dispatch}  - calls fetch all after creation
     * @param {Object} template - The full template object(including metadata and content) from local file
     * @returns {Promise}
     */
    [templateCreate]: async ({ dispatch }, { template }) => {
        await templateApi.importTemplateAsync(template);
        await dispatch(templateFetchAll);
    },

    /**
     * Admin action that adds a new template to the repository
     * @param {dispatch}  - calls fetch all after creation
     * @param {Object} templateMetadata - name,description,tags,id of template to update
     * @returns {Promise}
     */
    [templateUpdate]: async ({ dispatch }, templateMetadata) => {
        await templateApi.updateTemplateAsync(templateMetadata);
        await dispatch(templateFetchAll);
    },

    [templateDelete]: async ({ dispatch }, id) => {
        await templateApi.deleteTemplateAsync(id);
        await dispatch(templateFetchAll);
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
    [templateFetchAll]: async ({ commit }) => {
        try {
            const response = await templateApi.fetchAllAsync();

            // Handle special statuses (NOT_CONFIGURED, NOT_INITIALIZED)
            if (response.data.repoStatus) {
                commit(templateSetContentRepoStatus, {
                    status: response.data.repoStatus,
                    canInitialize: response.data.canInitialize,
                    repoName: null
                });
                commit(templateSetTemplates, []);
            } else {
                // Normal operation
                commit(templateSetContentRepoStatus, {
                    status: null,
                    canInitialize: false,
                    repoName: null
                });
                commit(templateSetTemplates, response.data.templates);
            }
        } catch (error) {
            // Handle 404 (REPO_NOT_FOUND) - it's a STATE, not an error
            if (error.response?.status === 404) {
                const errorDetails = error.response.data?.details || '';
                const repoMatch = errorDetails.match(/Template repository '([^']+)'/);

                commit(templateSetContentRepoStatus, {
                    status: 'REPO_NOT_FOUND',
                    canInitialize: false,
                    repoName: repoMatch ? repoMatch[1] : null
                });
                console.log('Template repository not found:', repoMatch ? repoMatch[1] : 'unknown');
                commit(templateSetTemplates, []);
            }
        }
    },

    [templateFetchModelById]: async (_, templateId) => {
        const response = await templateApi.fetchModelByIdAsync(templateId);
        return response.data;
    },

    [templateClear]: ({ commit }) => {
        commit(templateClear);
    },

    [templateDownload]: async (modelData, templateMetadata) => {
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
    [templateLoad]: async ({ commit }, { templateData }) => {
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
	    commit(threatmodelSelected, model);
    }
};

const mutations = {
    [templateSetContentRepoStatus]: (state, { status, canInitialize, repoName }) => {
        state.contentRepo = {
            status: status || null,
            canInitialize: canInitialize || false,
            repoName: repoName || null
        };
    },

    [templateSetTemplates]: (state, templates) => {
        state.templates = templates || [];
    },
    [templateClear]: (state) => {
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
