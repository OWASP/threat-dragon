import Vue from 'vue';

import demo from '@/service/demo/index.js';
import isElectron from 'is-electron';
import { getProviderType } from '@/service/provider/providers';
import { providerTypes } from '@/service/provider/providerTypes';
import {
    THREATMODEL_CLEAR,
    THREATMODEL_CONTRIBUTORS_UPDATED,
    THREATMODEL_CREATE,
    THREATMODEL_DIAGRAM_APPLIED,
    THREATMODEL_DIAGRAM_CLOSED,
    THREATMODEL_DIAGRAM_MODIFIED,
    THREATMODEL_DIAGRAM_SAVED,
    THREATMODEL_DIAGRAM_SELECTED,
    THREATMODEL_FETCH,
    THREATMODEL_FETCH_ALL,
    THREATMODEL_MODIFIED,
    THREATMODEL_NOT_MODIFIED,
    THREATMODEL_RESTORE,
    THREATMODEL_SAVE,
    THREATMODEL_SELECTED,
    THREATMODEL_STASH,
    THREATMODEL_UPDATE,
    THREATMODEL_TEMPLATE_DOWNLOAD,
    THREATMODEL_TEMPLATE_LOAD,
    THREATMODEL_LOAD_DEMOS
} from '@/store/actions/threatmodel';
import save from '@/service/save';
import threatmodelApi from '@/service/api/threatmodelApi';
import googleDriveApi from '@/service/api/googleDriveApi';
import { FOLDER_SELECTED } from '../actions/folder';
import { v4 } from 'uuid';

const state = {
    all: [],
    data: {},
    fileName: '',
    stash: '',
    modified: false,
    modifiedDiagram: {},
    selectedDiagram: {}
};

const stashThreatModel = (theState, threatModel) => {
    console.debug('Stash threat model');
    theState.data = threatModel;
    theState.stash = JSON.stringify(threatModel);
};

