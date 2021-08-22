import {
    CELL_SELECTED,
    CELL_UNSELECTED
} from '../actions/cell.js';

export const clearState = (state) => {
    state.type = null;
    state.data = {};
};

const state = {
    data: {}
};

const actions = {
    [CELL_SELECTED]: ({ commit }, cellData) => commit(CELL_SELECTED, cellData),
    [CELL_UNSELECTED]: ({ commit }) => commit(CELL_UNSELECTED)
};

const mutations = {
    [CELL_SELECTED]: (state, cellData) => {
        state.data = cellData;
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
