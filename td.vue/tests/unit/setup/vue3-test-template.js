/**
 * Template for migrating Vue 2 tests to Vue 3
 * 
 * Follow these patterns to update your tests:
 */

// Vue 2 style imports:
import { BootstrapVue, BButton } from 'bootstrap-vue';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';

// Vue 3 style imports:
import { createStore } from 'vuex';
import { createWrapper } from '../setup/test-utils'; // Use our helper

// Vue 2 store creation:
const storeVue2 = new Vuex.Store({
    state: { /* ... */ },
    getters: { /* ... */ },
    actions: { /* ... */ },
    mutations: { /* ... */ }
});

// Vue 3 store creation:
const storeVue3 = createStore({
    state: { /* ... */ },
    getters: { /* ... */ },
    actions: { /* ... */ },
    mutations: { /* ... */ }
});

// Vue 2 test setup:
const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(BootstrapVue);

const wrapperVue2 = shallowMount(Component, {
    localVue,
    store: storeVue2,
    mocks: {
        $t: key => key
    },
    stubs: {
    // ...
    }
});

// Vue 3 test setup:
const wrapperVue3 = createWrapper(Component, {
    store: storeVue3,
    mocks: {
        $t: key => key
    },
    stubs: {
    // ...
    },
    shallow: true // Use shallowMount
});

// Vue 2 component lookups:
const _buttonVue2 = wrapperVue2.findComponent(BButton);

// Vue 3 component lookups:
const _buttonVue3 = wrapperVue3.find('button'); // Prefer DOM selectors over components
// Or for custom components:
const _customComponentVue3 = wrapperVue3.findComponent({ name: 'custom-component' });

// Vue 2 bootstrap-vue plugin methods:
wrapperVue2.vm.$bvModal.msgBoxConfirm('Are you sure?');

// Vue 3 mock these directly:
wrapperVue3.vm.$bvModal = {
    msgBoxConfirm: jest.fn().mockResolvedValue(true)
};

/**
 * Migration steps:
 * 
 * 1. Update imports
 * 2. Replace createLocalVue with createWrapper from test-utils.js
 * 3. Update component lookups to use DOM selectors
 * 4. Mock Bootstrap Vue functionality directly
 * 5. Use native Vue 3 reactivity instead of Vue.set
 */