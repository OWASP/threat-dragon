import { nextTick as _nextTick } from 'vue';
import { createStore } from 'vuex';
import { mount as _mount, shallowMount } from '@vue/test-utils';

import { CELL_DATA_UPDATED } from '@/store/actions/cell.js';
import tmActions from '@/store/actions/threatmodel.js';
import dataChanged from '@/service/x6/graph/data-changed.js';
const _dataChanged = dataChanged;
import threatModels from '@/service/threats/models/index.js';
const _threatModels = threatModels;
import ThreatSuggestDialog from '@/components/ThreatSuggestDialog.vue';

// Mock the required dependencies
jest.mock('@/service/x6/graph/data-changed.js', () => ({
    updateStyleAttrs: jest.fn()
}));

jest.mock('@/service/threats/models/index.js', () => ({
    getThreatTypesByElement: jest.fn(() => ({})),
    getFrequencyMapByElement: jest.fn(() => ({ test: 0 }))
}));

jest.mock('@/service/threats/oats/context-generator.js', () => ({
    GetContextSuggestions: jest.fn(() => [])
}));

jest.mock('@/service/threats/index.js', () => ({
    createNewTypedThreat: jest.fn(() => ({}))
}));

jest.mock('uuid', () => ({
    v4: jest.fn(() => 'test-uuid')
}));

