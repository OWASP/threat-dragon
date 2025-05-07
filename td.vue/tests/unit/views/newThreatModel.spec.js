import { mount } from '@vue/test-utils';
import { createStore } from 'vuex';
import { nextTick } from 'vue';

import NewThreatModel from '@/views/NewThreatModel.vue';
import { THREATMODEL_CLEAR, THREATMODEL_SELECTED, THREATMODEL_UPDATE, THREATMODEL_NOT_MODIFIED } from '@/store/actions/threatmodel.js';
import { createI18n } from 'vue-i18n';

describe('NewThreatModel.vue', () => {
    let wrapper, mockStore, router, i18n;

    // Create a simple i18n instance for testing
    const createI18nInstance = () => {
        return createI18n({
            legacy: false,
            locale: 'eng',
            messages: {
                eng: {
                    threatmodel: {
                        title: 'Title',
                        owner: 'Owner',
                        description: 'Description',
                        reviewer: 'Reviewer',
                        new: {
                            title: 'Create New Threat Model',
                            description: 'Enter information about your new threat model'
                        },
                        placeholder: {
                            title: 'Threat Model Title',
                            owner: 'Owner Name or Team',
                            description: 'Enter a high-level description of the system being modeled',
                            reviewer: 'Reviewer Name'
                        },
                        buttons: {
                            save: 'Save'
                        }
                    },
                    forms: {
                        save: 'Save'
                    }
                }
            }
        });
    };

    describe('local provider', () => {
        beforeEach(async () => {
            router = { push: jest.fn() };
            
            // We need to explicitly mock the dispatch method to verify calls
            const dispatchMock = jest.fn();
            
            // Create store 
            mockStore = createStore({
                state: {
                    provider: { selected: 'local' },
                    packageBuildVersion: '1.0.0'
                },
                actions: {
                    [THREATMODEL_CLEAR]: jest.fn(),
                    [THREATMODEL_SELECTED]: jest.fn(),
                    [THREATMODEL_UPDATE]: jest.fn(),
                    [THREATMODEL_NOT_MODIFIED]: jest.fn()
                }
            });
            
            // Replace the dispatch with our mock
            mockStore.dispatch = dispatchMock;
            
            // Create i18n instance
            i18n = createI18nInstance();
            
            // Create wrapper using direct mount for simplicity
            // This might be cleaner until we solve potential issues with createWrapper
            wrapper = mount(NewThreatModel, {
                global: {
                    plugins: [mockStore, i18n],
                    mocks: {
                        $router: router,
                        $route: {
                            params: { foo: 'bar' }
                        }
                    },
                    stubs: {
                        transition: false,
                        'router-view': true
                    }
                }
            });
            
            // Wait for component to initialize
            await nextTick();
            
            // Set up a default title for assertions
            wrapper.vm.threatModel.summary.title = 'New Threat Model';
            
            // Dispatch threatmodel_selected and execute the save model function
            // This simulates the user submitting the form
            wrapper.vm.saveModel();
        });

        it('clears the current threat model', () => {
            expect(mockStore.dispatch).toHaveBeenCalledWith(THREATMODEL_CLEAR);
        });

        it('selects the new threatModel', () => {
            expect(mockStore.dispatch).toHaveBeenCalledWith(THREATMODEL_SELECTED, expect.anything());
        });

        it('navigates to the edit page', () => {
            expect(router.push).toHaveBeenCalledWith({
                name: 'localThreatModelEdit',
                params: {
                    foo: 'bar',
                    threatmodel: 'New Threat Model'
                }
            });
        });
    });

    describe('git provider', () => {
        beforeEach(async () => {
            router = { push: jest.fn() };
            
            // We need to explicitly mock the dispatch method to verify calls
            const dispatchMock = jest.fn();
            
            // Create store 
            mockStore = createStore({
                state: {
                    provider: { selected: 'github' },
                    packageBuildVersion: '1.0.0'
                },
                actions: {
                    [THREATMODEL_CLEAR]: jest.fn(),
                    [THREATMODEL_SELECTED]: jest.fn(),
                    [THREATMODEL_UPDATE]: jest.fn(),
                    [THREATMODEL_NOT_MODIFIED]: jest.fn()
                }
            });
            
            // Replace the dispatch with our mock
            mockStore.dispatch = dispatchMock;
            
            // Create i18n instance
            i18n = createI18nInstance();
            
            // Create wrapper using direct mount for simplicity
            wrapper = mount(NewThreatModel, {
                global: {
                    plugins: [mockStore, i18n],
                    mocks: {
                        $router: router,
                        $route: {
                            params: { foo: 'bar' }
                        }
                    },
                    stubs: {
                        transition: false,
                        'router-view': true
                    }
                }
            });
            
            // Wait for component to initialize
            await nextTick();
            
            // Set up a default title for assertions
            wrapper.vm.threatModel.summary.title = 'New Threat Model';
            
            // Dispatch threatmodel_selected and execute the save model function
            // This simulates the user submitting the form
            wrapper.vm.saveModel();
        });

        it('clears the current threat model', () => {
            expect(mockStore.dispatch).toHaveBeenCalledWith(THREATMODEL_CLEAR);
        });

        it('selects the new threatModel', () => {
            expect(mockStore.dispatch).toHaveBeenCalledWith(THREATMODEL_SELECTED, expect.anything());
        });

        it('navigates to the edit page for creation', () => {
            expect(router.push).toHaveBeenCalledWith({
                name: 'gitThreatModelCreate',
                params: {
                    foo: 'bar',
                    threatmodel: 'New Threat Model'
                }
            });
        });
    });
});
