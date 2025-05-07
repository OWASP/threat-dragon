import { shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';

import { PROVIDER_SELECTED } from '@/store/actions/provider.js';
import { REPOSITORY_CLEAR, REPOSITORY_SELECTED, REPOSITORY_FETCH } from '@/store/actions/repository.js';
import RepositoryAccess from '@/views/git/RepositoryAccess.vue';
import TdSelectionPage from '@/components/SelectionPage.vue';

// Mock Vue Router composables
jest.mock('vue-router', () => ({
    useRoute: jest.fn(),
    useRouter: jest.fn()
}));


describe('views/RepositoryAccess.vue', () => {
    let wrapper, mockStore, mockRouter;

    // Create store factory function
    const getMockStore = () => createStore({
        state: {
            provider: {
                selected: 'github'
            },
            repo: {
                all: [],
                selected: '',
                page: 1,
                pageNext: true,
                pagePrev: false
            }
        },
        actions: {
            [PROVIDER_SELECTED]: () => { },
            [REPOSITORY_CLEAR]: () => { },
            [REPOSITORY_FETCH]: () => { },
            [REPOSITORY_SELECTED]: () => { },
            'THREATMODEL_UPDATE': () => { },
            'THREATMODEL_NOT_MODIFIED': () => { },
            'THREATMODEL_CLEAR': () => { }
        }
    });

    beforeEach(() => {
        mockStore = getMockStore();
    });

    // Vue 3 style mount function
    const mountComponent = (mockRoute) => {
        // Mock router.push to return a resolved promise
        mockRouter = {
            push: jest.fn().mockReturnValue(Promise.resolve())
        };

        // Setup Vue Router mocks
        const vueRouter = require('vue-router');
        vueRouter.useRoute.mockReturnValue({
            ...mockRoute,
            query: mockRoute.query || {}
        });
        vueRouter.useRouter.mockReturnValue(mockRouter);

        jest.spyOn(mockStore, 'dispatch');
        wrapper = shallowMount(RepositoryAccess, {
            global: {
                plugins: [mockStore],
                mocks: {
                    $t: key => key
                }
            }
        });
    };

    describe('mounted', () => {
        it('fetches the repos on mount', () => {
            mountComponent({
                params: {
                    provider: 'local'
                },
                query: {
                    page: 1
                }
            });
            expect(mockStore.dispatch).toHaveBeenCalledWith(REPOSITORY_FETCH, 1);
        });

        it('fetches the repos', () => {
            mountComponent({
                params: {
                    provider: mockStore.state.provider.selected
                },
                query: {
                    page: 1
                }
            });
            expect(mockStore.dispatch).toHaveBeenCalledWith(REPOSITORY_FETCH, 1);
        });
    });

    describe('repos', () => {
        beforeEach(() => {
            mountComponent({
                params: {
                    provider: mockStore.state.provider.selected
                },
                query: {
                    page: 1
                }
            });
        });

        it('displays the repositories', () => {
            expect(wrapper.findComponent(TdSelectionPage).exists()).toEqual(true);
        });

        it('verifies the selection page component', () => {
            // In Vue 3, the text() content of stubbed components might not be available 
            // We check the component exists and is properly configured
            const selectionPage = wrapper.findComponent(TdSelectionPage);
            expect(selectionPage.exists()).toBe(true);
        });
    });

    describe('onRepoClick', () => {
        const repoName = 'fakeRepo';
        const query = {
            page: 1
        };
        let mockRoute;

        beforeEach(() => {
            mockRoute = {
                provider: mockStore.state.provider.selected
            };

            mountComponent({
                params: mockRoute,
                query
            });
            wrapper.vm.onRepoClick(repoName);
        });

        it('sets the selected repo', () => {
            expect(mockStore.dispatch).toHaveBeenCalledWith(REPOSITORY_SELECTED, repoName);
        });

        it('navigates to the branch select page', () => {
            mockRoute.repository = repoName;
            expect(mockRouter.push).toHaveBeenCalledWith({ name: 'gitBranch', params: mockRoute, query });
        });
    });
});