const actions = {
    [THREATMODEL_CLEAR]: ({ commit }) => commit(THREATMODEL_CLEAR),
    [THREATMODEL_CONTRIBUTORS_UPDATED]: ({ commit }, contributors) => commit(THREATMODEL_CONTRIBUTORS_UPDATED, contributors),
    [THREATMODEL_CREATE]: async ({ dispatch, commit, rootState, state }) => {
        console.debug('Create threat model action');
        if (getProviderType(rootState.provider.selected) === providerTypes.desktop) {
            // desktop responds later with its own STASH and NOT_MODIFIED
            window.electronAPI.modelSave(state.data, state.fileName);
            return true;
        } else {
            let result = false;
            if (getProviderType(rootState.provider.selected) === providerTypes.local) {
                // save locally for web app when local login
                result = await save.local(state);
            } else if (getProviderType(rootState.provider.selected) === providerTypes.google) {
                const folder = await save.googleCreate(rootState, state);
                if (folder) {
                    dispatch(FOLDER_SELECTED, folder.data);
                    result = true;
                }
            } else {
                result = await save.repoCreate(rootState, state);
            }
            if (result) {
                dispatch(THREATMODEL_STASH);
                commit(THREATMODEL_NOT_MODIFIED);
            }
            return result;
        }
    },
    [THREATMODEL_DIAGRAM_APPLIED]: ({ commit }) => commit(THREATMODEL_DIAGRAM_APPLIED),
    [THREATMODEL_DIAGRAM_CLOSED]: ({ commit }) => commit(THREATMODEL_DIAGRAM_CLOSED),
    [THREATMODEL_DIAGRAM_MODIFIED]: ({ commit }, diagram) => commit(THREATMODEL_DIAGRAM_MODIFIED, diagram),
    [THREATMODEL_DIAGRAM_SAVED]: ({ commit }, diagram) => commit(THREATMODEL_DIAGRAM_SAVED, diagram),
    [THREATMODEL_DIAGRAM_SELECTED]: ({ commit }, diagram) => commit(THREATMODEL_DIAGRAM_SELECTED, diagram),
    [THREATMODEL_FETCH]: async ({ commit, dispatch, rootState }, threatModel) => {
        dispatch(THREATMODEL_CLEAR);
        let resp;
        if (getProviderType(rootState.provider.selected) === providerTypes.google) {
            resp = await googleDriveApi.modelAsync(
                threatModel
            );
        } else {
            resp = await threatmodelApi.modelAsync(
                rootState.repo.selected,
                rootState.branch.selected,
                threatModel
            );
        }
        commit(THREATMODEL_FETCH, resp.data);
    },
    [THREATMODEL_FETCH_ALL]: async ({ commit, rootState }) => {
        if (getProviderType(rootState.provider.selected) === providerTypes.local || getProviderType(rootState.provider.selected) === providerTypes.desktop || getProviderType(rootState.provider.selected) === providerTypes.google) {
            commit(THREATMODEL_FETCH_ALL, demo.models);
        } else {
            const resp = await threatmodelApi.modelsAsync(
                rootState.repo.selected,
                rootState.branch.selected
            );
            commit(THREATMODEL_FETCH_ALL, resp.data);
        }
    },
    [THREATMODEL_LOAD_DEMOS]: ({ commit }) => {
        commit(THREATMODEL_FETCH_ALL, demo.models);
    },
    [THREATMODEL_MODIFIED]: ({ commit }) => commit(THREATMODEL_MODIFIED),
    [THREATMODEL_RESTORE]: async ({ commit, state, rootState }) => {
        let originalModel = JSON.parse(state.stash);
        console.debug('Restore threat model action');
        if (getProviderType(rootState.provider.selected) !== providerTypes.local && getProviderType(rootState.provider.selected) !== providerTypes.desktop && getProviderType(rootState.provider.selected) !== providerTypes.google) {
            const originalTitle = (JSON.parse(state.stash)).summary.title;
            const resp = await threatmodelApi.modelAsync(
                rootState.repo.selected,
                rootState.branch.selected,
                originalTitle
            );
            originalModel = resp.data;
        }
        commit(THREATMODEL_RESTORE, originalModel);
    },
    [THREATMODEL_SAVE]: async ({ dispatch, commit, rootState, state }) => {
        console.debug('Save threat model action');
        if (getProviderType(rootState.provider.selected) === providerTypes.desktop) {
            // desktop responds later with its own STASH and NOT_MODIFIED
            if (Object.keys(state.selectedDiagram).length !== 0) {
                commit(THREATMODEL_DIAGRAM_SAVED, state.selectedDiagram);
            }

            window.electronAPI.modelSave(state.data, state.fileName);
        } else {
            let result = false;
            if (getProviderType(rootState.provider.selected) === providerTypes.local) {
                result = await save.local(state);
            } else if (getProviderType(rootState.provider.selected) === providerTypes.google) {
                result = await save.google(rootState, state);
            } else {
                result = await save.repo(rootState, state);
            }
            if (result) {
                dispatch(THREATMODEL_STASH);
                commit(THREATMODEL_NOT_MODIFIED);
            }
        }
    },
    [THREATMODEL_SELECTED]: ({ commit }, threatModel) => commit(THREATMODEL_SELECTED, threatModel),
    [THREATMODEL_STASH]: ({ commit }) => commit(THREATMODEL_STASH),
    [THREATMODEL_NOT_MODIFIED]: ({ commit }) => commit(THREATMODEL_NOT_MODIFIED),
    [THREATMODEL_UPDATE]: ({ commit }, update) => commit(THREATMODEL_UPDATE, update),
    [THREATMODEL_TEMPLATE_DOWNLOAD]: async ({ state }, templateMetadata) => {
        console.debug('Download template action');

        const model = JSON.parse(JSON.stringify(state.data));

        // Blank out instance-specific fields
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

        // Calculate filename once
        const fileName = `${templateMetadata.name}.json`;

        // CALL THE NEW FUNCTION
        // Pass data and filename explicitly. No confusing 'state' wrapper needed.
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
    [THREATMODEL_TEMPLATE_LOAD]: async ({ commit }, { templateData }) => {
        console.debug('Load template action');

        // Convert template → model
        const model = JSON.parse(JSON.stringify(templateData)); // deep clone

        // Regenerate all cell and port IDs (diagram IDs stay as-is)
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
    [THREATMODEL_CLEAR]: (state) => clearState(state),
    [THREATMODEL_CONTRIBUTORS_UPDATED]: (state, contributors) => {
        state.data.detail.contributors.length = 0;
        contributors.forEach((name, idx) => Vue.set(state.data.detail.contributors, idx, { name }));
    },
    [THREATMODEL_DIAGRAM_APPLIED]: (state) => {
        if (Object.keys(state.modifiedDiagram).length !== 0) {
            const idx = state.data.detail.diagrams.findIndex(x => x.id === state.modifiedDiagram.id);
            console.debug('Threatmodel modified diagram applied : ' + state.modifiedDiagram.id + ' at index: ' + idx);
            state.data.detail.diagrams[idx] = state.modifiedDiagram;
        }
    },
    [THREATMODEL_DIAGRAM_CLOSED]: (state) => {
        state.modified = false;
        state.modifiedDiagram = {};
        console.debug('Threatmodel diagram closed to edits');
    },
    [THREATMODEL_DIAGRAM_MODIFIED]: (state, diagram) => {
        if (diagram && Object.keys(state.modifiedDiagram).length !== 0) {
            // const idx = state.data.detail.diagrams.findIndex(x => x.id === diagram.id);
            // console.debug('Threatmodel diagram modified: ' + diagram.id + ' at index: ' + idx);
            state.modifiedDiagram = diagram;
            if (state.modified === false) {
                console.debug('model (diagram) now modified');
                state.modified = true;
            }
        }
    },
    [THREATMODEL_DIAGRAM_SAVED]: (state, diagram) => {
        const idx = state.data.detail.diagrams.findIndex(x => x.id === diagram.id);
        console.debug('Threatmodel diagram saved: ' + diagram.id + ' at index: ' + idx);
        // beware: this will trigger a redraw of the diagram, ?possibly to the wrong canvas size?
        Vue.set(state, 'selectedDiagram', diagram);
        // beware ^^
        Vue.set(state.data.detail.diagrams, idx, diagram);
        Vue.set(state.data, 'version', diagram.version);
        stashThreatModel(state, state.data);
    },
    [THREATMODEL_DIAGRAM_SELECTED]: (state, diagram) => {
        Vue.set(state, 'selectedDiagram', diagram);
        state.modifiedDiagram = diagram;
        const idx = state.data.detail.diagrams.findIndex(x => x.id === diagram.id);
        console.debug('Threatmodel diagram selected for edits: ' + diagram.id + ' at index: ' + idx);
    },
    [THREATMODEL_FETCH]: (state, threatModel) => stashThreatModel(state, threatModel),
    [THREATMODEL_FETCH_ALL]: (state, models) => {
        state.all.length = 0;
        models.forEach((model, idx) => Vue.set(state.all, idx, model));
    },
    [THREATMODEL_MODIFIED]: (state) => {
        state.modified = true;
    },
    [THREATMODEL_RESTORE]: (state, originalThreatModel) => {
        console.debug('Threatmodel restored');
        stashThreatModel(state, originalThreatModel);
    },
    [THREATMODEL_SELECTED]: (state, threatModel) => {
        console.debug('Threatmodel selected');
        stashThreatModel(state, threatModel);
    },
    [THREATMODEL_STASH]: (state) => {
        Vue.set(state, 'stash', JSON.stringify(state.data));
    },
    [THREATMODEL_NOT_MODIFIED]: (state) => {
        state.modified = false;
    },
    [THREATMODEL_UPDATE]: (state, update) => {
        if (update.version) {
            Vue.set(state.data, 'version', update.version);
        }
        if (update.diagramTop) {
            Vue.set(state.data.detail, 'diagramTop', update.diagramTop);
        }
        if (update.threatTop) {
            Vue.set(state.data.detail, 'threatTop', update.threatTop);
        }
        if (update.fileName) {
            Vue.set(state, 'fileName', update.fileName);
        }
        console.debug('Threatmodel update: ' + JSON.stringify(update));
    }
};

const getters = {
    contributors: (state) => {
        let contribs = [];
        if (state.data && state.data.detail && state.data.detail.contributors) {
            contribs = state.data.detail.contributors;
        }
        return contribs.map(x => x.name);
    },
    modelChanged: (state) => {
        console.debug('model modified: ' + state.modified);
        return state.modified;
    },
    isV1Model: (state) => Object.keys(state.data).length > 0 && (state.data.version == null || state.data.version.startsWith('1.'))
};

export const clearState = (state) => {
    console.debug('Threatmodel cleared');
    state.all.length = 0;
    state.data = {};
    state.stash = '';
    state.modified = false;
    state.modifiedDiagram = {};
    state.selectedDiagram = {};
    if (isElectron()) {
        // advise electron server that the model has closed
        window.electronAPI.modelClosed(state.fileName);
    }
    state.fileName = '';
};

export default {
    state,
    actions,
    mutations,
    getters
};
