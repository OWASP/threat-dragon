// Vue 3 test utilities
import { mount, shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';
import _i18nFactory from '@/i18n/index.js';
// Import Bootstrap Vue components
import {
    BOverlay, BContainer, BNavbarToggle, BImg, BNavbarBrand, BCollapse,
    BNavbarNav, BNavItem, BNavbar, BNavText, BTooltip, BDropdownItem,
    BDropdown, BCol, BRow, BButton, BButtonGroup, BForm, BFormGroup,
    BFormInput, BFormTextarea, BListGroup, BListGroupItem, BCard, BFormCheckbox,
    BTableSimple, BThead, BTbody, BTr, BTh, BTd, BFormRadioGroup, BFormSelect,
    BFormRow, BModal, BFormInvalidFeedback, BBadge, BTable, BCardText
} from 'bootstrap-vue-next';

// Create a map of components
const bootstrapVueComponents = {
    BOverlay, BContainer, BNavbarToggle, BImg, BNavbarBrand, BCollapse,
    BNavbarNav, BNavItem, BNavbar, BNavText, BTooltip, BDropdownItem,
    BDropdown, BCol, BRow, BButton, BButtonGroup, BForm, BFormGroup,
    BFormInput, BFormTextarea, BListGroup, BListGroupItem, BCard, BFormCheckbox,
    BTableSimple, BThead, BTbody, BTr, BTh, BTd, BFormRadioGroup, BFormSelect,
    BFormRow, BModal, BFormInvalidFeedback, BBadge, BTable, BCardText
};

/**
 * Creates a Vue 3 test wrapper with standard configuration
 * 
 * @param {Object} component - The Vue component to test
 * @param {Object} options - Test configuration options
 * @param {Object} options.props - Component props
 * @param {Object} options.store - Vuex store configuration
 * @param {Object} options.mocks - Mock implementations
 * @param {Object} options.stubs - Component stubs
 * @param {boolean} options.shallow - Whether to use shallowMount
 * @returns {import('@vue/test-utils').VueWrapper}
 */
export function createWrapper(component, options = {}) {
    const { 
        props = {},
        store = {},
        mocks = {},
        stubs = {},
        shallow = false
    } = options;

    // Setup Vuex store
    const vuexStore = store.modules ? 
        createStore(store) : 
        createStore({
            state: store.state || {},
            getters: store.getters || {},
            actions: store.actions || {},
            mutations: store.mutations || {}
        });

    // Create common configuration
    const config = {
        props,
        global: {
            plugins: [vuexStore],
            mocks: {
                $t: key => key,
                ...mocks
            },
            stubs: {
                // Common stubs
                transition: false,
                'router-view': true,
                ...stubs
            }
        }
    };

    // Add bootstrap components
    if (options.useBootstrapVue !== false) {
        // Register individual bootstrap components
        config.global.components = {};
        Object.entries(bootstrapVueComponents).forEach(([name, component]) => {
            if (typeof component === 'object' && component !== null) {
                config.global.components[name] = component;
            }
        });
        
        // Add bootstrap modal features for Vue 3
        // In Vue 3, instead of using mocks directly, we need to simulate the app.config.globalProperties
        // This is done by adding it to the global option
        config.global.provide = {
            ...config.global.provide,
            // Provide $bvModal and $bvToast to the component
            $bvModal: {
                msgBoxConfirm: jest.fn().mockResolvedValue(true),
                show: jest.fn(),
                hide: jest.fn()
            },
            $bvToast: {
                toast: jest.fn()
            }
        };
    }

    return shallow ? shallowMount(component, config) : mount(component, config);
}

/**
 * Creates a Vuex store for testing
 * 
 * @param {Object} options - Store configuration
 * @returns {import('vuex').Store}
 */
export function createTestStore(options = {}) {
    return createStore({
        state: options.state || {},
        getters: options.getters || {},
        actions: options.actions || {},
        mutations: options.mutations || {},
        modules: options.modules || {}
    });
}