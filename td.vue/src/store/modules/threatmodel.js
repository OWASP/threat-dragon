import Vue from 'vue';

import {
    THREATMODEL_CLEAR,
    THREATMODEL_FETCH,
    THREATMODEL_FETCH_ALL,
    THREATMODEL_SELECTED
} from '../actions/threatmodel.js';
import threatmodelApi from '../../service/threatmodelApi.js';

export const clearState = (state) => {
    state.all.length = 0;
    state.selected = '';
    state.data = {};
};

const state = {
    all: [],
    selected: '',
    data: {}
};

const actions = {
    [THREATMODEL_CLEAR]: ({ commit }) => commit(THREATMODEL_CLEAR),
    [THREATMODEL_FETCH]: async ({ commit, state, rootState }) => {
        if (rootState.provider.selected !== 'local') {
            const resp = await threatmodelApi.modelAsync(
                rootState.repo.selected,
                rootState.branch.selected,
                state.selected
            );
            commit(THREATMODEL_FETCH, resp.data);
        }
    },
    [THREATMODEL_FETCH_ALL]: async ({ commit, rootState }) => {
        if (rootState.provider.selected !== 'local') {
            const resp = await threatmodelApi.modelsAsync(
                rootState.repo.selected,
                rootState.branch.selected
            );
            commit(THREATMODEL_FETCH_ALL, resp.data);
        }
    },
    [THREATMODEL_SELECTED]: ({ commit, dispatch }, threatModel) => {
        commit(THREATMODEL_SELECTED, threatModel);
        dispatch(THREATMODEL_FETCH);
    }
};

const mutations = {
    [THREATMODEL_CLEAR]: (state) => clearState(state),
    [THREATMODEL_FETCH]: (state, model) => {
        state.data = model;
    },
    [THREATMODEL_FETCH_ALL]: (state, models) => {
        state.all.length = 0;
        models.forEach((model, idx) => Vue.set(state.all, idx, model));
    },
    [THREATMODEL_SELECTED]: (state, repo) => {
        state.selected = repo;
    }
};

const getters = {};

export default {
    state,
    actions,
    mutations,
    getters
};
