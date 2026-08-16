import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';

import { branchClear, branchSelected } from '@/store/actions/branch.js';
import { providerSelected } from '@/store/actions/provider.js';
import { repositoryClear, repositorySelected } from '@/store/actions/repository.js';
import { threatmodelFetchAll } from '@/store/actions/threatmodel.js';
import TdSelectionPage from '@/components/SelectionPage.vue';
import ThreatModelSelect from '@/views/git/ThreatModelSelect.vue';
import { threatmodelClear, threatmodelCreate, threatmodelFetch, threatmodelSelected } from '../../../src/store/actions/threatmodel';


describe('views/ThreatModelSelect.vue', () => {
    const branch = 'aBranch', repo = 'someRepo';
    let wrapper, localVue, mockStore, mockRouter;

    beforeEach(() => {
        console.warn = jest.fn();
        localVue = createLocalVue();
        localVue.use(Vuex);
        mockStore = getMockStore();
    });

    const getLocalVue = (mockRoute) => {
        mockRouter = { push: jest.fn() };
        jest.spyOn(mockStore, 'dispatch');
        wrapper = shallowMount(ThreatModelSelect, {
            localVue,
            store: mockStore,
            mocks: {
                $route: mockRoute,
                $router: mockRouter,
                $t: key => key
            }
        });
    };

    const getMockStore = () => new Vuex.Store({
        state: {
            repo: {
                selected: repo
            },
            branch: {
                selected: branch,
                all: ['b1', 'b2', 'b3']
            },
            provider: {
                selected: 'github'
            },
            threatmodel: {
                all: []
            }
        },
        actions: {
            [branchClear]: () => { },
            [branchSelected]: () => { },
            [providerSelected]: () => { },
            [repositoryClear]: () => { },
            [repositorySelected]: () => { },
            [threatmodelClear]: () => { },
            [threatmodelCreate]: () => { },
            [threatmodelFetch]: () => { },
            [threatmodelFetchAll]: () => { },
            [threatmodelSelected]: () => { }
        }
    });

    describe('mounted', () => {
        it('sets the provider from the route', () => {
            getLocalVue({
                params: {
                    branch,
                    provider: 'local',
                    repository: mockStore.state.repo.selected
                }
            });
            expect(mockStore.dispatch).toHaveBeenCalledWith(providerSelected, 'local');
        });

        it('sets the repo name from the route', () => {
            getLocalVue({
                params: {
                    branch,
                    provider: mockStore.state.provider.selected,
                    repository: 'fakeRepoBad'
                }
            });
            expect(mockStore.dispatch).toHaveBeenCalledWith(repositorySelected, 'fakeRepoBad');
        });

        it('sets the branch from the route', () => {
            getLocalVue({
                params: {
                    branch: 'notTheRightOne',
                    provider: mockStore.state.provider.selected,
                    repository: 'fakeRepoBad'
                }
            });
            expect(mockStore.dispatch).toHaveBeenCalledWith(branchSelected, 'notTheRightOne');
        });
        
        it('fetches the threat models', () => {
            getLocalVue({
                params: {
                    provider: mockStore.state.provider.selected,
                    repository: mockStore.state.repo.selected
                }
            });
            expect(mockStore.dispatch).toHaveBeenCalledWith(threatmodelFetchAll);
        });
    });

    describe('threat models', () => {
        beforeEach(() => {
            getLocalVue({
                params: {
                    branch,
                    provider: mockStore.state.provider.selected,
                    repository: mockStore.state.repo.selected
                }
            });
        });

        it('displays the threat models', () => {
            expect(wrapper.findComponent(TdSelectionPage).exists()).toEqual(true);
        });

        it('displays the translated text', () => {
            expect(wrapper.findComponent(TdSelectionPage).text()).toContain('threatmodelSelect.select');
        });
    });

    describe('selectRepoClick', () => {
        beforeEach(() => {
            getLocalVue({
                params: {
                    provider: mockStore.state.provider.selected,
                    repository: mockStore.state.repo.selected
                }
            });
            wrapper.vm.selectRepoClick();
        });

        it('clears the selected repo', () => {
            expect(mockStore.dispatch).toHaveBeenCalledWith(repositoryClear);
        });

        it('navigates to the repo select page', () => {
            expect(mockRouter.push).toHaveBeenCalledWith({ name: 'gitRepository', params: { provider: 'github' } });
        });
    });

    describe('selectBranchClick', () => {
        beforeEach(() => {
            getLocalVue({
                params: {
                    provider: mockStore.state.provider.selected,
                    repository: mockStore.state.repo.selected
                }
            });
            wrapper.vm.selectBranchClick();
        });

        it('clears the selected branch', () => {
            expect(mockStore.dispatch).toHaveBeenCalledWith(branchClear);
        });

        it('navigates to the branch select page', () => {
            expect(mockRouter.push).toHaveBeenCalledWith({
                name: 'gitBranch',
                params: {
                    provider: mockStore.state.provider.selected,
                    repository: mockStore.state.repo.selected
                }
            });
        });
    });

    describe('onThreatModelClick', () => {
        const tm = 'foobar';

        beforeEach(() => {
            getLocalVue({
                params: {
                    provider: mockStore.state.provider.selected,
                    repository: mockStore.state.repo.selected
                }
            });
            wrapper.vm.onThreatmodelClick(tm);
        });

        it('sets the selected threat model', () => {
            expect(mockStore.dispatch).toHaveBeenCalledWith(threatmodelFetch, tm);
        });

        it('navigates to the threat model page', () => {
            expect(mockRouter.push).toHaveBeenCalledWith({
                name: 'gitThreatModel',
                params: {
                    provider: mockStore.state.provider.selected,
                    repository: mockStore.state.repo.selected,
                    threatmodel: tm
                }
            });
        });
    });

    describe('new threat model', () => {
        beforeEach(() => {
            getLocalVue({
                params: {
                    provider: mockStore.state.provider.selected,
                    repository: mockStore.state.repo.selected,
                    branch : mockStore.state.branch.selected
                }
            });
            wrapper.vm.newThreatModel();
        });

        it('navigates to the new threat model page', () => {
            expect(mockRouter.push).toHaveBeenCalledWith({
                name: `${wrapper.vm.providerType}NewThreatModel`,
                params: {
                    provider: mockStore.state.provider.selected,
                    repository: mockStore.state.repo.selected,
                    branch: mockStore.state.branch.selected
                }
            });
        });
    });
});
