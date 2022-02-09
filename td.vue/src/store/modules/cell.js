import Vue from 'vue';
import {
    CELL_DATA_UPDATED,
    CELL_SELECTED,
    CELL_UNSELECTED
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
    [CELL_SELECTED]: ({ commit }, ref) => commit(CELL_SELECTED, ref),
    [CELL_UNSELECTED]: ({ commit }) => commit(CELL_UNSELECTED),
    [CELL_DATA_UPDATED]: ({ commit }, data) => commit(CELL_DATA_UPDATED, data)
};

const mutations = {
    [CELL_SELECTED]: (state, ref) => {
        state.ref = ref;
        if (state.ref && state.ref.data && state.ref.data.threats) {
            state.ref.data.threats.forEach((threat, idx) => Vue.set(state.threats, idx, threat));
        }
    },
    [CELL_UNSELECTED]: (state) => clearState(state),
    [CELL_DATA_UPDATED]: (state, data) => {
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
