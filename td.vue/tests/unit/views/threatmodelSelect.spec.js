import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';

import { BRANCH_CLEAR, BRANCH_SELECTED } from '@/store/actions/branch.js';
import { PROVIDER_SELECTED } from '@/store/actions/provider.js';
import { REPOSITORY_CLEAR, REPOSITORY_SELECTED } from '@/store/actions/repository.js';
import { THREATMODEL_FETCH_ALL } from '@/store/actions/threatmodel.js';
import TdSelectionPage from '@/components/SelectionPage.vue';
import ThreatModelSelect from '@/views/git/ThreatModelSelect.vue';
import { THREATMODEL_CLEAR, THREATMODEL_CREATE, THREATMODEL_FETCH, THREATMODEL_SELECTED } from '../../../src/store/actions/threatmodel';


describe('views/ThreatModelSelect.vue', () => {
    const branch = 'aBranch', repo = 'someRepo';
    let wrapper, localVue, mockStore, mockRouter;

    beforeEach(() => {
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
            [BRANCH_CLEAR]: () => { },
            [BRANCH_SELECTED]: () => { },
            [PROVIDER_SELECTED]: () => { },
            [REPOSITORY_CLEAR]: () => { },
            [REPOSITORY_SELECTED]: () => { },
            [THREATMODEL_CLEAR]: () => { },
            [THREATMODEL_CREATE]: () => { },
            [THREATMODEL_FETCH]: () => { },
            [THREATMODEL_FETCH_ALL]: () => { },
            [THREATMODEL_SELECTED]: () => { }
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
            expect(mockStore.dispatch).toHaveBeenCalledWith(PROVIDER_SELECTED, 'local');
        });

        it('sets the repo name from the route', () => {
            getLocalVue({
                params: {
                    branch,
                    provider: mockStore.state.provider.selected,
                    repository: 'fakeRepoBad'
                }
            });
            expect(mockStore.dispatch).toHaveBeenCalledWith(REPOSITORY_SELECTED, 'fakeRepoBad');
        });

        it('sets the branch from the route', () => {
            getLocalVue({
                params: {
                    branch: 'notTheRightOne',
                    provider: mockStore.state.provider.selected,
                    repository: 'fakeRepoBad'
                }
            });
            expect(mockStore.dispatch).toHaveBeenCalledWith(BRANCH_SELECTED, 'notTheRightOne');
        });
        
        it('fetches the threat models', () => {
            getLocalVue({
                params: {
                    provider: mockStore.state.provider.selected,
                    repository: mockStore.state.repo.selected
                }
            });
            expect(mockStore.dispatch).toHaveBeenCalledWith(THREATMODEL_FETCH_ALL);
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
            expect(mockStore.dispatch).toHaveBeenCalledWith(REPOSITORY_CLEAR);
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
            expect(mockStore.dispatch).toHaveBeenCalledWith(BRANCH_CLEAR);
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
            expect(mockStore.dispatch).toHaveBeenCalledWith(THREATMODEL_FETCH, tm);
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
                    repository: mockStore.state.repo.selected
                }
            });
            wrapper.vm.newThreatModel();
        });

        it('clears the threat model', () => {
            expect(mockStore.dispatch).toHaveBeenCalledWith(THREATMODEL_CLEAR);
        });

        it('creates the threat model', () => {
            expect(mockStore.dispatch).toHaveBeenCalledWith(THREATMODEL_CREATE, expect.anything()); 
        });

        it('navigates to the edit page', () => {
            expect(mockRouter.push).toHaveBeenCalledWith({
                name: 'gitThreatModelEdit',
                params: {
                    provider: mockStore.state.provider.selected,
                    repository: mockStore.state.repo.selected,
                    threatmodel: 'New Threat Model'
                }
            });
        });
    });
});
