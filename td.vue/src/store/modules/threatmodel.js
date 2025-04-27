import demo from '@/service/demo/index.js';
import isElectron from 'is-electron';
import { getProviderType } from '@/service/provider/providers';
import { tc } from '@/i18n/index.js';
import { providerTypes } from '@/service/provider/providerTypes';
import logger from '@/utils/logger.js';

// Create a context-specific logger
const log = logger.getLogger('store:threatmodel');
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
    THREATMODEL_UPDATE
} from '@/store/actions/threatmodel.js';
import save from '@/service/save.js';
import threatmodelApi from '@/service/api/threatmodelApi.js';
import googleDriveApi from '../../service/api/googleDriveApi';
// import { FOLDER_SELECTED } from '../actions/folder';

const state = {
    all: [],
    data: {},
    fileName: '',
    fileId: '', // Add fileId to track the Google Drive file ID
    stash: '',
    modified: false,
    modifiedDiagram: {},
    selectedDiagram: {}
};

// Initialize a safe toast service
const toast = {
    success: (message, options) => {
        if (typeof window !== 'undefined' && window.$toast) {
            window.$toast.success(message, options);
        } else {
            log.info('Success', { message });
        }
    },
    error: (message, options) => {
        if (typeof window !== 'undefined' && window.$toast) {
            window.$toast.error(message, options);
        } else {
            log.error('Error', { message });
        }
    },
    warning: (message, options) => {
        if (typeof window !== 'undefined' && window.$toast) {
            window.$toast.warning(message, options);
        } else {
            log.warn('Warning', { message });
        }
    },
    info: (message, options) => {
        if (typeof window !== 'undefined' && window.$toast) {
            window.$toast.info(message, options);
        } else {
            log.info('Info', { message });
        }
    }
};

// Helper function for safe translations
const t = (key) => {
    try {
        return tc(key) || key;
    } catch (err) {
        log.warn('Translation error for key', { key, error: err });
        return key;
    }
};

// Helper to deep clone a threat model without using JSON stringify/parse
// This maintains the structure of diagrams better than JSON serialization
const deepClone = (threatModel) => {
    if (!threatModel) return threatModel;

    // Create a new object with the same properties
    const clone = { ...threatModel };

    // Deep clone the nested objects
    if (clone.summary) clone.summary = { ...clone.summary };

    if (clone.detail) {
        clone.detail = { ...clone.detail };

        // Special handling for diagrams
        if (Array.isArray(clone.detail.diagrams)) {
            clone.detail.diagrams = clone.detail.diagrams.map((diagram) => {
                const diagramClone = { ...diagram };
                // Ensure cells is always an array even if it's missing or null
                diagramClone.cells = Array.isArray(diagram.cells) ? [...diagram.cells] : [];
                return diagramClone;
            });
        }

        // Make sure contributors is an array
        if (Array.isArray(clone.detail.contributors)) {
            clone.detail.contributors = clone.detail.contributors.map((c) => ({ ...c }));
        }
    }

    return clone;
};

const stashThreatModel = (theState, threatModel) => {
    log.debug('Stash threat model');
    // Create a deep clone of the threat model
    theState.data = deepClone(threatModel);
    // Still use JSON for the stash to maintain backward compatibility
    theState.stash = JSON.stringify(threatModel);
};

