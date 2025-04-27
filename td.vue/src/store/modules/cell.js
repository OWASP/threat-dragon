import { CELL_DATA_UPDATED, CELL_SELECTED, CELL_UNSELECTED } from '../actions/cell.js';
import { tc } from '@/i18n/index.js';
import logger from '@/utils/logger.js';

// Create a context-specific logger
const log = logger.getLogger('store:cell');

export const clearState = (state) => {
    state.ref = null;
    state.threats = [];
    state.previousType = null;
};

const state = {
    ref: null,
    threats: [],
    previousType: null // Store the previous cell type to handle name changes
};

// Helper function to get the localized default name for a cell type
const getLocalizedDefaultName = (cellType) => {
    switch (cellType) {
    case 'tm.Actor':
        return tc('threatmodel.shapes.actor');
    case 'tm.Process':
        return tc('threatmodel.shapes.process');
    case 'tm.Store':
        return tc('threatmodel.shapes.store');
    case 'tm.Text':
        return tc('threatmodel.shapes.text');
    case 'tm.Boundary':
    case 'tm.BoundaryBox':
        return tc('threatmodel.shapes.trustBoundary');
    case 'tm.Flow':
        return tc('threatmodel.shapes.flowStencil');
    default:
        return 'Unknown';
    }
};

// Helper function to determine cell type from shape
const getCellTypeFromShape = (shape) => {
    switch (shape) {
    case 'actor':
        return 'tm.Actor';
    case 'process':
        return 'tm.Process';
    case 'store':
        return 'tm.Store';
    case 'td-text-block':
        return 'tm.Text';
    case 'trust-boundary-box':
        return 'tm.BoundaryBox';
    case 'trust-boundary-curve':
    case 'trust-broundary-curve':
        return 'tm.Boundary';
    case 'flow':
        return 'tm.Flow';
    default:
        return null;
    }
};

const actions = {
    [CELL_SELECTED]: ({ commit }, ref) => {
        // Ensure cell has a type based on its shape if not already set
        if (ref && ref.data) {
            if (!ref.data.type && ref.shape) {
                const cellType = getCellTypeFromShape(ref.shape);
                if (cellType) {
                    ref.data.type = cellType;
                    log.debug('Set cell type based on shape', { shape: ref.shape, type: cellType });
                }
            }
            
            // If cell has no name but we know its type, set a default localized name
            if (!ref.data.name && ref.data.type) {
                ref.data.name = getLocalizedDefaultName(ref.data.type);
                log.debug('Set default localized name for cell', { type: ref.data.type, name: ref.data.name });
            }
        }
        
        commit(CELL_SELECTED, ref);
    },
    [CELL_UNSELECTED]: ({ commit }) => commit(CELL_UNSELECTED),
    [CELL_DATA_UPDATED]: ({ commit, state }, data) => {
        // If name is empty but we have a previous type, restore the default name
        if (data && data.name === '' && state.previousType) {
            data.name = getLocalizedDefaultName(state.previousType);
            log.debug('Restored default name for cell with empty name', { type: state.previousType, name: data.name });
        }
        
        commit(CELL_DATA_UPDATED, data);
    }
};

const mutations = {
    [CELL_SELECTED]: (state, ref) => {
        // Store the previous cell type before updating the reference
        if (ref && ref.data && ref.data.type) {
            state.previousType = ref.data.type;
            log.debug('Stored previous cell type', { type: state.previousType });
        }
        
        state.ref = ref;
        if (state.ref && state.ref.data && state.ref.data.threats) {
            // Replace Vue.set with direct array assignment for Vue 3 reactivity
            state.threats = [...state.ref.data.threats];
        }
    },
    [CELL_UNSELECTED]: (state) => clearState(state),
    [CELL_DATA_UPDATED]: (state, data) => {
        if (!state.ref || !state.ref.setData) {
            return;
        }

        // If we're updating a cell with no type but we have a previous type, restore it
        if (data && !data.type && state.previousType) {
            data.type = state.previousType;
            log.debug('Restored previous cell type', { type: data.type });
        }

        state.ref.setData(data);

        if (data.threats) {
            // Replace Vue.set with direct array assignment for Vue 3 reactivity
            state.threats = [...data.threats];
        }
    }
};

const getters = {
    cellType: (state) => state.ref?.data?.type || null,
    cellName: (state) => state.ref?.data?.name || '',
    cellShape: (state) => state.ref?.shape || null,
    hasCell: (state) => !!state.ref
};

export default {
    state,
    actions,
    mutations,
    getters
};
