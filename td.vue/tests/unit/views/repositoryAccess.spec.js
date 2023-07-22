import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';

import { PROVIDER_SELECTED } from '@/store/actions/provider.js';
import { REPOSITORY_CLEAR, REPOSITORY_SELECTED, REPOSITORY_FETCH } from '@/store/actions/repository.js';
import RepositoryAccess from '@/views/git/RepositoryAccess.vue';
import TdSelectionPage from '@/components/SelectionPage.vue';


describe('views/RepositoryAccess.vue', () => {
    let wrapper, localVue, mockStore, mockRouter;

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(Vuex);
        mockStore = getMockStore();
    });

    const getLocalVue = (mockRoute) => {
        mockRouter = { push: jest.fn() };
        jest.spyOn(mockStore, 'dispatch');
        wrapper = shallowMount(RepositoryAccess, {
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
            [REPOSITORY_SELECTED]: () => { }
        }
    });

    describe('mounted', () => {
        it('sets the provider from the route', () => {
            getLocalVue({
                params: {
                    provider: 'local'
                },
                query: {
                    page: 1
                }
            });
            expect(mockStore.dispatch).toHaveBeenCalledWith(PROVIDER_SELECTED, 'local');
        });
        
        it('fetches the repos', () => {
            getLocalVue({
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
            getLocalVue({
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

        it('displays the translated text', () => {
            expect(wrapper.findComponent(TdSelectionPage).text()).toContain('repository.select');
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

            getLocalVue({
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
            expect(mockRouter.push).toHaveBeenCalledWith({ name: 'gitBranch', params: mockRoute,  query});
        });
    });
});
