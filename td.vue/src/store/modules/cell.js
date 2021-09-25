import {
    CELL_SELECTED,
    CELL_UNSELECTED
} from '../actions/cell.js';

export const clearState = (state) => {
    state.ref = null;
};

const state = {
    ref: null
};

const actions = {
    [CELL_SELECTED]: ({ commit }, ref) => commit(CELL_SELECTED, ref),
    [CELL_UNSELECTED]: ({ commit }) => commit(CELL_UNSELECTED)
};

const mutations = {
    [CELL_SELECTED]: (state, ref) => {
        state.ref = ref;
    },
    [CELL_UNSELECTED]: (state) => clearState(state)
};

const getters = {};

export default {
    state,
    actions,
    mutations,
    getters
};
