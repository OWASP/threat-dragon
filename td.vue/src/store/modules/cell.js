import {
    CELL_SELECTED,
    CELL_UNSELECTED
} from '../actions/cell.js';

export const clearState = (state) => {
    state.data = {};
    state.id = null;
    state.ref = null;
};

// TODO: We can probably remove this entire thing and tap into the graph store
// If we add "selectedCell" and use the entire cell reference, we can bind the data directly
const state = {
    data: {},
    id: null,
    ref: null
};

const actions = {
    [CELL_SELECTED]: ({ commit }, cellData) => commit(CELL_SELECTED, cellData),
    [CELL_UNSELECTED]: ({ commit }) => commit(CELL_UNSELECTED)
};

const mutations = {
    [CELL_SELECTED]: (state, { data, id, ref }) => {
        state.data = data;
        state.id = id;
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
