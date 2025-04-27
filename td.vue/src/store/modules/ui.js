/**
 * Vuex module for managing UI component states
 */

// Action types
export const UI_SET_FIELD_STATE = 'UI_SET_FIELD_STATE';
export const UI_RESET_FIELD_STATES = 'UI_RESET_FIELD_STATES';

// Initial state
const state = {
    // Field states for various components
    fieldStates: {
    // GraphProperties component
        graphProperties: {
            // reasonOutOfScope field is disabled by default
            reasonOutOfScopeDisabled: true
        }
    }
};

// Getters
const getters = {
    /**
   * Get the state of a specific field
   * @param {String} component - Component name
   * @param {String} field - Field name
   * @returns {Any} - Field state value
   */
    getFieldState: (state) => (component, field) => {
        return state.fieldStates[component] && 
           state.fieldStates[component][field] !== undefined
            ? state.fieldStates[component][field]
            : null;
    }
};

// Actions
const actions = {
    /**
   * Set the state of a specific field
   * @param {Object} context - Vuex context
   * @param {Object} payload - Action payload
   * @param {String} payload.component - Component name
   * @param {String} payload.field - Field name
   * @param {Any} payload.value - Field state value
   */
    [UI_SET_FIELD_STATE]({ commit }, { component, field, value }) {
        commit(UI_SET_FIELD_STATE, { component, field, value });
    },
  
    /**
   * Reset all field states for a component
   * @param {Object} context - Vuex context
   * @param {String} component - Component name
   */
    [UI_RESET_FIELD_STATES]({ commit }, component) {
        commit(UI_RESET_FIELD_STATES, component);
    }
};

// Mutations
const mutations = {
    /**
   * Set the state of a specific field
   * @param {Object} state - Vuex state
   * @param {Object} payload - Mutation payload
   * @param {String} payload.component - Component name
   * @param {String} payload.field - Field name
   * @param {Any} payload.value - Field state value
   */
    [UI_SET_FIELD_STATE](state, { component, field, value }) {
    // Ensure the component object exists
        if (!state.fieldStates[component]) {
            state.fieldStates[component] = {};
        }
    
        // Set the field state
        state.fieldStates[component][field] = value;
    },
  
    /**
   * Reset all field states for a component
   * @param {Object} state - Vuex state
   * @param {String} component - Component name
   */
    [UI_RESET_FIELD_STATES](state, component) {
    // Reset the component's field states
        state.fieldStates[component] = {};
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};