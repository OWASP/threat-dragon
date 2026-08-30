import { branchClear, branchCreate, branchFetch, branchSelected } from '@/store/actions/branch.js';
import branchModule, { clearState } from '@/store/modules/branch.js';
import threatmodelApi from '@/service/api/threatmodelApi.js';
import { createStoreMocks } from '../../helpers/store';

describe('store/modules/branch.js', () => {
    let apiSpy, apiSpyCreate;
    const mocks = createStoreMocks();

    beforeEach(() => {
        jest.spyOn(mocks, 'commit');
        jest.spyOn(mocks, 'dispatch');
        apiSpy = jest.spyOn(threatmodelApi, 'branchesAsync');
        apiSpyCreate = jest.spyOn(threatmodelApi, 'createBranchAsync');
    });

    afterEach(() => {
        clearState(branchModule.state);
        apiSpy.mockRestore();
        apiSpyCreate.mockRestore();
    });

    describe('state', () => {
        it('defines an all array', () => {
            expect(branchModule.state.all).toBeInstanceOf(Array);
        });

        it('defines a selected string', () => {
            expect(branchModule.state.selected).toBe('');
        });

        it('defines pagination defaults', () => {
            expect(branchModule.state.page).toBe(1);
            expect(branchModule.state.pageNext).toBe(false);
            expect(branchModule.state.pagePrev).toBe(false);
        });
    });

    describe('actions', () => {
        it('clear commit', () => {
            branchModule.actions[branchClear](mocks);
            expect(mocks.commit).toHaveBeenCalledWith(branchClear);
        });

        describe('fetch commit', () => {
            const branches = ['foo', 'bar'];
            const pagination = { page: 1, next: true, prev: false };

            beforeEach(async () => {
                apiSpy.mockResolvedValue({ data: { branches, pagination } });
                await branchModule.actions[branchFetch](mocks);
            });

            it('dispatches clear before fetching', () => {
                expect(mocks.dispatch).toHaveBeenCalledWith(branchClear);
            });

            it('commits the fetch result with pagination', () => {
                expect(mocks.commit).toHaveBeenCalledWith(branchFetch, {
                    branches,
                    page: pagination.page,
                    pageNext: pagination.next,
                    pagePrev: pagination.prev,
                });
            });

            it('passes repo from rootState and default page 1 to the API', () => {
                expect(apiSpy).toHaveBeenCalledWith(mocks.rootState.repo.selected, 1);
            });
        });

        describe('fetch with page parameter', () => {
            const pagination = { page: 2, next: true, prev: true };

            it('passes the requested page to branchesAsync', async () => {
                apiSpy.mockResolvedValue({ data: { branches: ['page2branch'], pagination } });
                await branchModule.actions[branchFetch](mocks, { page: 2 });
                expect(apiSpy).toHaveBeenCalledWith(mocks.rootState.repo.selected, 2);
            });

            it('defaults to page 1 when dispatched with empty payload', async () => {
                apiSpy.mockResolvedValue({ data: { branches: [], pagination } });
                await branchModule.actions[branchFetch](mocks, {});
                expect(apiSpy).toHaveBeenCalledWith(mocks.rootState.repo.selected, 1);
            });

            it('defaults to page 1 when dispatched without arguments', async () => {
                apiSpy.mockResolvedValue({ data: { branches: [], pagination } });
                await branchModule.actions[branchFetch](mocks);
                expect(apiSpy).toHaveBeenCalledWith(mocks.rootState.repo.selected, 1);
            });
        });

        it('selected branch commit', () => {
            branchModule.actions[branchSelected](mocks, 'my-branch');
            expect(mocks.commit).toHaveBeenCalledWith(branchSelected, 'my-branch');
        });

        describe('create', () => {
            beforeEach(async () => {
                apiSpyCreate.mockResolvedValue({});
                await branchModule.actions[branchCreate](mocks, { branchName: 'foo', refBranch: 'bar' });
            });

            it('creates the new branch', () => {
                expect(apiSpyCreate).toHaveBeenCalledWith(mocks.rootState.repo.selected, 'foo', 'bar');
            });

            it('fetches the branch', () => {
                expect(mocks.dispatch).toHaveBeenCalledWith(branchFetch);
            });
        });
    });

    describe('mutations', () => {
        describe('clear', () => {
            beforeEach(() => {
                branchModule.state.all.push('test1', 'test2');
                branchModule.state.selected = 'test5';
                branchModule.state.page = 5;
                branchModule.state.pageNext = true;
                branchModule.state.pagePrev = true;
                branchModule.mutations[branchClear](branchModule.state);
            });

            it('resets all state properties', () => {
                expect(branchModule.state.all).toHaveLength(0);
                expect(branchModule.state.selected).toBe('');
                expect(branchModule.state.page).toBe(1);
                expect(branchModule.state.pageNext).toBe(false);
                expect(branchModule.state.pagePrev).toBe(false);
            });
        });

        describe('fetch', () => {
            const testBranches = {branches: ['test1', 'test2'], page: 99, pageNext: false, pagePrev: false};

            beforeEach(() => {
                branchModule.state.all.push('foo', 'bar', 'baz');
                branchModule.state.selected = 'foobar';
                branchModule.state.page = 5;
                branchModule.state.pageNext = true;
                branchModule.state.pagePrev = true;
                branchModule.mutations[branchFetch](branchModule.state, testBranches);
            });

            it('copies the branch properties', () => {
                expect(branchModule.state.all).toHaveLength(3);
                expect(branchModule.state.all[1]).toBe(testBranches.branches[1]);
                expect(branchModule.state.all[2]).toBe('baz');
                expect(branchModule.state.selected).toBe('foobar');
            });

            it('copies the page properties', () => {
                expect(branchModule.state.page).toBe(99);
                expect(branchModule.state.pageNext).toBe(false);
                expect(branchModule.state.pagePrev).toBe(false);
            });
        });

        describe('selected', () => {
            it('sets the branch prop', () => {
                branchModule.mutations[branchSelected](branchModule.state, 'my-branch');
                expect(branchModule.state.selected).toBe('my-branch');
            });
        });
    });

    it('defines a getters object', () => {
        expect(branchModule.getters).toBeInstanceOf(Object);
    });
});
