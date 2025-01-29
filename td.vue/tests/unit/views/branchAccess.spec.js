import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';

import BranchAccess from '@/views/git/BranchAccess.vue';
import { BRANCH_FETCH, BRANCH_SELECTED } from '@/store/actions/branch.js';
import { PROVIDER_SELECTED } from '@/store/actions/provider.js';
import { REPOSITORY_CLEAR, REPOSITORY_SELECTED } from '@/store/actions/repository.js';
import TdSelectionPage from '@/components/SelectionPage.vue';
import AddBranchDialog from '@/components/AddBranchDialog.vue';


describe('views/BranchAccess.vue', () => {
    const repo = 'someRepo';
    let wrapper, localVue, mockStore, mockRouter;

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(Vuex);
        mockStore = getMockStore();
    });

    const getLocalVue = (mockRoute) => {
        mockRouter = { push: jest.fn() };
        jest.spyOn(mockStore, 'dispatch');
        wrapper = shallowMount(BranchAccess, {
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
                selected: repo,
                page: 1,
                pageNext: true,
                pagePrev: false
            },
            branch: {
                selected: 'someBranch',
                all: [{ name: 'b1', protected: true }, { name: 'b2', protected: false }, { name: 'b3', protected: false }],
                page: 1,
                pageNext: true,
                pagePrev: false
            },
            provider: {
                selected: 'github'
            }
        },
        actions: {
            [BRANCH_FETCH]: () =>  Promise.resolve(getMockStore().state.branch.all),
            [BRANCH_SELECTED]: () => { },
            [PROVIDER_SELECTED]: () => { },
            [REPOSITORY_CLEAR]: () => { },
            [REPOSITORY_SELECTED]: () => { }
        }
    });

    describe('mounted', () => {
        it('sets the provider from the route', () => {
            getLocalVue({
                params: {
                    provider: 'local',
                    repository: mockStore.state.repo.selected
                }
            });
            expect(mockStore.dispatch).toHaveBeenCalledWith(PROVIDER_SELECTED, 'local');
        });

        it('sets the repo name from the route', () => {
            getLocalVue({
                params: {
                    provider: mockStore.state.provider.selected,
                    repository: 'fakeRepoBad'
                }
            });
            expect(mockStore.dispatch).toHaveBeenCalledWith(REPOSITORY_SELECTED, 'fakeRepoBad');
        });

        it('fetches the branches', () => {
            getLocalVue({
                params: {
                    provider: mockStore.state.provider.selected,
                    repository: mockStore.state.repo.selected
                }
            });
            expect(mockStore.dispatch).toHaveBeenCalledWith(BRANCH_FETCH, 1);
            expect(wrapper.vm.branches).toEqual([
                {
                    value: 'b1',
                    icon: 'lock',
                    iconTooltip: 'branch.protectedBranch'
                },
                'b2','b3'
            ]);
        });
    });

    describe('branches', () => {
        beforeEach(() => {
            getLocalVue({
                params: {
                    provider: mockStore.state.provider.selected,
                    repository: mockStore.state.repo.selected
                }
            });
        });

        it('displays the branches', () => {
            expect(wrapper.findComponent(TdSelectionPage).exists()).toEqual(true);
        });

        it('displays the translated text', () => {
            expect(wrapper.findComponent(TdSelectionPage).text()).toContain('branch.chooseRepo');
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
            expect(mockRouter.push).toHaveBeenCalledWith({ name: 'gitRepository' });
        });
    });

    describe('onBranchClick - select', () => {
        const testBranch = 'testBranch';
        let routeParams;
        beforeEach(() => {
            routeParams = {
                provider: mockStore.state.provider.selected,
                repository: mockStore.state.repo.selected
            };
            getLocalVue({
                params: routeParams,
                query: {}
            });
            wrapper.vm.onBranchClick(testBranch);
        });

        it('sets the selected branch', () => {
            expect(mockStore.dispatch).toHaveBeenCalledWith(BRANCH_SELECTED, testBranch);
        });

        it('navigates to the edit page', () => {
            routeParams.branch = testBranch;
            expect(mockRouter.push).toHaveBeenCalledWith({ name: 'gitThreatModelSelect', params: routeParams });
        });
    });

    describe('onBranchClick - new', () => {
        const testBranch = 'testBranch';
        let routeParams;
        beforeEach(() => {
            routeParams = {
                provider: mockStore.state.provider.selected,
                repository: mockStore.state.repo.selected
            };
            getLocalVue({
                params: routeParams,
                query: {
                    action: 'create'
                }
            });
            wrapper.vm.onBranchClick(testBranch);
        });

        it('navigates to the new page', () => {
            routeParams.branch = testBranch;
            expect(mockRouter.push).toHaveBeenCalledWith({ name: 'gitNewThreatModel', params: routeParams });
        });
    });

    describe('open add branch dialog', () => {
        beforeEach(() => {
            getLocalVue({
                params: {
                    provider: mockStore.state.provider.selected,
                    repository: mockStore.state.repo.selected
                }
            });
            wrapper.vm.toggleNewBranchDialog();
        });

        it('sets the dialog to open', () => {
            expect(wrapper.vm.showNewBranchDialog).toEqual(true);
            expect(wrapper.findComponent(AddBranchDialog).exists()).toEqual(true);
        });
    });
});