const actions = {
    [THREATMODEL_CLEAR]: ({ commit }) => commit(THREATMODEL_CLEAR),
    [THREATMODEL_CONTRIBUTORS_UPDATED]: ({ commit }, contributors) =>
        commit(THREATMODEL_CONTRIBUTORS_UPDATED, contributors),
    [THREATMODEL_CREATE]: async ({ dispatch, commit, rootState, state }) => {
        try {
            if (getProviderType(rootState.provider.selected) === providerTypes.local) {
                // save locally for web app when local login
                try {
                    // Wait for the save operation to complete before proceeding
                    await save.local(state.data, `${state.data.summary.title}.json`);
                } catch (err) {
                    log.error('Error saving file locally', { error: err });
                    toast.error(t('threatmodel.errors.save'));
                    return; // Exit early if save fails
                }
            } else if (getProviderType(rootState.provider.selected) === providerTypes.desktop) {
                // desktop version always saves locally
                log.debug('Desktop create action');
                await window.electronAPI.modelSave(state.data, state.fileName);
            } else if (getProviderType(rootState.provider.selected) === providerTypes.google) {
                log.debug('Google Drive create action', { folder: rootState.folder.selected });
                try {
                    const fileName = `${state.data.summary.title}.json`;
                    log.debug('Creating file', { fileName });

                    const res = await googleDriveApi.createAsync(
                        rootState.folder.selected,
                        state.data,
                        fileName
                    );

                    log.debug('File created successfully', { result: res.data });

                    if (res.data && res.data.id) {
                        // Save the file ID in the state for future saves
                        commit(THREATMODEL_UPDATE, {
                            fileName: fileName,
                            fileId: res.data.id
                        });
                        log.debug('Updated state with fileId', { fileId: res.data.id });
                    }

                    toast.success(t('threatmodel.saved') + ' : ' + fileName);
                } catch (err) {
                    log.error('Error creating file in Google Drive', { error: err });
                    toast.error(t('threatmodel.errors.googleDriveSave'));
                    throw err;
                }
            } else {
                await threatmodelApi.createAsync(
                    rootState.repo.selected,
                    rootState.branch.selected,
                    state.data.summary.title,
                    state.data
                );
                toast.success(t('threatmodel.saved') + ' : ' + state.fileName);
            }
            dispatch(THREATMODEL_STASH);
            commit(THREATMODEL_NOT_MODIFIED);
        } catch (ex) {
            log.error('Failed to save new threat model', { error: ex });
            toast.error(t('threatmodel.errors.save'));
        }
    },
    [THREATMODEL_DIAGRAM_APPLIED]: ({ commit }) => commit(THREATMODEL_DIAGRAM_APPLIED),
    [THREATMODEL_DIAGRAM_CLOSED]: ({ commit }) => commit(THREATMODEL_DIAGRAM_CLOSED),
    [THREATMODEL_DIAGRAM_MODIFIED]: ({ commit }, diagram) =>
        commit(THREATMODEL_DIAGRAM_MODIFIED, diagram),
    [THREATMODEL_DIAGRAM_SAVED]: ({ commit }, diagram) =>
        commit(THREATMODEL_DIAGRAM_SAVED, diagram),
    [THREATMODEL_DIAGRAM_SELECTED]: ({ commit }, diagram) =>
        commit(THREATMODEL_DIAGRAM_SELECTED, diagram),
    [THREATMODEL_FETCH]: async ({ commit, dispatch, rootState }, threatModel) => {
        dispatch(THREATMODEL_CLEAR);
        let resp;
        try {
            if (getProviderType(rootState.provider.selected) === providerTypes.google) {
                log.debug('Fetching Google Drive model', { id: threatModel });
                resp = await googleDriveApi.modelAsync(threatModel);
                // Store the fileId for future updates
                commit(THREATMODEL_UPDATE, { fileId: threatModel });
            } else {
                resp = await threatmodelApi.modelAsync(
                    rootState.repo.selected,
                    rootState.branch.selected,
                    threatModel
                );
            }
            commit(THREATMODEL_FETCH, resp.data);
        } catch (error) {
            log.error('Error fetching threat model', { error, threatModel });
            
            // Check if this is our custom error for invalid threat model format
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                
                switch (errorData.code) {
                case 'INVALID_THREAT_MODEL_FORMAT':
                    toast.error(t('threatmodel.errors.invalidFormat'));
                    break;
                case 'INVALID_JSON_FORMAT':
                    toast.error(t('threatmodel.errors.invalidJson'));
                    break;
                case 'FILE_NOT_FOUND':
                    toast.error(t('threatmodel.errors.fileNotFound'));
                    break;
                case 'UNEXPECTED_RESPONSE_FORMAT':
                    toast.error(t('threatmodel.errors.unexpectedFormat'));
                    break;
                default:
                    toast.error(t('threatmodel.errors.fetch'));
                    break;
                }
            } else {
                toast.error(t('threatmodel.errors.fetch'));
            }
            
            // Rethrow the error to be handled by the component
            throw error;
        }
    },
    [THREATMODEL_FETCH_ALL]: async ({ commit, rootState }) => {
        if (
            getProviderType(rootState.provider.selected) === providerTypes.local ||
            getProviderType(rootState.provider.selected) === providerTypes.desktop ||
            getProviderType(rootState.provider.selected) === providerTypes.google
        ) {
            commit(THREATMODEL_FETCH_ALL, demo.models);
        } else {
            const resp = await threatmodelApi.modelsAsync(
                rootState.repo.selected,
                rootState.branch.selected
            );
            commit(THREATMODEL_FETCH_ALL, resp.data);
        }
    },
    [THREATMODEL_MODIFIED]: ({ commit }) => commit(THREATMODEL_MODIFIED),
    [THREATMODEL_RESTORE]: async ({ commit, state, rootState }) => {
        log.debug('Restore threat model action');
        let originalModel;

        try {
            // Parse the stash but ensure we properly recreate the structure
            const parsedModel = JSON.parse(state.stash);
            originalModel = deepClone(parsedModel);

            if (
                getProviderType(rootState.provider.selected) !== providerTypes.local &&
                getProviderType(rootState.provider.selected) !== providerTypes.desktop &&
                getProviderType(rootState.provider.selected) !== providerTypes.google
            ) {
                const originalTitle = parsedModel.summary.title;
                const resp = await threatmodelApi.modelAsync(
                    rootState.repo.selected,
                    rootState.branch.selected,
                    originalTitle
                );
                originalModel = deepClone(resp.data);
            }
        } catch (err) {
            log.error('Error restoring threat model', { error: err });
            originalModel = deepClone(state.data); // Use current data as fallback
        }

        commit(THREATMODEL_RESTORE, originalModel);
    },
    [THREATMODEL_SAVE]: async ({ dispatch, commit, rootState, state }) => {
        log.debug('Save threat model action');
        // Identify if threat model is in OTM format
        if (Object.hasOwn(state.data, 'otmVersion')) {
            //  convert dragon to OTM format not yet available
            toast.warning('Saving in Open Threat Model format not yet supported');
            // continue to saving in dragon format
        }
        try {
            if (getProviderType(rootState.provider.selected) === providerTypes.local) {
                // save locally for web app when local login
                try {
                    // Wait for the save operation to complete before showing success toast
                    await save.local(state.data, `${state.data.summary.title}.json`);
                } catch (err) {
                    log.error('Error saving file locally', { error: err });
                    toast.error(t('threatmodel.errors.save'));
                    return; // Exit early if save fails
                }
            } else if (getProviderType(rootState.provider.selected) === providerTypes.desktop) {
                // desktop version always saves locally
                log.debug('Desktop save action');

                try {
                    // Use our deep clone function instead of JSON stringify/parse
                    // This preserves the structure better for diagram editing
                    const cleanData = deepClone(state.data);

                    // For the actual save to file, we need to convert to JSON string
                    const jsonData = JSON.stringify(cleanData, null, 2);

                    // Set a filename if we don't have one
                    const fileName =
                        state.fileName || `${state.data.summary.title || 'threat-model'}.json`;

                    // For saving to disk, we'll use the JSON string directly
                    const result = await window.electronAPI.saveFile(jsonData, fileName);
                    log.debug('Save completed successfully', { result });

                    // Update the state after successful save
                    if (result && state.fileName !== result) {
                        commit(THREATMODEL_UPDATE, { fileName: result });
                    } else if (state.fileName !== fileName) {
                        commit(THREATMODEL_UPDATE, { fileName });
                    }
                } catch (saveError) {
                    log.error('Error in desktop save', { error: saveError });
                    throw saveError;
                }
            } else if (getProviderType(rootState.provider.selected) === providerTypes.google) {
                // For Google Drive we need to use the fileId from the state rather than folder.selected
                log.debug('Google Drive save', {
                    fileId: state.fileId,
                    provider: rootState.provider.selected
                });

                if (!state.fileId) {
                    log.error('No file ID found in state for Google Drive save');
                    toast.error(t('threatmodel.errors.googleDriveSave'));
                    throw new Error('No file ID found for Google Drive save');
                }

                try {
                    log.debug('Attempting to update file', { fileId: state.fileId });
                    await googleDriveApi.updateAsync(state.fileId, state.data);
                    log.debug('Google Drive update successful');
                } catch (err) {
                    log.error('Error during Google Drive update', { error: err });
                    toast.error(t('threatmodel.errors.googleDriveSave'));
                    throw err;
                }
            } else {
                await threatmodelApi.updateAsync(
                    rootState.repo.selected,
                    rootState.branch.selected,
                    state.data.summary.title,
                    state.data
                );
            }
            dispatch(THREATMODEL_STASH);
            commit(THREATMODEL_NOT_MODIFIED);
            toast.success(t('threatmodel.saved') + ' : ' + state.fileName, { timeout: 1000 });
        } catch (ex) {
            log.error('Failed to save threat model', { error: ex });
            toast.error(t('threatmodel.errors.save'));
        }
    },
    [THREATMODEL_SELECTED]: ({ commit }, threatModel) => commit(THREATMODEL_SELECTED, threatModel),
    [THREATMODEL_STASH]: ({ commit }) => commit(THREATMODEL_STASH),
    [THREATMODEL_NOT_MODIFIED]: ({ commit }) => commit(THREATMODEL_NOT_MODIFIED),
    [THREATMODEL_UPDATE]: ({ commit }, update) => commit(THREATMODEL_UPDATE, update)
};

