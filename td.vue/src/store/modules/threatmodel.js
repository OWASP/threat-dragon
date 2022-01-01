import Vue from 'vue';

import demo from '@/service/demo/index.js';
import { getProviderType } from '../../service/provider/providers.js';
import { providerTypes } from '../../service/provider/providerTypes.js';
import {
    THREATMODEL_CLEAR,
    THREATMODEL_CONTRIBUTORS_UPDATED,
    THREATMODEL_CREATE,
    THREATMODEL_DIAGRAM_SELECTED,
    THREATMODEL_FETCH,
    THREATMODEL_FETCH_ALL,
    THREATMODEL_RESTORE,
    THREATMODEL_SELECTED
} from '../actions/threatmodel.js';
import threatmodelApi from '../../service/threatmodelApi.js';

export const clearState = (state) => {
    state.all.length = 0;
    state.data = {};
    state.immutableCopy = '';
    state.selectedDiagram = {};
};

const state = {
    all: [],
    data: {},
    immutableCopy: {},
    selectedDiagram: {}
};

const setThreatModel = (theState, threatModel) => {
    theState.data = threatModel;
    theState.immutableCopy = JSON.stringify(threatModel);
};

const actions = {
    [THREATMODEL_CLEAR]: ({ commit }) => commit(THREATMODEL_CLEAR),
    [THREATMODEL_CREATE]: ({ commit }, threatModel) => commit(THREATMODEL_CREATE, threatModel),
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
        if (getProviderType(rootState.provider.selected) !== providerTypes.local) {
            const resp = await threatmodelApi.modelsAsync(
                rootState.repo.selected,
                rootState.branch.selected
            );
            commit(THREATMODEL_FETCH_ALL, resp.data);
        } else {
            commit(THREATMODEL_FETCH_ALL, demo.models);
        }
    },
    [THREATMODEL_SELECTED]: ({ commit }, threatModel) => commit(THREATMODEL_SELECTED, threatModel),
    [THREATMODEL_CONTRIBUTORS_UPDATED]: ({ commit }, contributors) => commit(THREATMODEL_CONTRIBUTORS_UPDATED, contributors),
    [THREATMODEL_RESTORE]: async ({ commit, state, rootState }) => {
        let originalModel = JSON.parse(state.immutableCopy);
        if (getProviderType(rootState.provider.selected) !== providerTypes.local) {
            const originalTitle = (JSON.parse(state.immutableCopy)).summary.title;
            const resp = await threatmodelApi.modelAsync(
                rootState.repo.selected,
                rootState.branch.selected,
                originalTitle
            );
            originalModel = resp.data;
        }
        commit(THREATMODEL_RESTORE, originalModel);
    }
};

const mutations = {
    [THREATMODEL_CLEAR]: (state) => clearState(state),
    [THREATMODEL_CREATE]: (state, threatModel) => setThreatModel(state, threatModel),
    [THREATMODEL_DIAGRAM_SELECTED]: (state, diagram) => {
        state.selectedDiagram = diagram;
    },
    [THREATMODEL_FETCH]: (state, threatModel) => setThreatModel(state, threatModel),
    [THREATMODEL_FETCH_ALL]: (state, models) => {
        state.all.length = 0;
        models.forEach((model, idx) => Vue.set(state.all, idx, model));
    },
    [THREATMODEL_SELECTED]: (state, threatModel) => setThreatModel(state, threatModel),
    [THREATMODEL_CONTRIBUTORS_UPDATED]: (state, contributors) => {
        state.data.detail.contributors.length = 0;
        contributors.forEach((name, idx) => Vue.set(state.data.detail.contributors, idx, { name }));
    },
    [THREATMODEL_RESTORE]: (state, originalThreatModel) => setThreatModel(state, originalThreatModel)
};

const getters = {
    contributors: (state) => {
        let contribs = [];
        if (state.data && state.data.detail && state.data.detail.contributors) {
            contribs = state.data.detail.contributors;
        }
        return contribs.map(x => x.name);
    },
    modelChanged: (state) => JSON.stringify(state.data) !== state.immutableCopy
};

export default {
    state,
    actions,
    mutations,
    getters
};
