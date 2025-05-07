import { mount } from '@vue/test-utils';
import { createStore } from 'vuex';

import App from '@/App.vue';
import i18nFactory from '@/i18n/index.js';
import { LOADER_FINISHED } from '@/store/actions/loader.js';
import bootstrapVueNext from '@/plugins/bootstrap-vue-next';

// Mock the toast functionality to avoid errors
jest.mock('vue-toast-notification', () => ({
    // Simple mock for vue-toast-notification
    default: jest.fn(),
    // Export any constants that might be used
    POSITION: {
        BOTTOM_LEFT: 'bottom-left'
    }
}));

describe('App.vue', () => {
    let wrapper, mockStore, mockDispatch;

    beforeEach(() => {
        console.log = jest.fn();

        // Create mock dispatch function to track calls
        mockDispatch = jest.fn();

        // Create mock store
        mockStore = createStore({
            state: {
                loader: {
                    loading: false
                }
            },
            actions: {
                [LOADER_FINISHED]: jest.fn(),
                'THREATMODEL_UPDATE': jest.fn(),
                'THREATMODEL_NOT_MODIFIED': jest.fn(),
                'THREATMODEL_CLEAR': jest.fn()
            }
        });

        // Create wrapper with bootstrap components registered
        // Using bootstrap-vue-next plugin with proper component stubs
        wrapper = mount(App, {
            global: {
                plugins: [
                    mockStore,
                    i18nFactory.get(),
                    bootstrapVueNext
                ],
                stubs: {
                    'router-view': true,
                    'TdNavbar': true,
                    'BContainer': true,
                    'BOverlay': {
                        template: '<div><slot></slot></div>',
                        props: ['show']
                    }
                },
                mocks: {
                    $t: key => key,
                    $toast: {
                        warning: jest.fn(),
                        error: jest.fn(),
                        info: jest.fn(),
                        success: jest.fn()
                    },
                    $store: {
                        dispatch: mockDispatch,
                        state: {
                            loader: {
                                loading: false
                            }
                        }
                    }
                }
            }
        });
    });

    it('renders the app', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('has the navbar', () => {
        // Vue 3 Migration: Component names in Vue 3 are case-sensitive
        // In Vue 2, we might use lowercase tag names
        // In Vue 3, we use the proper case for component names
        expect(wrapper.findComponent({ name: 'TdNavbar' }).exists()).toBe(true);
    });

    it('has a b-container', () => {
        // Vue 3 Migration: Testing component presence directly instead of checking CSS classes
        // In Vue 2, we might check for specific CSS classes in the DOM
        // In Vue 3, we test for the component's existence directly as a more reliable approach
        // Using class selector to find the container since component stubs might vary
        expect(wrapper.find('.container').exists()).toBe(true);
    });

    it('dispatches LOADER_FINISHED on mount', async () => {
        // In Vue 3 with Vuex 4, we need to spy on the store's dispatch method
        const dispatchSpy = jest.spyOn(mockStore, 'dispatch');

        // Create a new instance to ensure the onMounted hook is triggered
        mount(App, {
            global: {
                plugins: [
                    mockStore,
                    i18nFactory.get(),
                    bootstrapVueNext
                ],
                stubs: {
                    'router-view': true,
                    'TdNavbar': true,
                    'BContainer': true,
                    'BOverlay': {
                        template: '<div><slot></slot></div>',
                        props: ['show']
                    }
                }
            }
        });

        // Verify the dispatch was called with LOADER_FINISHED
        expect(dispatchSpy).toHaveBeenCalledWith(LOADER_FINISHED);
    });

    it('has the isLoading computed property for loading state', () => {
        // Vue 3 Migration: In Vue 3, we can focus on testing the component's API
        // rather than the internal structure when appropriate
        // This is more resilient to changes in the component's implementation

        // Test the computed property directly
        expect(wrapper.vm.isLoading).toBeDefined();
        expect(typeof wrapper.vm.isLoading).toBe('boolean');
        expect(wrapper.vm.isLoading).toBe(false);
    });
});
