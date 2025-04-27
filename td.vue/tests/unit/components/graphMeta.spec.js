import { mount, shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';
import TdGraphMeta from '@/components/GraphMeta.vue';
import _TdGraphThreats from '@/components/GraphThreats.vue';
import { CELL_DATA_UPDATED, CELL_UNSELECTED } from '@/store/actions/cell.js';
import { useThreatEditor as _useThreatEditor } from '@/composables/useThreatEditor';

// Set up global process.env.NODE_ENV for tests
process.env.NODE_ENV = 'test';

// Mocking the composables
jest.mock('@/composables/useThreatEditor', () => {
    const mockImplementation = () => ({
        createNewThreat: jest.fn().mockReturnValue({
            id: 'new-threat-id',
            title: 'New Test Threat',
            status: 'Open',
            severity: 'TBD'
        }),
        editExistingThreat: jest.fn(),
        saveThreat: jest.fn(),
        cancelEdit: jest.fn(),
        deleteThreat: jest.fn(),
        isEditing: { value: false },
        editingThreat: { value: null },
        isNewThreat: { value: false }
    });

    return {
        __esModule: true,
        useThreatEditor: mockImplementation
    };
});

// Mock the i18n module for testing
jest.mock('@/i18n', () => {
    // Create a mock function that returns the expected object
    const mockUseI18n = jest.fn(() => ({
        t: jest.fn(key => key),
        locale: { value: 'eng' },
        availableLocales: ['eng', 'deu', 'fra']
    }));

    return {
        __esModule: true,
        useI18n: mockUseI18n,
        default: { get: jest.fn() }
    };
});

// Import individual components from bootstrap-vue-next for better testing
import {
    BRow, BCol, BCard, BCardBody, BCardText, BButton
} from 'bootstrap-vue-next';

// VUE3 MIGRATION: This test file has been migrated to Vue 3 testing patterns with these key changes:
// 1. Using bootstrap-vue-next components directly instead of plugin registration
// 2. Continuing to use Vuex createStore for compatibility with current codebase
// 3. Using the global configuration object to provide stubs, mocks, and plugins
// 4. Added proper component registrations for bootstrap-vue-next components
// 5. Testing component behavior and computed properties rather than just DOM structure

describe('components/GraphMeta.vue', () => {
    let wrapper;

    describe('emptyState', () => {
        beforeEach(() => {
            const store = createStore({
                state: {
                    cell: {
                        ref: null
                    }
                },
                actions: {
                    [CELL_UNSELECTED]: jest.fn()
                }
            });

            // VUE3 MIGRATION: Using bootstrap-vue-next components directly for a simpler Vue 3 approach
            wrapper = mount(TdGraphMeta, {
                global: {
                    plugins: [store],
                    components: {
                        // Register Bootstrap Vue Next components
                        BRow, BCol, BCard, BCardBody, BCardText, BButton
                    },
                    stubs: {
                        // Still stub some components that aren't needed for this test
                        'font-awesome-icon': true,
                        'td-graph-properties': true,
                        // Use simpler stubs for bootstrap components
                        'b-row': true,
                        'b-col': true,
                        'b-card': {
                            template: '<div><slot name="header"></slot><slot></slot></div>'
                        },
                        'b-card-body': {
                            template: '<div><slot></slot></div>'
                        },
                        'b-card-text': {
                            template: '<div><slot></slot></div>'
                        },
                        'b-button': true
                    },
                    // No mocks needed as useI18n is already mocked globally
                }
            });
        });

        it('renders the component', () => {
            expect(wrapper.exists()).toBe(true);
            // VUE3 MIGRATION: Instead of testing text content directly, test computed property
            expect(wrapper.vm.cellRef).toBeNull();
        });
    });

    describe('with data', () => {
        let entityData;

        beforeEach(() => {
            entityData = {
                threats: [{
                    status: 'Open',
                    severity: 'Medium',
                    description: 'describing the thing',
                    title: 'Some Threat',
                    type: 'Spoofing',
                    mitigation: 'Unmitigated'
                }]
            };

            const store = createStore({
                state: {
                    cell: {
                        ref: {
                            data: entityData
                        },
                        threats: entityData.threats
                    }
                },
                actions: {
                    [CELL_UNSELECTED]: jest.fn()
                }
            });

            // VUE3 MIGRATION: Using bootstrap-vue-next components directly
            wrapper = mount(TdGraphMeta, {
                global: {
                    plugins: [store],
                    components: {
                        // Register Bootstrap Vue Next components
                        BRow, BCol, BCard, BCardBody, BCardText, BButton
                    },
                    stubs: {
                        'font-awesome-icon': true,
                        'td-graph-properties': true,
                        'td-graph-threats': true,
                        // Use simpler stubs for bootstrap components
                        'b-row': true,
                        'b-col': true,
                        'b-card': {
                            template: '<div><slot name="header"></slot><slot></slot></div>'
                        },
                        'b-card-body': {
                            template: '<div><slot></slot></div>'
                        },
                        'b-card-text': {
                            template: '<div><slot></slot></div>'
                        },
                        'b-button': true
                    },
                    // No mocks needed as useI18n is already mocked globally
                }
            });
        });

        it('renders the component with data', () => {
            expect(wrapper.exists()).toBe(true);
            // VUE3 MIGRATION: Instead of checking HTML content, test the component state
            expect(wrapper.vm.cellRef).not.toBeNull();
            expect(wrapper.vm.threats).toEqual(entityData.threats);
        });

        // VUE3 MIGRATION: Added test for computed properties directly
        it('has access to the threats from the store', () => {
            // Test computed property directly instead of just checking DOM structure
            expect(wrapper.vm.threats).toEqual(entityData.threats);
        });
    });

    describe('methods', () => {
        let wrapper, store;

        beforeEach(() => {
            const entityData = {
                threats: [{
                    status: 'Open',
                    severity: 'Medium',
                    description: 'describing the thing',
                    title: 'Some Threat',
                    type: 'Spoofing',
                    mitigation: 'Unmitigated'
                }]
            };

            store = createStore({
                state: {
                    cell: {
                        ref: {
                            data: entityData
                        },
                        threats: entityData.threats
                    },
                    threatmodel: {
                        selectedDiagram: {
                            diagramType: 'STRIDE'
                        },
                        data: {
                            detail: {
                                threatTop: 0
                            }
                        }
                    }
                },
                actions: {
                    THREATMODEL_UPDATE: jest.fn(),
                    [CELL_UNSELECTED]: jest.fn(),
                    [CELL_DATA_UPDATED]: jest.fn()
                }
            });

            store.dispatch = jest.fn();

            // VUE3 MIGRATION: Using shallowMount with bootstrap-vue-next components
            wrapper = shallowMount(TdGraphMeta, {
                global: {
                    plugins: [store],
                    components: {
                        // Register Bootstrap Vue Next components
                        BRow, BCol, BCard, BCardBody, BCardText, BButton
                    },
                    stubs: {
                        // Use simple stubs for all components to focus on methods testing
                        'font-awesome-icon': true,
                        'td-graph-properties': true,
                        'td-graph-threats': true,
                        'b-row': true,
                        'b-col': true,
                        'b-card': true,
                        'b-card-body': true,
                        'b-card-text': true,
                        'b-button': true
                    },
                    // No mocks needed as useI18n is already mocked globally
                }
            });
        });

        it('has the onThreatSelected method', () => {
            expect(typeof wrapper.vm.onThreatSelected).toBe('function');
        });

        it('emits events when calling onThreatSelected', async () => {
            // VUE3 MIGRATION: Testing method behavior directly
            await wrapper.vm.onThreatSelected('test-id', 'edit');
            expect(wrapper.emitted()).toHaveProperty('threatSelected');

            const emitted = wrapper.emitted('threatSelected');
            expect(emitted[0]).toEqual(['test-id', 'edit']);
        });

        // VUE3 MIGRATION: Testing the component's ability to emit events
        it('emits threatSuggest events when calling onAddThreatByType', async () => {
            await wrapper.vm.onAddThreatByType();
            expect(wrapper.emitted()).toHaveProperty('threatSuggest');

            const emitted = wrapper.emitted('threatSuggest');
            expect(emitted[0]).toEqual(['type']);
        });
    });

    // VUE3 MIGRATION: Added tests for computed properties
    describe('computed properties', () => {
        let wrapper, store;

        beforeEach(() => {
            // Create a store with both diagram and cell data
            store = createStore({
                state: {
                    cell: {
                        ref: {
                            data: {
                                threats: [],
                                outOfScope: false,
                                type: 'tm.Process'
                            }
                        },
                        threats: []
                    },
                    threatmodel: {
                        selectedDiagram: {
                            diagramType: 'STRIDE'
                        },
                        data: {
                            detail: {
                                threatTop: 5
                            }
                        }
                    }
                },
                actions: {
                    [CELL_UNSELECTED]: jest.fn(),
                    [CELL_DATA_UPDATED]: jest.fn()
                }
            });

            // Mount with shallow to focus on computed properties
            wrapper = shallowMount(TdGraphMeta, {
                global: {
                    plugins: [store],
                    stubs: {
                        'font-awesome-icon': true,
                        'td-graph-properties': true,
                        'td-graph-threats': true,
                        'b-row': true,
                        'b-col': true,
                        'b-card': true,
                        'b-card-body': true,
                        'b-card-text': true,
                        'b-button': true
                    },
                    // No mocks needed as useI18n is already mocked globally
                }
            });
        });

        // VUE3 MIGRATION: Testing computed properties directly
        it('has a cellRef computed property from store state', () => {
            expect(wrapper.vm.cellRef).toEqual(store.state.cell.ref);
        });

        it('has a threats computed property from store state', () => {
            expect(wrapper.vm.threats).toEqual(store.state.cell.threats);
        });

        it('has a diagram computed property from store state', () => {
            expect(wrapper.vm.diagram).toEqual(store.state.threatmodel.selectedDiagram);
        });

        it('has a threatTop computed property from store state', () => {
            expect(wrapper.vm.threatTop).toBe(5);
        });

        it('computes disableNewThreat based on cell properties', () => {
            // Default is false because process entity is in scope
            expect(wrapper.vm.disableNewThreat).toBe(false);

            // Set outOfScope to true and verify it's disabled
            store.state.cell.ref.data.outOfScope = true;
            expect(wrapper.vm.disableNewThreat).toBe(true);

            // Reset and change to trust boundary type
            store.state.cell.ref.data.outOfScope = false;
            store.state.cell.ref.data.isTrustBoundary = true;
            expect(wrapper.vm.disableNewThreat).toBe(true);
        });
    });
});
