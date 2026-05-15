import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';

import { PROVIDER_SELECTED } from '@/store/actions/provider.js';
import { REPOSITORY_CLEAR, REPOSITORY_SELECTED, REPOSITORY_FETCH } from '@/store/actions/repository.js';
import RepositoryAccess from '@/views/git/RepositoryAccess.vue';
import TdSelectionPage from '@/components/SelectionPage.vue';

import { artificialDelay } from '../helpers/utils';

const PROVIDER = 'github';

const buildStore = () => new Vuex.Store({
    state: {
        provider: { selected: PROVIDER },
        repo: { all: [], selected: '', page: 1, pageNext: true, pagePrev: false },
    },
    actions: {
        [PROVIDER_SELECTED]: () => {},
        [REPOSITORY_CLEAR]: () => {},
        [REPOSITORY_FETCH]: () => {},
        [REPOSITORY_SELECTED]: () => {},
    },
});

const mountComponent = (params, query = {}) => {
    localVue = createLocalVue();
    localVue.use(Vuex);
    mockStore = buildStore();
    mockRouter = { push: jest.fn() };
    jest.spyOn(mockStore, 'dispatch');
    wrapper = shallowMount(RepositoryAccess, {
        localVue, store: mockStore,
        mocks: { $route: { params, query }, $router: mockRouter, $t: k => k },
    });
};

let localVue, mockRouter, mockStore, wrapper;

