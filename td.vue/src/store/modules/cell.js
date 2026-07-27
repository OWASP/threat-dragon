import Vue from 'vue';
import {
    cellDataUpdated,
    cellSelected,
    cellUnselected
} from '../actions/cell.js';

export const clearState = (state) => {
    state.ref = null;
    state.threats = [];
};

const state = {
    ref: null,
    threats: []
};

const actions = {
    [cellSelected]: ({ commit }, ref) => commit(cellSelected, ref),
    [cellUnselected]: ({ commit }) => commit(cellUnselected),
    [cellDataUpdated]: ({ commit }, data) => commit(cellDataUpdated, data)
};

const mutations = {
    [cellSelected]: (state, ref) => {
        state.ref = ref;
        if (state.ref && state.ref.data && state.ref.data.threats) {
            state.ref.data.threats.forEach((threat, idx) => Vue.set(state.threats, idx, threat));
        }
    },
    [cellUnselected]: (state) => clearState(state),
    [cellDataUpdated]: (state, data) => {
        if (!state.ref || !state.ref.setData) {
            return;
        }

        state.ref.setData(data);

        if (data.threats) {
            state.threats.splice(0);
            data.threats.forEach((threat, idx) => Vue.set(state.threats, idx, threat));
        }
    }
};

const getters = {};

export default {
    state,
    actions,
    mutations,
    getters
};
