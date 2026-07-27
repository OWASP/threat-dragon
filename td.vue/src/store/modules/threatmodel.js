import demo from '@/service/demo/index.js';
import { getProviderType } from '@/service/provider/providers';
import { providerTypes } from '@/service/provider/providerTypes';
import { folderSelected } from '@/store/actions/folder';
import {
    threatmodelClear,
    threatmodelContributorsUpdated,
    threatmodelCreate,
    threatmodelDiagramClosed,
    threatmodelDiagramModified,
    threatmodelDiagramSaved,
    threatmodelDiagramSelected,
    threatmodelFetch,
    threatmodelFetchAll,
    threatmodelLoadDemos,
    threatmodelModified,
    threatmodelNotModified,
    threatmodelRestore,
    threatmodelSave,
    threatmodelSelected,
    threatmodelStash,
    threatmodelUpdate
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
    [threatmodelClear]: ({ rootState, commit }) => {
        if (getProviderType(rootState.provider.selected) === providerTypes.desktop) {
            // advise electron server that the model has closed this file
            window.electronAPI.modelClosed(state.fileName);
        }
        commit(threatmodelClear);
    },
    [threatmodelContributorsUpdated]: ({ commit }, contributors) => commit(threatmodelContributorsUpdated, contributors),
    [threatmodelCreate]: async ({ dispatch, commit, rootState, state }) => {
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
                    dispatch(folderSelected, folder.data);
                    result = true;
                }
            } else {
                result = await save.repoCreate(rootState, state);
            }
            if (result) {
                dispatch(threatmodelStash);
                commit(threatmodelNotModified);
            }
        }
        return result;
    },
    [threatmodelDiagramClosed]: ({ commit }) => commit(threatmodelDiagramClosed),
    [threatmodelDiagramModified]: ({ commit }, diagram) => commit(threatmodelDiagramModified, diagram),
    [threatmodelDiagramSaved]: ({ commit }, diagram) => commit(threatmodelDiagramSaved, diagram),
    [threatmodelDiagramSelected]: ({ commit }, diagram) => commit(threatmodelDiagramSelected, diagram),
    [threatmodelFetch]: async ({ commit, dispatch, rootState }, threatModel) => {
        dispatch(threatmodelClear);
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
        commit(threatmodelFetch, resp.data);
    },
    [threatmodelFetchAll]: async ({ commit, rootState }) => {
        const resp = await threatmodelApi.modelsAsync(
            rootState.repo.selected,
            rootState.branch.selected
        );
        commit(threatmodelFetchAll, resp.data);
    },
    [threatmodelLoadDemos]: ({ commit }) => {
        commit(threatmodelFetchAll, demo.models);
    },
    [threatmodelModified]: ({ commit }) => commit(threatmodelModified),
    [threatmodelRestore]: async ({ commit, state, rootState }) => {
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
        commit(threatmodelRestore, originalModel);
    },
    [threatmodelSave]: async ({ dispatch, commit, rootState, state }) => {
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
                dispatch(threatmodelStash);
                commit(threatmodelNotModified);
            }
        }
    },
    [threatmodelSelected]: ({ commit }, threatModel) => commit(threatmodelSelected, threatModel),
    [threatmodelStash]: ({ commit }) => commit(threatmodelStash),
    [threatmodelNotModified]: ({ commit }) => commit(threatmodelNotModified),
    [threatmodelUpdate]: ({ commit }, update) => commit(threatmodelUpdate, update)
};

const mutations = {
    [threatmodelClear]: (state) => clearState(state),
    [threatmodelContributorsUpdated]: (state, contributors) => {
        const normalizedContributors = Array.isArray(contributors)
            ? contributors
            : (contributors ? [contributors] : []);
        state.data.detail.contributors.length = 0;
        normalizedContributors.forEach((name, idx) => state.data.detail.contributors[idx] = { name });
    },
    [threatmodelDiagramClosed]: (state) => {
        state.modified = false;
        state.modifiedDiagram = {};
    },
    [threatmodelDiagramModified]: (state, diagram) => {
        if (diagram && Object.keys(state.modifiedDiagram).length !== 0) {
            state.modifiedDiagram = diagram;
            state.modified = true;
        }
    },
    [threatmodelDiagramSaved]: (state, diagram) => {
        const idx = state.data.detail.diagrams.findIndex(x => x.id === diagram.id);
        state.selectedDiagram = diagram;
        // potential bug? if index not found then not copied into array
        state.data.detail.diagrams[idx] = diagram;
        state.data.version = diagram.version;
        stashThreatModel(state, state.data);
    },
    [threatmodelDiagramSelected]: (state, diagram) => {
        state.selectedDiagram = diagram;
        state.modifiedDiagram = diagram;
    },
    [threatmodelFetch]: (state, threatModel) => stashThreatModel(state, threatModel),
    [threatmodelFetchAll]: (state, models) => {
        state.all.length = 0;
        models.forEach((model, idx) => state.all[idx] = model);
    },
    [threatmodelModified]: (state) => {
        state.modified = true;
    },
    [threatmodelRestore]: (state, originalThreatModel) => {
        stashThreatModel(state, originalThreatModel);
    },
    [threatmodelSelected]: (state, threatModel) => {
        stashThreatModel(state, threatModel);
    },
    [threatmodelStash]: (state) => {
        state.stash = JSON.stringify(state.data);
    },
    [threatmodelNotModified]: (state) => {
        state.modified = false;
    },
    [threatmodelUpdate]: (state, update) => {
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
