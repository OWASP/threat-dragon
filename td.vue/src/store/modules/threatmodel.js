import demo from '@/service/demo/index.js';
import { getProviderType } from '@/service/provider/providers';
import { providerTypes } from '@/service/provider/providerTypes';
import { FOLDER_SELECTED } from '@/store/actions/folder';
import {
    THREATMODEL_CLEAR,
    THREATMODEL_CONTRIBUTORS_UPDATED,
    THREATMODEL_CREATE,
    THREATMODEL_DIAGRAM_CLOSED,
    THREATMODEL_DIAGRAM_MODIFIED,
    THREATMODEL_DIAGRAM_SAVED,
    THREATMODEL_DIAGRAM_SELECTED,
    THREATMODEL_FETCH,
    THREATMODEL_FETCH_ALL,
    THREATMODEL_LOAD_DEMOS,
    THREATMODEL_MODIFIED,
    THREATMODEL_NOT_MODIFIED,
    THREATMODEL_RESTORE,
    THREATMODEL_SAVE,
    THREATMODEL_SELECTED,
    THREATMODEL_STASH,
    THREATMODEL_UPDATE
} from '@/store/actions/threatmodel';
import save from '@/service/save';
import googleDriveApi from '@/service/api/googleDriveApi';
import threatmodelApi from '@/service/api/threatmodelApi';
import tmbom from '@/service/migration/tmBom/tmBom';

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
    theState.data = threatModel;
    theState.stash = JSON.stringify(threatModel);
};

const actions = {
    [THREATMODEL_CLEAR]: ({ rootState, commit }) => {
        if (getProviderType(rootState.provider.selected) === providerTypes.desktop) {
            // advise electron server that the model has closed this file
            window.electronAPI.modelClosed(state.fileName);
        }
        commit(THREATMODEL_CLEAR);
    },
    [THREATMODEL_CONTRIBUTORS_UPDATED]: ({ commit }, contributors) => commit(THREATMODEL_CONTRIBUTORS_UPDATED, contributors),
    [THREATMODEL_CREATE]: async ({ dispatch, commit, rootState, state }) => {
        let result = false;
        if (getProviderType(rootState.provider.selected) === providerTypes.desktop) {
            // desktop responds later with its own STASH and NOT_MODIFIED
            result = save.desktop(state.data, state.fileName);
        } else {
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
        }
        return result;
    },
    [THREATMODEL_DIAGRAM_CLOSED]: ({ commit }) => commit(THREATMODEL_DIAGRAM_CLOSED),
    [THREATMODEL_DIAGRAM_MODIFIED]: ({ commit }, diagram) => commit(THREATMODEL_DIAGRAM_MODIFIED, diagram),
    [THREATMODEL_DIAGRAM_SAVED]: ({ commit }, diagram) => commit(THREATMODEL_DIAGRAM_SAVED, diagram),
    [THREATMODEL_DIAGRAM_SELECTED]: ({ commit }, diagram) => commit(THREATMODEL_DIAGRAM_SELECTED, diagram),
    [THREATMODEL_FETCH]: async ({ commit, dispatch, rootState }, threatModel) => {
        dispatch(THREATMODEL_CLEAR);
        let resp;
        if (getProviderType(rootState.provider.selected) === providerTypes.google) {
            resp = await googleDriveApi.modelAsync(threatModel);
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
        const resp = await threatmodelApi.modelsAsync(
            rootState.repo.selected,
            rootState.branch.selected
        );
        commit(THREATMODEL_FETCH_ALL, resp.data);
    },
    [THREATMODEL_LOAD_DEMOS]: ({ commit }) => {
        commit(THREATMODEL_FETCH_ALL, demo.models);
    },
    [THREATMODEL_MODIFIED]: ({ commit }) => commit(THREATMODEL_MODIFIED),
    [THREATMODEL_RESTORE]: async ({ commit, state, rootState }) => {
        let originalModel = JSON.parse(state.stash);
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
        if (getProviderType(rootState.provider.selected) === providerTypes.desktop) {
            // desktop responds later with its own STASH and NOT_MODIFIED
            save.desktop(state.data, state.fileName);
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
    [THREATMODEL_UPDATE]: ({ commit }, update) => commit(THREATMODEL_UPDATE, update)
};

const mutations = {
    [THREATMODEL_CLEAR]: (state) => clearState(state),
    [THREATMODEL_CONTRIBUTORS_UPDATED]: (state, contributors) => {
        const normalizedContributors = Array.isArray(contributors)
            ? contributors
            : (contributors ? [contributors] : []);
        state.data.detail.contributors.length = 0;
        normalizedContributors.forEach((name, idx) => state.data.detail.contributors[idx] = { name });
    },
    [THREATMODEL_DIAGRAM_CLOSED]: (state) => {
        state.modified = false;
        state.modifiedDiagram = {};
    },
    [THREATMODEL_DIAGRAM_MODIFIED]: (state, diagram) => {
        if (diagram && Object.keys(state.modifiedDiagram).length !== 0) {
            state.modifiedDiagram = diagram;
            state.modified = true;
        }
    },
    [THREATMODEL_DIAGRAM_SAVED]: (state, diagram) => {
        const idx = state.data.detail.diagrams.findIndex(x => x.id === diagram.id);
        state.selectedDiagram = diagram;
        // potential bug? if index not found then not copied into array
        state.data.detail.diagrams[idx] = diagram;
        state.data.version = diagram.version;
        stashThreatModel(state, state.data);
    },
    [THREATMODEL_DIAGRAM_SELECTED]: (state, diagram) => {
        state.selectedDiagram = diagram;
        state.modifiedDiagram = diagram;
    },
    [THREATMODEL_FETCH]: (state, threatModel) => stashThreatModel(state, threatModel),
    [THREATMODEL_FETCH_ALL]: (state, models) => {
        state.all.length = 0;
        models.forEach((model, idx) => state.all[idx] = model);
    },
    [THREATMODEL_MODIFIED]: (state) => {
        state.modified = true;
    },
    [THREATMODEL_RESTORE]: (state, originalThreatModel) => {
        stashThreatModel(state, originalThreatModel);
    },
    [THREATMODEL_SELECTED]: (state, threatModel) => {
        stashThreatModel(state, threatModel);
    },
    [THREATMODEL_STASH]: (state) => {
        state.stash = JSON.stringify(state.data);
    },
    [THREATMODEL_NOT_MODIFIED]: (state) => {
        state.modified = false;
    },
    [THREATMODEL_UPDATE]: (state, update) => {
        if (update.version) {
            state.data.version = update.version;
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
    isV1Model: (state) => Object.keys(state.data).length > 0 && (state.data.version == null || state.data.version.startsWith('1.')),
    modelChanged: (state) => {
        return state.modified;
    },
    tmBomExport: (state) => {
        return tmbom.exportAsTmbom(state.data);
    }
};

export const clearState = (state) => {
    state.all.length = 0;
    state.data = {};
    state.stash = '';
    state.modified = false;
    state.modifiedDiagram = {};
    state.selectedDiagram = {};
    state.fileName = '';
};

export default {
    state,
    actions,
    mutations,
    getters
};
