import { BootstrapVue, BContainer, BJumbotron, BListGroup, BListGroupItem } from 'bootstrap-vue';
import { mount, createLocalVue, config } from '@vue/test-utils';
import VueI18n from 'vue-i18n';
import Vuex from 'vuex';

import Branch from '@/views/git/Branch.vue';
import { BRANCH_FETCH, BRANCH_SELECTED } from '@/store/actions/branch.js';
import i18nFactory from '@/i18n/index.js';
import { PROVIDER_SELECTED } from '@/store/actions/provider.js';
import { REPOSITORY_CLEAR, REPOSITORY_SELECTED } from '@/store/actions/repository.js';

config.mocks.$t = key => key;

xdescribe('views/Branch.vue', () => {
    const repo = 'someRepo';
    let wrapper, localVue, mockStore;

    describe('with matching route params', () => {
        beforeEach(async () => {
            localVue = createLocalVue();
            localVue.use(BootstrapVue);
            localVue.use(Vuex);
            localVue.use(VueI18n);
            mockStore = new Vuex.Store({
                state: {
                    repo: {
                        selected: repo
                    },
                    branch: {
                        selected: 'someBranch',
                        all: ['b1', 'b2', 'b3']
                    },
                    provider: {
                        selected: 'github'
                    }
                },
                actions: {
                    [BRANCH_FETCH]: () => { },
                    [BRANCH_SELECTED]: () => { },
                    [PROVIDER_SELECTED]: () => { },
                    [REPOSITORY_CLEAR]: () => { },
                    [REPOSITORY_SELECTED]: () => { }
                }
            });
            jest.spyOn(mockStore, 'dispatch');
            wrapper = mount(Branch, {
                localVue,
                i18n: i18nFactory.get(),
                store: mockStore,
                mocks: {
                    $route: {
                        params: {
                            provider: mockStore.state.provider.selected,
                            repository: mockStore.state.repo.selected
                        }
                    }
                }
            });
        });

        describe('setting state based on url', () => {
            it('should not the provider or repo name', () => {
                expect(mockStore.dispatch).not.toHaveBeenCalledWith(PROVIDER_SELECTED, expect.anything());
            });

            it('should set the repoName', () => {
                expect(mockStore.dispatch).not.toHaveBeenCalledWith(REPOSITORY_SELECTED, expect.anything());
            });
        });
    });

    describe('without matching route params', () => {
        let router;
        
        beforeEach(() => {
            localVue = createLocalVue();
            localVue.use(BootstrapVue);
            localVue.use(Vuex);
            localVue.use(VueI18n);
            mockStore = new Vuex.Store({
                state: {
                    repo: {
                        selected: repo
                    },
                    branch: {
                        selected: 'someBranch',
                        all: ['b1', 'b2', 'b3']
                    },
                    provider: {
                        selected: 'github'
                    }
                },
                actions: {
                    [BRANCH_FETCH]: () => { },
                    [BRANCH_SELECTED]: () => { },
                    [PROVIDER_SELECTED]: () => { },
                    [REPOSITORY_CLEAR]: () => { },
                    [REPOSITORY_SELECTED]: () => { }
                }
            });
            jest.spyOn(mockStore, 'dispatch');
            router = {
                push: jest.fn()
            };
            wrapper = mount(Branch, {
                localVue,
                i18n: i18nFactory.get(),
                store: mockStore,
                mocks: {
                    $route: {
                        params: {
                            provider: 'fakeProvider',
                            repository: 'fakeRepo',
                        }
                    },
                    $router: router
                }
            });
        });

        it('fetches the branches', () => {
            expect(mockStore.dispatch).toHaveBeenCalledWith(BRANCH_FETCH);
        });

        describe('layout', () => {
            it('renders the branch view', () => {
                expect(wrapper.exists()).toBe(true);
            });

            it('has a b-container', () => {
                expect(wrapper.findComponent(BContainer).exists()).toBe(true);
            });

            it('has a jumbotron with instructions', () => {
                expect(wrapper.findComponent(BJumbotron).text()).toContain('branch.from');
            });

            describe('repo link', () => {
                it('has a link to the repository', () => {
                    expect(wrapper.find('#repo_link').text()).toEqual(repo);
                });

                it('sets the expected href', () => {
                    const expectedHref = `https://www.github.com/${repo}`;
                    expect(wrapper.find('#repo_link').attributes('href')).toEqual(expectedHref);
                });

                it('targets _blank', () => {
                    expect(wrapper.find('#repo_link').attributes('target')).toEqual('_blank');
                });
            });

            it('uses a b-list-group', () => {
                expect(wrapper.findComponent(BListGroup).exists()).toBe(true);
            });

            it('lists the branches', () => {
                expect(wrapper.findAllComponents(BListGroupItem).length).toBeGreaterThan(1);
            });
        });

        describe('select another repo', () => {
            it('dispatches the repository_clear event', async () => {
                await wrapper.find('#return-to-repo').trigger('click');
                expect(mockStore.dispatch).toHaveBeenCalledWith(REPOSITORY_CLEAR);
            });

            it('navigates to the repository view', async () => {
                await wrapper.find('#return-to-repo').trigger('click');
                expect(router.push).toHaveBeenCalledWith({ name: 'gitRepository' });
            });
        });

        describe('select a branch', () => {
            it('dispatches the repository_selected event', async () => {
                await wrapper.findComponent(BListGroupItem).trigger('click');
                expect(mockStore.dispatch).toHaveBeenCalledWith(BRANCH_SELECTED, 'b1');
            });

            it('navigates to the branch view', async () => {
                jest.spyOn(router, 'push');
                await wrapper.findComponent(BListGroupItem).trigger('click');
                expect(router.push).toHaveBeenCalledWith({
                    name: 'gitThreatModelSelect',
                    params: {
                        branch: mockStore.state.branch.all[0],
                        provider: mockStore.state.provider.selected,
                        repository: repo
                    }
                });
            });
        });

        describe('setting state based on url', () => {
            it('should set the provider', () => {
                expect(mockStore.dispatch).toHaveBeenCalledWith(PROVIDER_SELECTED, 'fakeProvider');
            });

            it('should set the repoName', () => {
                expect(mockStore.dispatch).toHaveBeenCalledWith(REPOSITORY_SELECTED, 'fakeRepo');
            });
        });
    });
});
