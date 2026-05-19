import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';

import BranchAccess from '@/views/git/BranchAccess.vue';
import { BRANCH_FETCH, BRANCH_SELECTED } from '@/store/actions/branch.js';
import { PROVIDER_SELECTED } from '@/store/actions/provider.js';
import { REPOSITORY_CLEAR, REPOSITORY_SELECTED } from '@/store/actions/repository.js';
import TdSelectionPage from '@/components/SelectionPage.vue';
import AddBranchDialog from '@/components/AddBranchDialog.vue';

const PROVIDER = 'github';
const REPO = 'someRepo';

const buildStore = () => new Vuex.Store({
    state: {
        provider: { selected: PROVIDER },
        repo: { selected: REPO, page: 1, pageNext: true, pagePrev: false },
        branch: {
            selected: 'someBranch',
            all: [
                { name: 'b1', protected: true },
                { name: 'b2', protected: false },
                { name: 'b3', protected: false },
            ],
            page: 1, pageNext: true, pagePrev: false,
        },
    },
    actions: {
        [BRANCH_FETCH]: () => Promise.resolve(buildStore().state.branch.all),
        [BRANCH_SELECTED]: () => {},
        [PROVIDER_SELECTED]: () => {},
        [REPOSITORY_CLEAR]: () => {},
        [REPOSITORY_SELECTED]: () => {},
    },
});

const mountComponent = (params, query = {}) => {
    localVue = createLocalVue();
    localVue.use(Vuex);
    mockStore = buildStore();
    mockRouter = { push: jest.fn() };
    jest.spyOn(mockStore, 'dispatch');
    wrapper = shallowMount(BranchAccess, {
        localVue, store: mockStore,
        mocks: { $route: { params, query }, $router: mockRouter, $t: k => k },
    });
};

let localVue, mockRouter, mockStore, wrapper;

describe('views/BranchAccess.vue', () => {
    describe('mounted', () => {
        it('sets the provider from the route', () => {
            mountComponent({ provider: 'local', repository: REPO });
            expect(mockStore.dispatch).toHaveBeenCalledWith(PROVIDER_SELECTED, 'local');
        });

        it('sets the repo name from the route', () => {
            mountComponent({ provider: PROVIDER, repository: 'fakeRepoBad' });
            expect(mockStore.dispatch).toHaveBeenCalledWith(REPOSITORY_SELECTED, 'fakeRepoBad');
        });

        it('fetches branches and maps protected ones with lock icon', () => {
            mountComponent({ provider: PROVIDER, repository: REPO });
            expect(mockStore.dispatch).toHaveBeenCalledWith(BRANCH_FETCH, { page: 1 });
            expect(wrapper.vm.branches).toEqual([
                { value: 'b1', icon: 'lock', iconTooltip: 'branch.protectedBranch' },
                'b2', 'b3',
            ]);
        });
    });

    describe('branches', () => {
        beforeEach(() => mountComponent({ provider: PROVIDER, repository: REPO }));

        it('renders the selection page wrapper', () => {
            expect(wrapper.findComponent(TdSelectionPage).exists()).toBe(true);
        });

        it('shows translated header text', () => {
            expect(wrapper.findComponent(TdSelectionPage).text()).toContain('branch.chooseRepo');
        });

        it('updates searchQuery on filter emit from child', async () => {
            wrapper.findComponent(TdSelectionPage).vm.$emit('update:filter', 'feature');
            await wrapper.vm.$nextTick();
            expect(wrapper.vm.searchQuery).toBe('feature');
        });
    });

    describe('selectRepoClick', () => {
        beforeEach(() => {
            mountComponent({ provider: PROVIDER, repository: REPO });
            wrapper.vm.selectRepoClick();
        });

        it('clears the selected repo', () => {
            expect(mockStore.dispatch).toHaveBeenCalledWith(REPOSITORY_CLEAR);
        });

        it('navigates back to the repository selection page', () => {
            expect(mockRouter.push).toHaveBeenCalledWith({ name: 'gitRepository' });
        });
    });

    describe('onBranchClick', () => {
        const testBranch = 'testBranch';

        it('selects the branch and navigates to the edit page (default action)', () => {
            mountComponent({ provider: PROVIDER, repository: REPO }, {});
            wrapper.vm.onBranchClick(testBranch);
            expect(mockStore.dispatch).toHaveBeenCalledWith(BRANCH_SELECTED, testBranch);
            expect(mockRouter.push).toHaveBeenCalledWith({
                name: 'gitThreatModelSelect',
                params: { provider: PROVIDER, repository: REPO, branch: testBranch },
            });
        });

        it('navigates to the new-threat-model page when action=create', () => {
            mountComponent({ provider: PROVIDER, repository: REPO }, { action: 'create' });
            wrapper.vm.onBranchClick(testBranch);
            expect(mockRouter.push).toHaveBeenCalledWith({
                name: 'gitNewThreatModel',
                params: { provider: PROVIDER, repository: REPO, branch: testBranch },
            });
        });

        it('extracts the branch name from a protected-branch object', () => {
            const protectedBranch = {
                value: 'protectedBranchName',
                icon: 'lock',
                iconTooltip: 'branch.protectedBranch',
            };
            mountComponent({ provider: PROVIDER, repository: REPO }, {});
            wrapper.vm.onBranchClick(protectedBranch);
            expect(mockStore.dispatch).toHaveBeenCalledWith(BRANCH_SELECTED, 'protectedBranchName');
            expect(mockRouter.push).toHaveBeenCalledWith({
                name: 'gitThreatModelSelect',
                params: { provider: PROVIDER, repository: REPO, branch: 'protectedBranchName' },
            });
        });
    });

    describe('add branch dialog', () => {
        beforeEach(() => {
            mountComponent({ provider: PROVIDER, repository: REPO });
            wrapper.vm.toggleNewBranchDialog();
        });

        it('opens the dialog when toggled', () => {
            expect(wrapper.vm.showNewBranchDialog).toBe(true);
            expect(wrapper.findComponent(AddBranchDialog).exists()).toBe(true);
        });
    });

    describe('paginate', () => {
        beforeEach(() => mountComponent({ provider: PROVIDER, repository: REPO }));

        it('dispatches BRANCH_FETCH with the requested page number', () => {
            wrapper.vm.paginate(3);
            expect(mockStore.dispatch).toHaveBeenCalledWith(BRANCH_FETCH, { page: 3 });
        });
    });
});
