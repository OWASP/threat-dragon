import { REPOSITORY_CLEAR, REPOSITORY_FETCH, REPOSITORY_SELECTED } from '@/store/actions/repository.js';
import repoModule, { clearState } from '@/store/modules/repository.js';
import threatmodelApi from '@/service/api/threatmodelApi.js';
import { createStoreMocks } from '../../helpers/store';

describe('store/modules/repository.js', () => {
    let apiSpy;
    const mocks = createStoreMocks();

    beforeEach(() => {
        jest.spyOn(mocks, 'commit');
        jest.spyOn(mocks, 'dispatch');
        apiSpy = jest.spyOn(threatmodelApi, 'reposAsync');
    });

    afterEach(() => {
        clearState(repoModule.state);
        apiSpy.mockRestore();
    });

    describe('state', () => {
        it('defines an all array', () => {
            expect(repoModule.state.all).toBeInstanceOf(Array);
        });

        it('defines a selected string', () => {
            expect(repoModule.state.selected).toBe('');
        });

        it('defines pagination defaults', () => {
            expect(repoModule.state.page).toBe(1);
            expect(repoModule.state.pageNext).toBe(false);
            expect(repoModule.state.pagePrev).toBe(false);
        });
    });

    describe('actions', () => {
        it('commits the clear action', () => {
            repoModule.actions[REPOSITORY_CLEAR](mocks);
            expect(mocks.commit).toHaveBeenCalledWith(REPOSITORY_CLEAR);
        });

        it('commits the selected repo', () => {
            repoModule.actions[REPOSITORY_SELECTED](mocks, 'my-repo');
            expect(mocks.commit).toHaveBeenCalledWith(REPOSITORY_SELECTED, 'my-repo');
        });

        describe('fetch', () => {
            const repos = ['foo', 'bar'];
            const pagination = { page: 1, next: true, prev: false };

            beforeEach(async () => {
                apiSpy.mockResolvedValue({ data: { repos, pagination } });
                await repoModule.actions[REPOSITORY_FETCH](mocks, { page: 1, searchQuery: '' });
            });

            it('dispatches clear before fetching', () => {
                expect(mocks.dispatch).toHaveBeenCalledWith(REPOSITORY_CLEAR);
            });

            it('commits the fetch result with pagination', () => {
                expect(mocks.commit).toHaveBeenCalledWith(REPOSITORY_FETCH, {
                    repos,
                    page: pagination.page,
                    pageNext: pagination.next,
                    pagePrev: pagination.prev,
                });
            });

            it('passes page and searchQuery to the API', () => {
                expect(apiSpy).toHaveBeenCalledWith(1, '');
            });
        });

        describe('fetch with different parameters', () => {
            const p = { page: 1, next: false, prev: false };

            it('passes page 3 and search query to reposAsync', async () => {
                apiSpy.mockResolvedValue({ data: { repos: ['filtered-repo'], pagination: p } });
                await repoModule.actions[REPOSITORY_FETCH](mocks, { page: 3, searchQuery: 'owasp' });
                expect(apiSpy).toHaveBeenCalledWith(3, 'owasp');
            });

            it('dispatches clear before the async API call', async () => {
                apiSpy.mockResolvedValue({ data: { repos: [], pagination: p } });
                await repoModule.actions[REPOSITORY_FETCH](mocks, { page: 1, searchQuery: '' });
                expect(mocks.dispatch).toHaveBeenCalledWith(REPOSITORY_CLEAR);
            });
        });
    });

    describe('mutations', () => {
        describe('clear', () => {
            beforeEach(() => {
                repoModule.state.all.push('test1', 'test2');
                repoModule.state.selected = 'github';
                repoModule.state.page = 5;
                repoModule.state.pageNext = true;
                repoModule.state.pagePrev = true;
                repoModule.mutations[REPOSITORY_CLEAR](repoModule.state);
            });

            it('resets all state properties', () => {
                expect(repoModule.state.all).toHaveLength(0);
                expect(repoModule.state.selected).toBe('');
                expect(repoModule.state.page).toBe(1);
                expect(repoModule.state.pageNext).toBe(false);
                expect(repoModule.state.pagePrev).toBe(false);
            });
        });

        describe('selected', () => {
            it('sets the repo prop', () => {
                repoModule.mutations[REPOSITORY_SELECTED](repoModule.state, 'my-repo');
                expect(repoModule.state.selected).toBe('my-repo');
            });
        });
    });

    it('defines a getters object', () => {
        expect(repoModule.getters).toBeInstanceOf(Object);
    });
});
