import { repositoryClear, repositoryFetch, repositorySelected } from '@/store/actions/repository';
import repoModule, { clearState } from '@/store/modules/repository';
import threatmodelApi from '@/service/api/threatmodelApi';
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
            repoModule.actions[repositoryClear](mocks);
            expect(mocks.commit).toHaveBeenCalledWith(repositoryClear);
        });

        it('commits the selected repo', () => {
            repoModule.actions[repositorySelected](mocks, 'my-repo');
            expect(mocks.commit).toHaveBeenCalledWith(repositorySelected, 'my-repo');
        });

        describe('fetch', () => {
            const repos = ['foo', 'bar'];
            const pagination = { page: 1, next: true, prev: false };

            beforeEach(async () => {
                apiSpy.mockResolvedValue({ data: { repos, pagination } });
                await repoModule.actions[repositoryFetch](mocks, { page: 1, searchQuery: '' });
            });

            it('dispatches clear before fetching', () => {
                expect(mocks.dispatch).toHaveBeenCalledWith(repositoryClear);
            });

            it('commits the fetch result with pagination', () => {
                expect(mocks.commit).toHaveBeenCalledWith(repositoryFetch, {
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
                await repoModule.actions[repositoryFetch](mocks, { page: 3, searchQuery: 'owasp' });
                expect(apiSpy).toHaveBeenCalledWith(3, 'owasp');
            });

            it('dispatches clear before the async API call', async () => {
                apiSpy.mockResolvedValue({ data: { repos: [], pagination: p } });
                await repoModule.actions[repositoryFetch](mocks, { page: 1, searchQuery: '' });
                expect(mocks.dispatch).toHaveBeenCalledWith(repositoryClear);
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
                repoModule.mutations[repositoryClear](repoModule.state);
            });

            it('resets all state properties', () => {
                expect(repoModule.state.all).toHaveLength(0);
                expect(repoModule.state.selected).toBe('');
                expect(repoModule.state.page).toBe(1);
                expect(repoModule.state.pageNext).toBe(false);
                expect(repoModule.state.pagePrev).toBe(false);
            });
        });

        describe('fetch', () => {
            const testRepos = {repos: ['test1', 'test2'], page: 99, pageNext: false, pagePrev: false};

            beforeEach(() => {
                repoModule.state.all.push('foo', 'bar', 'baz');
                repoModule.state.page = 5;
                repoModule.state.pageNext = true;
                repoModule.state.pagePrev = true;
                repoModule.mutations[repositoryFetch](repoModule.state, testRepos);
            });

            it('copies the repo properties', () => {
                expect(repoModule.state.all).toHaveLength(2);
                expect(repoModule.state.all[1]).toBe('test2');
            });

            it('copies the page properties', () => {
			    expect(repoModule.state.page).toBe(99);
			    expect(repoModule.state.pageNext).toBe(false);
			    expect(repoModule.state.pagePrev).toBe(false);
            });
        });

        describe('selected', () => {
            it('sets the repo properties', () => {
                repoModule.mutations[repositorySelected](repoModule.state, 'my-repo');
                expect(repoModule.state.selected).toBe('my-repo');
            });
        });
    });

    it('defines a getters object', () => {
        expect(repoModule.getters).toBeInstanceOf(Object);
    });
});