const mutations = {
    [THREATMODEL_CLEAR]: (state) => clearState(state),
    [THREATMODEL_CONTRIBUTORS_UPDATED]: (state, contributors) => {
        state.data.detail.contributors.length = 0;
        // Replace Vue.set with direct array assignment for Vue 3 reactivity
        state.data.detail.contributors = contributors.map((name) => ({ name }));
    },
    [THREATMODEL_DIAGRAM_APPLIED]: (state) => {
        if (Object.keys(state.modifiedDiagram).length !== 0) {
            const idx = state.data.detail.diagrams.findIndex(
                (x) => x.id === state.modifiedDiagram.id
            );
            log.debug('Threatmodel modified diagram applied', {
                id: state.modifiedDiagram.id,
                index: idx
            });
            state.data.detail.diagrams[idx] = state.modifiedDiagram;
        }
    },
    [THREATMODEL_DIAGRAM_CLOSED]: (state) => {
        state.modified = false;
        state.modifiedDiagram = {};
        log.debug('Threatmodel diagram closed to edits');
    },
    [THREATMODEL_DIAGRAM_MODIFIED]: (state, diagram) => {
        if (diagram && Object.keys(state.modifiedDiagram).length !== 0) {
            // const idx = state.data.detail.diagrams.findIndex(x => x.id === diagram.id);
            // log.debug('Threatmodel diagram modified: ' + diagram.id + ' at index: ' + idx);
            state.modifiedDiagram = diagram;
            if (state.modified === false) {
                log.debug('model (diagram) now modified');
                state.modified = true;
            }
        }
    },
    [THREATMODEL_DIAGRAM_SAVED]: (state, diagram) => {
        const idx = state.data.detail.diagrams.findIndex((x) => x.id === diagram.id);
        log.debug('Threatmodel diagram saved', { id: diagram.id, index: idx });
        // beware: this will trigger a redraw of the diagram, ?possibly to the wrong canvas size?
        state.selectedDiagram = diagram;
        // beware ^^
        state.data.detail.diagrams[idx] = diagram;
        state.data.version = diagram.version;
        stashThreatModel(state, state.data);
    },
    [THREATMODEL_DIAGRAM_SELECTED]: (state, diagram) => {
        if (!state.data) state.data = {};
        if (!state.data.detail) state.data.detail = {};
        if (!Array.isArray(state.data.detail.diagrams)) state.data.detail.diagrams = [];

        // Make sure cells exists and is an array
        const diagramClone = deepClone(diagram);
        if (!Array.isArray(diagramClone.cells)) {
            diagramClone.cells = [];
        }

        state.selectedDiagram = diagramClone;
        state.modifiedDiagram = diagramClone;

        const idx = state.data.detail.diagrams.findIndex((x) => x.id === diagram.id);
        log.debug('Threatmodel diagram selected for edits', { id: diagram.id, index: idx });
    },

    [THREATMODEL_FETCH]: (state, threatModel) => stashThreatModel(state, threatModel),
    [THREATMODEL_FETCH_ALL]: (state, models) => {
        if (!state.all || !Array.isArray(state.all)) {
            state.all = [];
        }
        state.all.length = 0;
        models.forEach((model, idx) => {
            state.all[idx] = { ...model };
        });
    },
    [THREATMODEL_MODIFIED]: (state) => {
        state.modified = true;
    },
    [THREATMODEL_RESTORE]: (state, originalThreatModel) => {
        log.debug('Threatmodel restored');
        stashThreatModel(state, originalThreatModel);
    },
    [THREATMODEL_SELECTED]: (state, threatModel) => {
        log.debug('Threatmodel selected');
        stashThreatModel(state, threatModel);
    },
    [THREATMODEL_STASH]: (state) => {
        state.stash = JSON.stringify(state.data);
    },
    [THREATMODEL_NOT_MODIFIED]: (state) => {
        state.modified = false;
    },
    [THREATMODEL_UPDATE]: (state, update) => {
        if (!state.data) state.data = {};
        if (!state.data.detail) state.data.detail = {}; // Ensure `detail` exists

        if (update.version) {
            state.data.version = update.version; // Direct assignment
        }
        if (update.diagramTop) {
            state.data.detail.diagramTop = update.diagramTop;
        }
        if (update.threatTop) {
            state.data.detail.threatTop = update.threatTop;
        }
        if (update.fileName) {
            state.fileName = update.fileName;
        }
        if (update.fileId) {
            state.fileId = update.fileId;
        }
        log.debug('Threatmodel update', { update });
    }
};

const getters = {
    contributors: (state) => {
        let contribs = [];
        if (state.data && state.data.detail && state.data.detail.contributors) {
            contribs = state.data.detail.contributors;
        }
        return contribs.map((x) => x.name);
    },
    modelChanged: (state) => {
        log.debug('model modified', { modified: state.modified });
        return state.modified;
    },
    isV1Model: (state) =>
        Object.keys(state.data).length > 0 &&
        (state.data.version == null || state.data.version.startsWith('1.'))
};

export const clearState = (state) => {
    log.debug('Threatmodel cleared');
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
    state.fileId = ''; // Clear the file ID when clearing the state
};

export default {
    state,
    actions,
    mutations,
    getters
};