// Mock vue-i18n
jest.mock('@/i18n', () => ({
    useI18n: jest.fn(() => ({
        t: jest.fn(key => key),
        tc: jest.fn(key => key),
        locale: { value: 'en' }
    })),
    __esModule: true,
    default: {
        get: jest.fn().mockReturnValue({
            global: {
                messages: {
                    value: {
                        en: {
                            threats: {
                                model: {
                                    stride: {
                                        spoofing: 'Spoofing',
                                        tampering: 'Tampering'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            t: jest.fn(key => key)
        })
    }
}));

// Mock useThreatEditor
jest.mock('@/composables/useThreatEditor.js', () => ({
    useThreatEditor: jest.fn(() => ({
        isEditing: { value: false },
        editingThreat: { value: null },
        isNewThreat: { value: false },
        createNewThreat: jest.fn(),
        editExistingThreat: jest.fn(),
        saveThreat: jest.fn(),
        cancelEdit: jest.fn(),
        deleteThreat: jest.fn()
    }))
}));

// Create test suite for ThreatSuggestDialog
// TODO: Fix these tests to properly work with the Vue 3 Composition API
// Tests now enabled for Vue 3 Composition API
describe('ThreatSuggestDialog', () => {
    // Mock store for all tests
    let store;
    
    beforeEach(() => {
        store = createStore({
            state: {
                cell: {
                    ref: {
                        data: {
                            type: 'tm.Process',
                            threats: []
                        }
                    }
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
            getters: {},
            actions: {},
            mutations: {}
        });
    });
    
    // Test the component with shallow mounting
    describe('Component Structure', () => {
        test('renders the component', () => {
            const wrapper = shallowMount(ThreatSuggestDialog, {
                global: {
                    plugins: [store],
                    stubs: {
                        'b-modal': true,
                        'b-form': true,
                        'b-form-row': true,
                        'b-col': true,
                        'b-form-group': true,
                        'b-form-input': true,
                        'b-form-select': true,
                        'b-form-radio-group': true,
                        'b-button': true
                    }
                }
            });
            
            expect(wrapper.exists()).toBe(true);
            expect(wrapper.find('b-modal-stub').exists()).toBe(true);
        });
    });
    
    // Test computed properties
    describe('computed properties', () => {
        test('statuses computed property returns expected values', async () => {
            // Shallow mount the component
            const wrapper = shallowMount(ThreatSuggestDialog, {
                global: {
                    plugins: [store],
                    stubs: {
                        'b-modal': true,
                        'b-form': true,
                        'b-form-row': true,
                        'b-col': true,
                        'b-form-group': true,
                        'b-form-input': true,
                        'b-form-select': true,
                        'b-form-radio-group': true,
                        'b-button': true
                    }
                }
            });
            
            // In Vue 3 Composition API, computed properties are exposed directly
            // not as functions that need to be called
            const { statuses } = wrapper.vm;
            
            // Verify the computed property returns expected values
            expect(statuses).toEqual([
                { value: 'NotApplicable', text: 'threats.status.notApplicable' },
                { value: 'Open', text: 'threats.status.open' },
                { value: 'Mitigated', text: 'threats.status.mitigated' }
            ]);
        });
        
        test('priorities computed property returns expected values', async () => {
            // Shallow mount the component
            const wrapper = shallowMount(ThreatSuggestDialog, {
                global: {
                    plugins: [store],
                    stubs: {
                        'b-modal': true,
                        'b-form': true,
                        'b-form-row': true,
                        'b-col': true,
                        'b-form-group': true,
                        'b-form-input': true,
                        'b-form-select': true,
                        'b-form-radio-group': true,
                        'b-button': true
                    }
                }
            });
            
            // In Vue 3 Composition API, computed properties are exposed directly
            const { priorities } = wrapper.vm;
            
            // Verify the computed property returns expected values
            expect(priorities).toEqual([
                { value: 'TBD', text: 'threats.priority.tbd' },
                { value: 'Low', text: 'threats.priority.low' },
                { value: 'Medium', text: 'threats.priority.medium' },
                { value: 'High', text: 'threats.priority.high' },
                { value: 'Critical', text: 'threats.priority.critical' }
            ]);
        });
        
        test('modalTitle computed property returns threat number', async () => {
            // Shallow mount the component
            const wrapper = shallowMount(ThreatSuggestDialog, {
                global: {
                    plugins: [store],
                    stubs: {
                        'b-modal': true,
                        'b-form': true,
                        'b-form-row': true,
                        'b-col': true,
                        'b-form-group': true,
                        'b-form-input': true,
                        'b-form-select': true,
                        'b-form-radio-group': true,
                        'b-button': true
                    }
                }
            });
            
            // Access the component setup result
            const { modalTitle } = wrapper.vm;
            
            // Verify the computed property includes the threat number
            expect(modalTitle).toContain('threats.newThreat');
            expect(modalTitle).toContain('6'); // threatTop (5) + 1
        });
    });

    // Test component methods
    describe('component methods', () => {
        let wrapper;
        
        beforeEach(() => {
            // Create wrapper with mocked components
            wrapper = shallowMount(ThreatSuggestDialog, {
                global: {
                    plugins: [store],
                    stubs: {
                        'b-modal': true,
                        'b-form': true,
                        'b-form-row': true,
                        'b-col': true,
                        'b-form-group': true,
                        'b-form-input': true,
                        'b-form-select': true,
                        'b-form-radio-group': true,
                        'b-button': true,
                        'td-safe-form-textarea': true
                    }
                }
            });
            
            // Mock methods and refs using the Composition API approach
            wrapper.vm.editModal = { show: jest.fn(), hide: jest.fn() };
        });
        
        test('hideModal method resets state and hides modal', async () => {
            // Setup initial state
            wrapper.vm.threat = { id: 'test-id' };
            wrapper.vm.suggestions = [{ id: 'suggestion-1' }];
            wrapper.vm.types = ['type1', 'type2'];
            wrapper.vm.index = 2;
            
            // Call the method
            wrapper.vm.hideModal();
            
            // Verify state is reset
            expect(wrapper.vm.threat).toEqual({});
            expect(wrapper.vm.suggestions).toEqual([]);
            expect(wrapper.vm.types).toEqual([]);
            expect(wrapper.vm.index).toBe(0);
            expect(wrapper.vm.editModal.hide).toHaveBeenCalled();
        });
        
        test('next method advances to the next suggestion', async () => {
            // Setup initial state
            wrapper.vm.suggestions = [
                { title: 'Suggestion 1', type: 'Type 1' },
                { title: 'Suggestion 2', type: 'Type 2' }
            ];
            wrapper.vm.threat = { title: 'Suggestion 1', type: 'Type 1' };
            wrapper.vm.index = 0;
            
            // Call the method
            wrapper.vm.next();
            
            // Verify index was incremented and threat updated
            expect(wrapper.vm.index).toBe(1);
            expect(wrapper.vm.threat).toEqual(wrapper.vm.suggestions[1]);
        });
        
        test('next method hides modal when at end of suggestions', async () => {
            // Set up the state to trigger the hideModal call
            wrapper.vm.suggestions = [
                { title: 'Suggestion 1', type: 'Type 1' },
                { title: 'Suggestion 2', type: 'Type 2' }
            ];
            wrapper.vm.threat = { title: 'Suggestion 2', type: 'Type 2' };
            wrapper.vm.index = 1; // Last index (length - 1)
            
            // Call the method - this should trigger hideModal which resets index to 0
            wrapper.vm.next();
            
            // Verify index was reset to 0, which happens in hideModal
            expect(wrapper.vm.index).toBe(0);
        });
        
        test('previous method moves to the previous suggestion', async () => {
            // Setup initial state
            wrapper.vm.suggestions = [
                { title: 'Suggestion 1', type: 'Type 1' },
                { title: 'Suggestion 2', type: 'Type 2' }
            ];
            wrapper.vm.threat = { title: 'Suggestion 2', type: 'Type 2' };
            wrapper.vm.index = 1;
            
            // Call the method
            wrapper.vm.previous();
            
            // Verify index was decremented and threat updated
            expect(wrapper.vm.index).toBe(0);
            expect(wrapper.vm.threat).toEqual(wrapper.vm.suggestions[0]);
        });
        
        test('previous method does nothing at beginning of suggestions', async () => {
            // Setup initial state
            wrapper.vm.suggestions = [
                { title: 'Suggestion 1', type: 'Type 1' },
                { title: 'Suggestion 2', type: 'Type 2' }
            ];
            wrapper.vm.threat = { title: 'Suggestion 1', type: 'Type 1' };
            wrapper.vm.index = 0;
            
            // Call the method
            wrapper.vm.previous();
            
            // Verify state remains unchanged
            expect(wrapper.vm.index).toBe(0);
            expect(wrapper.vm.threat).toEqual(wrapper.vm.suggestions[0]);
        });
    });
    
    // Test the showModal method
    describe('showModal method', () => {
        let wrapper;
        let createNewTypedThreatMock;
        
        beforeEach(() => {
            // Create wrapper with mocked components
            wrapper = shallowMount(ThreatSuggestDialog, {
                global: {
                    plugins: [store],
                    stubs: {
                        'b-modal': true,
                        'b-form': true,
                        'b-form-row': true,
                        'b-col': true,
                        'b-form-group': true,
                        'b-form-input': true,
                        'b-form-select': true,
                        'b-form-radio-group': true,
                        'b-button': true
                    }
                }
            });
            
            // Mock methods and refs
            wrapper.vm.editModal = { show: jest.fn(), hide: jest.fn() };
            
            // Mock createNewTypedThreat
            createNewTypedThreatMock = jest.requireMock('@/service/threats/index.js').createNewTypedThreat;
            
            // Setup accessor for mock function calls
            createNewTypedThreatMock.mockImplementation(() => ({
                title: 'Mock Threat',
                status: 'Open',
                modelType: 'STRIDE'
            }));
            
            // Mock the getThreatTypesByElement to return threat types
            const mockGetThreatTypes = jest.requireMock('@/service/threats/models/index.js').getThreatTypesByElement;
            mockGetThreatTypes.mockReturnValue({
                'threats.model.stride.spoofing': 'Spoofing',
                'threats.model.stride.tampering': 'Tampering'
            });
        });
        
        test('initializes suggestions with type parameter', async () => {
            // Mock the createNewTypedThreat to return a valid threat object
            createNewTypedThreatMock.mockReturnValue({
                title: 'Mock Threat',
                status: 'Open',
                modelType: 'STRIDE',
                type: 'threats.model.stride.spoofing'
            });
            
            // Mock the getThreatTypesByElement to return threat types
            const mockGetThreatTypes = jest.requireMock('@/service/threats/models/index.js').getThreatTypesByElement;
            mockGetThreatTypes.mockReturnValue({
                'threats.model.stride.spoofing': 'Spoofing',
                'threats.model.stride.tampering': 'Tampering'
            });
            
            // Create a new wrapper with properly mocked store
            const localWrapper = shallowMount(ThreatSuggestDialog, {
                global: {
                    plugins: [createStore({
                        state: {
                            cell: {
                                ref: {
                                    data: {
                                        type: 'tm.Process',
                                        threats: []
                                    }
                                }
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
                        }
                    })],
                    stubs: {
                        'b-modal': true,
                        'b-form': true,
                        'b-form-row': true,
                        'b-col': true,
                        'b-form-group': true,
                        'b-form-input': true,
                        'b-form-select': true,
                        'b-form-radio-group': true,
                        'b-button': true
                    }
                }
            });
            
            // Mock the modal ref
            localWrapper.vm.editModal = { show: jest.fn(), hide: jest.fn() };
            
            // Call showModal with 'type' parameter
            localWrapper.vm.showModal('type');
            
            // Verify the index was reset
            expect(localWrapper.vm.index).toBe(0);
            
            // Verify createNewTypedThreat was called with correct parameters
            expect(createNewTypedThreatMock).toHaveBeenCalled();
            
            // Verify modal was shown
            expect(localWrapper.vm.editModal.show).toHaveBeenCalled();
        });
        
        test('initializes suggestions from context generator', async () => {
            // Mock the createNewTypedThreat to return a valid threat object
            createNewTypedThreatMock.mockReturnValue({
                title: 'Mock Threat',
                status: 'Open',
                modelType: 'STRIDE',
                type: 'threats.model.stride.spoofing'
            });
            
            // Mock the getThreatTypesByElement to return threat types
            const mockGetThreatTypes = jest.requireMock('@/service/threats/models/index.js').getThreatTypesByElement;
            mockGetThreatTypes.mockReturnValue({
                'threats.model.stride.spoofing': 'Spoofing',
                'threats.model.stride.tampering': 'Tampering'
            });
            
            // Mock GetContextSuggestions
            const GetContextSuggestionsMock = jest.requireMock('@/service/threats/oats/context-generator.js').GetContextSuggestions;
            GetContextSuggestionsMock.mockReturnValue([
                { title: 'Suggestion 1', type: 'threats.model.stride.spoofing', description: 'Description 1', mitigation: 'Mitigation 1' },
                { title: 'Suggestion 2', type: 'threats.model.stride.tampering', description: 'Description 2', mitigation: 'Mitigation 2' }
            ]);
            
            // Create a new wrapper with properly mocked store
            const localWrapper = shallowMount(ThreatSuggestDialog, {
                global: {
                    plugins: [createStore({
                        state: {
                            cell: {
                                ref: {
                                    data: {
                                        type: 'tm.Process',
                                        threats: []
                                    }
                                }
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
                        }
                    })],
                    stubs: {
                        'b-modal': true,
                        'b-form': true,
                        'b-form-row': true,
                        'b-col': true,
                        'b-form-group': true,
                        'b-form-input': true,
                        'b-form-select': true,
                        'b-form-radio-group': true,
                        'b-button': true
                    }
                }
            });
            
            // Mock the modal ref
            localWrapper.vm.editModal = { show: jest.fn(), hide: jest.fn() };
            
            // Call showModal without 'type' parameter (defaults to using context generator)
            localWrapper.vm.showModal();
            
            // Verify GetContextSuggestions was called
            expect(GetContextSuggestionsMock).toHaveBeenCalled();
            
            // Verify modal was shown
            expect(localWrapper.vm.editModal.show).toHaveBeenCalled();
        });
    });

    // Test the acceptSuggestion method
    describe('acceptSuggestion method', () => {
        let wrapper;
        let storeMock;
        
        beforeEach(() => {
            // Create a mock store with dispatch spy
            storeMock = {
                state: {
                    cell: {
                        ref: {
                            data: {
                                type: 'tm.Process',
                                threats: []
                            }
                        }
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
                dispatch: jest.fn()
            };
            
            // Create wrapper with mocked components and store
            wrapper = shallowMount(ThreatSuggestDialog, {
                global: {
                    plugins: [createStore({...storeMock})],
                    stubs: {
                        'b-modal': true,
                        'b-form': true,
                        'b-form-row': true,
                        'b-col': true,
                        'b-form-group': true,
                        'b-form-input': true,
                        'b-form-select': true,
                        'b-form-radio-group': true,
                        'b-button': true
                    },
                    mocks: {
                        $store: storeMock
                    }
                }
            });
            
            // Setup the cell with threat frequency
            wrapper.vm.cell = {
                data: {
                    type: 'tm.Process',
                    threats: [],
                    hasOpenThreats: false,
                    threatFrequency: {
                        spoofing: 0,
                        tampering: 1
                    }
                }
            };
            
            // Mock threat data
            wrapper.vm.threat = {
                title: 'Test Threat',
                type: 'Spoofing',
                modelType: 'STRIDE',
                number: 0,
                status: 'Open'
            };
            
            // Mock methods
            wrapper.vm.editModal = { show: jest.fn(), hide: jest.fn() };
            wrapper.vm.next = jest.fn();
            
            // Allow dispatch method to be called
            wrapper.vm.$store = {
                dispatch: jest.fn()
            };
        });
        
        test('adds threat to cell and updates store', async () => {
            // Mock Vuex actions are properly spied
            const dispatchSpy = jest.spyOn(wrapper.vm.$store, 'dispatch');
            
            // Setup initial state
            wrapper.vm.cell.data.threats = [];
            wrapper.vm.threat = {
                title: 'Test Threat',
                type: 'Spoofing',
                modelType: 'STRIDE',
                number: 0,
                status: 'Open'
            };
            
            // Call the method
            wrapper.vm.acceptSuggestion();
            
            // Verify store actions were dispatched
            expect(dispatchSpy).toHaveBeenCalledWith(tmActions.update, expect.any(Object));
            expect(dispatchSpy).toHaveBeenCalledWith(tmActions.modified);
            expect(dispatchSpy).toHaveBeenCalledWith(CELL_DATA_UPDATED, expect.any(Object));
            
            // Verify the threat was added to the cell's threats array
            expect(wrapper.vm.cell.data.threats.length).toBeGreaterThan(0);
            expect(wrapper.vm.cell.data.threats[0].title).toBe('Test Threat');
        });
        
        test('creates threatFrequency if missing', async () => {
            // Remove existing threatFrequency
            delete wrapper.vm.cell.data.threatFrequency;
            
            // Set the return value for the frequency map
            threatModels.getFrequencyMapByElement.mockReturnValue({
                spoofing: 0,
                tampering: 0
            });
            
            // Setup initial state
            wrapper.vm.threat = {
                title: 'Test Threat',
                type: 'Spoofing',
                modelType: 'STRIDE',
                number: 0,
                status: 'Open'
            };
            
            // Call the method
            wrapper.vm.acceptSuggestion();
            
            // Verify frequency map was requested
            expect(threatModels.getFrequencyMapByElement).toHaveBeenCalled();
            
            // Verify the threat frequency was created
            expect(wrapper.vm.cell.data.threatFrequency).toBeDefined();
            expect(wrapper.vm.cell.data.threatFrequency).toEqual({
                spoofing: 0,
                tampering: 0
            });
        });
    });
});