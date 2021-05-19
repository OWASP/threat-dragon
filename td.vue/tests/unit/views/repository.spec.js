import { BootstrapVue, BContainer, BJumbotron, BListGroup, BListGroupItem } from 'bootstrap-vue';
import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import { PROVIDER_SELECTED } from '@/store/actions/provider.js';
import Repository from '@/views/git/Repository.vue';
import { REPOSITORY_FETCH, REPOSITORY_SELECTED } from '@/store/actions/repository.js';

describe('Repository.vue', () => {
    let wrapper, localVue, mockStore, router;

    describe('without matching route params', () => {
        beforeEach(() => {
            localVue = createLocalVue();
            localVue.use(BootstrapVue);
            localVue.use(Vuex);
            mockStore = new Vuex.Store({
                state: {
                    provider: {
                        selected: 'github'
                    },
                    repo: {
                        all: ['repo1', 'repo2']
                    }
                },
                actions: {
                    [PROVIDER_SELECTED]: () => { },
                    [REPOSITORY_FETCH]: () => { },
                    [REPOSITORY_SELECTED]: () => { }
                }
            });
            jest.spyOn(mockStore, 'dispatch');
            wrapper = mount(Repository, {
                localVue,
                store: mockStore,
                mocks: {
                    $route: {
                        params: {
                            provider: 'fakeProvider'
                        }
                    }
                }
            });
        });

        it('sets the provider based on the url param', () => {
            expect(mockStore.dispatch).toHaveBeenCalledWith(PROVIDER_SELECTED, 'fakeProvider');
        });
    });

    describe('with matching route params', () => {

        beforeEach(() => {
            localVue = createLocalVue();
            localVue.use(BootstrapVue);
            localVue.use(Vuex);
            mockStore = new Vuex.Store({
                state: {
                    provider: {
                        selected: 'github'
                    },
                    repo: {
                        all: ['repo1', 'repo2']
                    }
                },
                actions: {
                    [REPOSITORY_FETCH]: () => { },
                    [REPOSITORY_SELECTED]: () => { }
                }
            });
            jest.spyOn(mockStore, 'dispatch');
            router = { push: jest.fn() };
            wrapper = mount(Repository, {
                localVue,
                store: mockStore,
                mocks: {
                    $route: {
                        params: {
                            provider: mockStore.state.provider.selected
                        }
                    },
                    $router: router
                }
            });
        });

        it('fetches the repos', () => {
            expect(mockStore.dispatch).toHaveBeenCalledWith(REPOSITORY_FETCH);
        });

        describe('layout', () => {
            it('renders the repository view', () => {
                expect(wrapper.exists()).toBe(true);
            });

            it('has a b-container', () => {
                expect(wrapper.findComponent(BContainer).exists()).toBe(true);
            });

            it('has a jumbotron with instructions', () => {
                expect(wrapper.findComponent(BJumbotron).text()).toContain('from the list below');
            });

            it('uses a b-list-group', () => {
                expect(wrapper.findComponent(BListGroup).exists()).toBe(true);
            });

            it('lists the repositories', () => {
                expect(wrapper.findAllComponents(BListGroupItem).length).toBeGreaterThan(1);
            });
        });

        describe('selecting a repo', () => {
            it('dispatches the repository_selected event', async () => {
                await wrapper.findComponent(BListGroupItem).trigger('click');
                expect(mockStore.dispatch).toHaveBeenCalledWith(REPOSITORY_SELECTED, expect.anything());
            });

            it('navigates to the branch view', async () => {
                jest.spyOn(router, 'push');
                await wrapper.findComponent(BListGroupItem).trigger('click');
                expect(router.push).toHaveBeenCalledWith({
                    name: 'gitBranch',
                    params: {
                        provider: mockStore.state.provider.selected,
                        repository: mockStore.state.repo.all[0]
                    }
                });
            });
        });
    });
});