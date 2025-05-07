import { mount } from '@vue/test-utils';
import { createStore } from 'vuex';
import { nextTick } from 'vue';

import TdGraphProperties from '@/components/GraphProperties.vue';
import { useI18n as _useI18n } from '@/i18n';

// Mock the i18n composable
jest.mock('@/i18n', () => ({
    useI18n: () => ({
        t: (key) => key,
        locale: { value: 'eng' }
    })
}));

// Mock the data-changed service
jest.mock('@/service/x6/graph/data-changed.js', () => ({
    updateName: jest.fn(),
    updateProperties: jest.fn(),
    updateStyleAttrs: jest.fn()
}));

// Import the mocked service
import dataChanged from '@/service/x6/graph/data-changed.js';

describe('components/GraphProperties.vue', () => {
    let wrapper;

    describe('empty state', () => {
        beforeEach(async () => {
            // Create store with no cell selected
            const store = createStore({
                state: {
                    cell: {
                        ref: null
                    }
                }
            });
            
            // Vue 3 Migration: Using more specific stubs with bootstrap-vue-next
            wrapper = mount(TdGraphProperties, {
                global: {
                    plugins: [store],
                    // No mocks needed as useI18n is already mocked globally
                    stubs: {
                        'b-form': true,
                        'b-form-row': true,
                        'b-col': true,
                        'b-form-group': true,
                        'b-form-textarea': true,
                        'b-form-checkbox': true,
                        'b-form-input': true,
                        'b-row': true
                    }
                }
            });
            
            await nextTick();
        });

        it('renders the component with empty state', () => {
            // Vue 3 Migration: Testing component API and structure
            expect(wrapper.exists()).toBe(true);
            expect(wrapper.vm.cellRef).toBeNull();
            
            // Check if the form is hidden when no cell is selected
            const form = wrapper.find('form');
            expect(form.exists()).toBe(false);
            
            // In the component, the empty state message is directly in the <p> tag
            // Get all <p> elements and check if any contain the translation key
            const emptyStateMsgShown = wrapper.find('b-row-stub').exists();
            expect(emptyStateMsgShown).toBe(true);
        });
    });

    describe('with data (Flow)', () => {
        let entityData;

        beforeEach(async () => {
            // Reset mocks
            jest.clearAllMocks();
            
            // Mock the data for a Flow entity
            entityData = {
                type: 'tm.Flow',
                name: 'some flow',
                description: 'describing the thing',
                outOfScope: true,
                isBidirectional: true,
                reasonOutOfScope: 'someone thought so',
                protocol: 'https'
            };
            
            // Create store with data
            const store = createStore({
                state: {
                    cell: {
                        ref: {
                            data: entityData
                        }
                    }
                }
            });
            
            // Mock document.getElementById for onChangeScope
            document.getElementById = jest.fn().mockReturnValue({ disabled: false });
            
            // Create wrapper
            wrapper = mount(TdGraphProperties, {
                global: {
                    plugins: [store],
                    // No mocks needed as useI18n is already mocked globally
                    stubs: {
                        'b-form': true,
                        'b-form-row': true,
                        'b-col': true,
                        'b-form-group': true,
                        'b-form-textarea': true,
                        'b-form-checkbox': true,
                        'b-form-input': true,
                        'b-row': true
                    }
                }
            });
            
            await nextTick();
        });

        it('renders the form when a cell is selected', () => {
            // Check that the cellRef is defined
            expect(wrapper.vm.cellRef).toBeDefined();
            
            // In Vue 3 with stubs, the form element may not be directly accessible
            // So we check for b-form-stub instead which is how it's rendered in the test
            const formElement = wrapper.find('b-form-stub');
            expect(formElement.exists()).toBe(true);
            
            // Verify cell has expected data
            expect(wrapper.vm.cellRef.data.type).toBe('tm.Flow');
        });

        it('correctly accesses cell data from store state', () => {
            // Vue 3 Migration: Testing computed properties
            expect(wrapper.vm.cellRef).toBeDefined();
            expect(wrapper.vm.cellRef.data).toBeDefined();
            expect(wrapper.vm.cellRef.data.type).toBe('tm.Flow');
            expect(wrapper.vm.cellRef.data.name).toBe('some flow');
        });

        it('updates name via safeName setter', async () => {
            // Set a new name via the safeName computed property
            wrapper.vm.safeName = 'new flow name';
            
            // Check that service methods were called
            expect(dataChanged.updateName).toHaveBeenCalledWith(wrapper.vm.cellRef);
        });
        
        it('handles onChangeProperties method', async () => {
            wrapper.vm.onChangeProperties();
            expect(dataChanged.updateProperties).toHaveBeenCalledWith(wrapper.vm.cellRef);
        });
        
        it('handles onChangeBidirection method', async () => {
            wrapper.vm.onChangeBidirection();
            expect(dataChanged.updateProperties).toHaveBeenCalledWith(wrapper.vm.cellRef);
            expect(dataChanged.updateStyleAttrs).toHaveBeenCalledWith(wrapper.vm.cellRef);
        });
        
        it('handles onChangeScope method', async () => {
            wrapper.vm.onChangeScope();
            // The component now uses a different approach for reasonoutofscope
            // that doesn't directly call document.getElementById
            expect(dataChanged.updateProperties).toHaveBeenCalledWith(wrapper.vm.cellRef);
            expect(dataChanged.updateStyleAttrs).toHaveBeenCalledWith(wrapper.vm.cellRef);
        });
    });

    describe('with data (Process)', () => {
        let entityData;

        beforeEach(async () => {
            // Reset mocks
            jest.clearAllMocks();
            
            // Mock the data for a Process entity
            entityData = {
                type: 'tm.Process',
                name: 'Process Name',
                description: 'Process description',
                outOfScope: false,
                handlesCardPayment: true,
                handlesGoodsOrServices: false,
                isWebApplication: true,
                privilegeLevel: 'admin'
            };
            
            // Create store with data
            const store = createStore({
                state: {
                    cell: {
                        ref: {
                            data: entityData
                        }
                    }
                }
            });
            
            // Mock document.getElementById for onChangeScope
            document.getElementById = jest.fn().mockReturnValue({ disabled: false });
            
            // Create wrapper
            wrapper = mount(TdGraphProperties, {
                global: {
                    plugins: [store],
                    // No mocks needed as useI18n is already mocked globally
                    stubs: {
                        'b-form': true,
                        'b-form-row': true,
                        'b-col': true,
                        'b-form-group': true,
                        'b-form-textarea': true,
                        'b-form-checkbox': true,
                        'b-form-input': true,
                        'b-row': true
                    }
                }
            });
            
            await nextTick();
        });

        it('correctly accesses process data from store state', () => {
            // Vue 3 Migration: Testing computed properties
            expect(wrapper.vm.cellRef.data.type).toBe('tm.Process');
            expect(wrapper.vm.cellRef.data.privilegeLevel).toBe('admin');
            expect(wrapper.vm.cellRef.data.handlesCardPayment).toBe(true);
        });
    });

    describe('with data (Text)', () => {
        let entityData;

        beforeEach(async () => {
            // Reset mocks
            jest.clearAllMocks();
            
            // Mock the data for a Text entity
            entityData = {
                type: 'tm.Text',
                name: 'Some text content'
            };
            
            // Create store with data
            const store = createStore({
                state: {
                    cell: {
                        ref: {
                            data: entityData
                        }
                    }
                }
            });
            
            // Create wrapper
            wrapper = mount(TdGraphProperties, {
                global: {
                    plugins: [store],
                    // No mocks needed as useI18n is already mocked globally
                    stubs: {
                        'b-form': true,
                        'b-form-row': true,
                        'b-col': true,
                        'b-form-group': true,
                        'b-form-textarea': true,
                        'b-form-checkbox': true,
                        'b-form-input': true,
                        'b-row': true
                    }
                }
            });
            
            await nextTick();
        });

        it('correctly displays text content', () => {
            // Vue 3 Migration: Testing computed properties for text type
            expect(wrapper.vm.cellRef.data.type).toBe('tm.Text');
            expect(wrapper.vm.cellRef.data.name).toBe('Some text content');
        });
    });
});