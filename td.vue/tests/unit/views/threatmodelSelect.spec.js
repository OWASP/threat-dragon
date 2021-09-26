import { BootstrapVue, BContainer, BJumbotron, BListGroup, BListGroupItem } from 'bootstrap-vue';
import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import { BRANCH_CLEAR, BRANCH_SELECTED } from '@/store/actions/branch.js';
import { PROVIDER_SELECTED } from '@/store/actions/provider.js';
import { REPOSITORY_CLEAR, REPOSITORY_SELECTED } from '@/store/actions/repository.js';
import { THREATMODEL_FETCH_ALL, THREATMODEL_SELECTED } from '@/store/actions/threatmodel.js';
import ThreatmodelSelect from '@/views/ThreatModelSelect.vue';

describe('ThreatmodelSelect.vue', () => {
    const repo = 'repo';
    const branch = 'branch';
    const provider = 'github';
    const threatModels = ['tm1', 'tm2'];
    let wrapper, localVue, mockStore, router;

    describe('without matching route params', () => {
        beforeEach(() => {
            localVue = createLocalVue();
            localVue.use(BootstrapVue);
            localVue.use(Vuex);
            mockStore = new Vuex.Store({
                state: {
                    branch: { selected: branch },
                    provider: { selected: provider },
                    repo: { selected: repo },
                    threatmodel: { all: threatModels }
                },
                actions: {
                    [BRANCH_SELECTED]: () => { },
                    [PROVIDER_SELECTED]: () => { },
                    [REPOSITORY_SELECTED]: () => { },
                    [THREATMODEL_FETCH_ALL]: () => { }
                }
            });
            jest.spyOn(mockStore, 'dispatch');
            wrapper = mount(ThreatmodelSelect, {
                localVue,
                store: mockStore,
                mocks: {
                    $t: key => key,
                    $route: {
                        params: {
                            branch: 'fakeBranch',
                            provider: 'fakeProvider',
                            repository: 'fakeRepo'
                        }
                    }
                }
            });
        });

        it('sets the branch', () => {
            expect(mockStore.dispatch).toHaveBeenCalledWith(BRANCH_SELECTED, 'fakeBranch');
        });

        it('sets the provider', () => {
            expect(mockStore.dispatch).toHaveBeenCalledWith(PROVIDER_SELECTED, 'fakeProvider');
        });

        it('sets the repo name', () => {
            expect(mockStore.dispatch).toHaveBeenCalledWith(REPOSITORY_SELECTED, 'fakeRepo');
        });
    });

    describe('with matching route params', () => {
        beforeEach(() => {
            localVue = createLocalVue();
            localVue.use(BootstrapVue);
            localVue.use(Vuex);
            mockStore = new Vuex.Store({
                state: {
                    branch: { selected: branch },
                    provider: { selected: provider },
                    repo: { selected: repo },
                    threatmodel: { all: threatModels }
                },
                actions: {
                    [BRANCH_CLEAR]: () => { },
                    [REPOSITORY_CLEAR]: () => { },
                    [THREATMODEL_FETCH_ALL]: () => { },
                    [THREATMODEL_SELECTED]: () => { }
                }
            });
            jest.spyOn(mockStore, 'dispatch');
            router = { push: jest.fn() };
            wrapper = mount(ThreatmodelSelect, {
                localVue,
                store: mockStore,
                mocks: {
                    $t: key => key,
                    $route: {
                        params: {
                            branch,
                            provider,
                            repository: repo
                        }
                    },
                    $router: router
                }
            });
        });

        it('loads the threatmodels', () => {
            expect(mockStore.dispatch).toHaveBeenCalledWith(THREATMODEL_FETCH_ALL);
        });

        describe('layout', () => {
            it('renders the branch view', () => {
                expect(wrapper.exists()).toBe(true);
            });

            it('has a b-container', () => {
                expect(wrapper.findComponent(BContainer).exists()).toBe(true);
            });

            it('has a jumbotron with instructions', () => {
                expect(wrapper.findComponent(BJumbotron).text()).toContain('threatmodelSelect.from');
            });

            it('uses a b-list-group', () => {
                expect(wrapper.findComponent(BListGroup).exists()).toBe(true);
            });

            it('lists the branches', () => {
                expect(wrapper.findAllComponents(BListGroupItem).length).toBeGreaterThan(1);
            });
        });

        describe('going back to repo page', () => {
            it('dispatches the repository_clear event', async () => {
                await wrapper.find('#return-to-repo').trigger('click');
                expect(mockStore.dispatch).toHaveBeenCalledWith(REPOSITORY_CLEAR);
            });

            it('navigates to the repository view', async () => {
                await wrapper.find('#return-to-repo').trigger('click');
                expect(router.push).toHaveBeenCalledWith({
                    name: 'gitRepository',
                    params: { provider }
                });
            });
        });

        describe('going back to branch page', () => {
            it('dispatches the branch_clear event', async () => {
                await wrapper.find('#return-to-branch').trigger('click');
                expect(mockStore.dispatch).toHaveBeenCalled();
            });

            it('navigates to the branch view', async () => {
                jest.spyOn(router, 'push');
                await wrapper.find('#return-to-branch').trigger('click');
                expect(router.push).toHaveBeenCalledWith({
                    name: 'gitBranch',
                    params: {
                        provider,
                        repository: repo
                    }
                });
            });
        });

        describe('selecting a threat model', () => {
            it('dispatches the threatmodel_selected event', async () => {
                await wrapper.findComponent(BListGroupItem).trigger('click');
                expect(mockStore.dispatch).toHaveBeenCalledWith(THREATMODEL_SELECTED, 'tm1');
            });

            it('navigates to the threatmodel view', async () => {
                await wrapper.findComponent(BListGroupItem).trigger('click');
                expect(router.push).toHaveBeenCalledWith({
                    name: 'gitThreatModel',
                    params: {
                        branch,
                        provider,
                        repository: repo,
                        threatmodel: threatModels[0]
                    }
                });
            });
        });
    });
});