describe('views/RepositoryAccess.vue', () => {
    describe('mounted', () => {
        it('sets the provider from the route', () => {
            mountComponent({ provider: 'local' }, { page: 1 });
            expect(mockStore.dispatch).toHaveBeenCalledWith(PROVIDER_SELECTED, 'local');
        });

        it('fetches with default page 1', () => {
            mountComponent({ provider: PROVIDER }, {});
            expect(mockStore.dispatch).toHaveBeenCalledWith(REPOSITORY_FETCH, { page: 1 });
        });

        it('uses the page from the route query', () => {
            mountComponent({ provider: PROVIDER }, { page: 3 });
            expect(mockStore.dispatch).toHaveBeenCalledWith(REPOSITORY_FETCH, { page: 3 });
        });

        it('does not re-dispatch an already-matched provider', () => {
            mountComponent({ provider: PROVIDER }, { page: 1 });
            expect(mockStore.dispatch).not.toHaveBeenCalledWith(PROVIDER_SELECTED, PROVIDER);
        });
    });

    describe('repos', () => {
        beforeEach(() => mountComponent({ provider: PROVIDER }, { page: 1 }));

        it('renders the selection page wrapper', () => {
            expect(wrapper.findComponent(TdSelectionPage).exists()).toBe(true);
        });

        it('shows translated header text', () => {
            expect(wrapper.findComponent(TdSelectionPage).text()).toContain('repository.select');
        });

        it('updates searchQuery on filter emit from child', async () => {
            wrapper.findComponent(TdSelectionPage).vm.$emit('update:filter', 'threat-dragon');
            await wrapper.vm.$nextTick();
            expect(wrapper.vm.searchQuery).toBe('threat-dragon');
        });

        it('forwards pagination state as props', () => {
            const sel = wrapper.findComponent(TdSelectionPage);
            expect(sel.props('page')).toBe(mockStore.state.repo.page);
            expect(sel.props('pageNext')).toBe(mockStore.state.repo.pageNext);
            expect(sel.props('pagePrev')).toBe(mockStore.state.repo.pagePrev);
        });

        it('passes method references as callback props', () => {
            const sel = wrapper.findComponent(TdSelectionPage);
            expect(sel.props('paginate')).toBe(wrapper.vm.paginate);
            expect(sel.props('onItemClick')).toBe(wrapper.vm.onRepoClick);
        });
    });

    describe('onRepoClick', () => {
        const repoName = 'fakeRepo';
        const query = { page: 1 };

        beforeEach(() => {
            mountComponent({ provider: PROVIDER }, query);
            wrapper.vm.onRepoClick(repoName);
        });

        it('dispatches the selected repo', () => {
            expect(mockStore.dispatch).toHaveBeenCalledWith(REPOSITORY_SELECTED, repoName);
        });

        it('navigates to the branch page', () => {
            expect(mockRouter.push).toHaveBeenCalledWith({
                name: 'gitBranch',
                params: { provider: PROVIDER, repository: repoName },
                query,
            });
        });
    });

    describe('searchQuery watcher (500ms debounce)', () => {
        beforeEach(() => {
            mountComponent({ provider: PROVIDER }, { page: 3 });
            mockStore.dispatch.mockClear();
        });

        it('fires fetch with page 1 after the timeout', async () => {
            wrapper.vm.searchQuery = 'owasp';
            await wrapper.vm.$nextTick();
            await artificialDelay(500);
            expect(mockStore.dispatch).toHaveBeenCalledWith(REPOSITORY_FETCH, { page: 1, searchQuery: 'owasp' });
        });

        it('always uses page 1 regardless of current page', async () => {
            wrapper.vm.searchQuery = 'test';
            await wrapper.vm.$nextTick();
            await artificialDelay(500);
            expect(mockStore.dispatch).toHaveBeenCalledWith(REPOSITORY_FETCH, { page: 1, searchQuery: 'test' });
        });

        it('does not fire before the timeout', async () => {
            wrapper.vm.searchQuery = 'test';
            await wrapper.vm.$nextTick();
            await artificialDelay(300);
            expect(mockStore.dispatch).not.toHaveBeenCalled();
        });

        it('debounces: only the last of rapid changes fires', async () => {
            wrapper.vm.searchQuery = 'a';
            await wrapper.vm.$nextTick();
            await artificialDelay(200);
            wrapper.vm.searchQuery = 'ab';
            await wrapper.vm.$nextTick();
            await artificialDelay(200);
            wrapper.vm.searchQuery = 'abc';
            await wrapper.vm.$nextTick();
            await artificialDelay(500);

            expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
            expect(mockStore.dispatch).toHaveBeenCalledWith(REPOSITORY_FETCH, { page: 1, searchQuery: 'abc' });
        });

        it('cancels an earlier timeout when superseded', async () => {
            wrapper.vm.searchQuery = 'first';
            await wrapper.vm.$nextTick();
            await artificialDelay(400);
            wrapper.vm.searchQuery = 'second';
            await wrapper.vm.$nextTick();
            await artificialDelay(500);

            expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
            expect(mockStore.dispatch).toHaveBeenCalledWith(REPOSITORY_FETCH, { page: 1, searchQuery: 'second' });
        });
    });

    describe('paginate', () => {
        beforeEach(() => mountComponent({ provider: PROVIDER }, { page: 2 }));

        it('dispatches fetch with given page and current search query', () => {
            wrapper.vm.searchQuery = 'test-repo';
            wrapper.vm.paginate(2);
            expect(mockStore.dispatch).toHaveBeenCalledWith(REPOSITORY_FETCH, { page: 2, searchQuery: 'test-repo' });
        });

        it('sends empty search when no filter is active', () => {
            wrapper.vm.searchQuery = '';
            wrapper.vm.paginate(3);
            expect(mockStore.dispatch).toHaveBeenCalledWith(REPOSITORY_FETCH, { page: 3, searchQuery: '' });
        });

        it('paginates with empty searchQuery when no filter is active', () => {
            wrapper.vm.searchQuery = '';
            wrapper.vm.paginate(5);
            expect(mockStore.dispatch).toHaveBeenCalledWith(REPOSITORY_FETCH, { page: 5, searchQuery: '' });
        });

        it('preserves the current filter when paginating', () => {
            wrapper.vm.searchQuery = 'owasp';
            wrapper.vm.paginate(4);
            expect(mockStore.dispatch).toHaveBeenCalledWith(REPOSITORY_FETCH, { page: 4, searchQuery: 'owasp' });
        });
    });
});
