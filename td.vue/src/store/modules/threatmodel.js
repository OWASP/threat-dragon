import Vue from 'vue';

import demo from '@/service/demo/index.js';
import isElectron from 'is-electron';
import { getProviderType } from '@/service/provider/providers';
import i18n from '@/i18n/index.js';
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
    THREATMODEL_UPDATE
} from '@/store/actions/threatmodel.js';
import save from '@/service/save.js';
import threatmodelApi from '@/service/api/threatmodelApi.js';

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
        try {
            if (getProviderType(rootState.provider.selected) === providerTypes.local) {
                // save locally for web app when local login
                save.local(state.data, `${state.data.summary.title}.json`);
            } else if (getProviderType(rootState.provider.selected) === providerTypes.desktop) {
                // desktop version always saves locally
                console.debug('Desktop create action');
                await window.electronAPI.modelSave(state.data, state.fileName);
            } else {
                await threatmodelApi.createAsync(
                    rootState.repo.selected,
                    rootState.branch.selected,
                    state.data.summary.title,
                    state.data
                );
                Vue.$toast.success(i18n.get().t('threatmodel.saved') + ' : ' + state.fileName);
            }
            dispatch(THREATMODEL_STASH);
            commit(THREATMODEL_NOT_MODIFIED);
        } catch (ex) {
            console.error('Failed to save new threat model!');
            console.error(ex);
            Vue.$toast.error(i18n.get().t('threatmodel.errors.save'));
        }
    },
    [THREATMODEL_DIAGRAM_APPLIED]: ({ commit }) => commit(THREATMODEL_DIAGRAM_APPLIED),
    [THREATMODEL_DIAGRAM_CLOSED]: ({ commit }) => commit(THREATMODEL_DIAGRAM_CLOSED),
    [THREATMODEL_DIAGRAM_MODIFIED]: ({ commit }, diagram) => commit(THREATMODEL_DIAGRAM_MODIFIED, diagram),
    [THREATMODEL_DIAGRAM_SAVED]: ({ commit }, diagram) => commit(THREATMODEL_DIAGRAM_SAVED, diagram),
    [THREATMODEL_DIAGRAM_SELECTED]: ({ commit }, diagram) => commit(THREATMODEL_DIAGRAM_SELECTED, diagram),
    [THREATMODEL_FETCH]: async ({ commit, dispatch, rootState }, threatModel) => {
        dispatch(THREATMODEL_CLEAR);
        const resp = await threatmodelApi.modelAsync(
            rootState.repo.selected,
            rootState.branch.selected,
            threatModel
        );
        commit(THREATMODEL_FETCH, resp.data);
    },
    [THREATMODEL_FETCH_ALL]: async ({ commit, rootState }) => {
        if (getProviderType(rootState.provider.selected) === providerTypes.local || getProviderType(rootState.provider.selected) === providerTypes.desktop) {
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
        let originalModel = JSON.parse(state.stash);
        console.debug('Restore threat model action');
        if (getProviderType(rootState.provider.selected) !== providerTypes.local && getProviderType(rootState.provider.selected) !== providerTypes.desktop) {
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
        try {
            if (getProviderType(rootState.provider.selected) === providerTypes.local) {
                // save locally for web app when local login
                Vue.$toast.success(i18n.get().t('threatmodel.saved') + ' : ' + state.fileName);
                save.local(state.data, `${state.data.summary.title}.json`, state.format);
            } else if (getProviderType(rootState.provider.selected) === providerTypes.desktop) {
                // desktop version always saves locally
                Vue.$toast.success(i18n.get().t('threatmodel.saved') + ' : ' + state.fileName);
                await window.electronAPI.modelSave(state.data, state.fileName);
            } else {
                await threatmodelApi.updateAsync(
                    rootState.repo.selected,
                    rootState.branch.selected,
                    state.data.summary.title,
                    state.data
                );
                Vue.$toast.success(i18n.get().t('threatmodel.saved') + ' : ' + state.fileName);
            }
            dispatch(THREATMODEL_STASH);
            commit(THREATMODEL_NOT_MODIFIED);
        } catch (ex) {
            console.error('Failed to save threat model!');
            console.error(ex);
            Vue.$toast.error(i18n.get().t('threatmodel.errors.save'));
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
            const idx = state.data.detail.diagrams.findIndex(x => x.id === diagram.id);
            console.debug('Threatmodel diagram modified: ' + diagram.id + ' at index: ' + idx);
            state.modifiedDiagram = diagram;
            // console.debug('Threatmodel diagram modified diagram: ' + JSON.stringify(state.modifiedDiagram));
            if (state.modified === false) {
                console.debug('model (diagram) now modified');
                if (isElectron()) {
                    window.electronAPI.modelModified(true);
                }
                state.modified = true;
            }
        }
    },
    [THREATMODEL_DIAGRAM_SAVED]: (state, diagram) => {
        const idx = state.data.detail.diagrams.findIndex(x => x.id === diagram.id);
        console.debug('Threatmodel diagram saved: ' + diagram.id + ' at index: ' + idx);
        Vue.set(state, 'selectedDiagram', diagram);
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
        if (state.modified === false) {
            console.debug('model now modified');
            if (isElectron()) {
                window.electronAPI.modelModified(true);
            }
        }
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
        console.debug('Threatmodel stashed');
        Vue.set(state, 'stash', JSON.stringify(state.data));
    },
    [THREATMODEL_NOT_MODIFIED]: (state) => {
        if (state.modified === true) {
            console.debug('model now unmodified');
        }
        if (isElectron()) {
            window.electronAPI.modelModified(false);
        }
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
