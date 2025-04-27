/**
 * Vue 3 Testing Utilities
 * 
 * This file provides helper functions for testing Vue 3 components
 * with Bootstrap-Vue-Next components.
 */

import { mount, shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';

// Import Bootstrap Vue plugin
// Import our mock bootstrap-vue-next plugin
import bootstrapVuePlugin from '../bootstrap-vue-next';

/**
 * Creates a test wrapper for a Vue component
 * 
 * @param {Object} component - The Vue component to test
 * @param {Object} options - Test options
 * @param {Object} options.props - Component props
 * @param {Object} options.store - Store configuration (state and actions)
 * @param {Array} options.stubs - Components to stub
 * @param {Object} options.mocks - Values to mock ($t, $router, etc)
 * @param {Boolean} options.shallow - Whether to use shallowMount
 * @returns {Object} The component wrapper
 */
export function createWrapper(component, options = {}) {
    const {
        props = {},
        store = {},
        stubs = {},
        mocks = {},
        plugins = [],
        shallow = true
    } = options;

    // Create Vuex store if store config provided
    const mockStore = createStore({
        state: store.state || {},
        actions: store.actions || {},
        getters: store.getters || {},
        mutations: store.mutations || {}
    });

    // Standard configuration for component testing
    const config = {
        props,
        global: {
            plugins: [mockStore, bootstrapVuePlugin, ...plugins],
            stubs: {
                'router-view': true,
                ...stubs
            },
            mocks: {
                $t: key => key,
                $router: { push: jest.fn() },
                ...mocks
            }
        }
    };

    // Use either shallowMount or mount based on the shallow option
    return shallow ? shallowMount(component, config) : mount(component, config);
}

export default {
    createWrapper
};