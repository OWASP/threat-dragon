import { BRANCH_CLEAR, BRANCH_FETCH, BRANCH_SELECTED } from '@/store/actions/branch.js';
import branchModule, { clearState } from '@/store/modules/branch.js';
import threatmodelApi from '@/service/api/threatmodelApi.js';
import { createStoreMocks } from '../../helpers/store';

describe('store/modules/branch.js', () => {
    let apiSpy;
    const mocks = createStoreMocks();

    beforeEach(() => {
        jest.spyOn(mocks, 'commit');
        jest.spyOn(mocks, 'dispatch');
        apiSpy = jest.spyOn(threatmodelApi, 'branchesAsync');
    });

    afterEach(() => {
        clearState(branchModule.state);
        apiSpy.mockRestore();
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
        it('commits the clear action', () => {
            branchModule.actions[BRANCH_CLEAR](mocks);
            expect(mocks.commit).toHaveBeenCalledWith(BRANCH_CLEAR);
        });

        it('commits the selected branch', () => {
            branchModule.actions[BRANCH_SELECTED](mocks, 'my-branch');
            expect(mocks.commit).toHaveBeenCalledWith(BRANCH_SELECTED, 'my-branch');
        });

        describe('fetch', () => {
            const branches = ['foo', 'bar'];
            const pagination = { page: 1, next: true, prev: false };

            beforeEach(async () => {
                apiSpy.mockResolvedValue({ data: { branches, pagination } });
                await branchModule.actions[BRANCH_FETCH](mocks);
            });

            it('dispatches clear before fetching', () => {
                expect(mocks.dispatch).toHaveBeenCalledWith(BRANCH_CLEAR);
            });

            it('commits the fetch result with pagination', () => {
                expect(mocks.commit).toHaveBeenCalledWith(BRANCH_FETCH, {
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
                await branchModule.actions[BRANCH_FETCH](mocks, { page: 2 });
                expect(apiSpy).toHaveBeenCalledWith(mocks.rootState.repo.selected, 2);
            });

            it('defaults to page 1 when dispatched with empty payload', async () => {
                apiSpy.mockResolvedValue({ data: { branches: [], pagination } });
                await branchModule.actions[BRANCH_FETCH](mocks, {});
                expect(apiSpy).toHaveBeenCalledWith(mocks.rootState.repo.selected, 1);
            });

            it('defaults to page 1 when dispatched without arguments', async () => {
                apiSpy.mockResolvedValue({ data: { branches: [], pagination } });
                await branchModule.actions[BRANCH_FETCH](mocks);
                expect(apiSpy).toHaveBeenCalledWith(mocks.rootState.repo.selected, 1);
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
                branchModule.mutations[BRANCH_CLEAR](branchModule.state);
            });

            it('resets all state properties', () => {
                expect(branchModule.state.all).toHaveLength(0);
                expect(branchModule.state.selected).toBe('');
                expect(branchModule.state.page).toBe(1);
                expect(branchModule.state.pageNext).toBe(false);
                expect(branchModule.state.pagePrev).toBe(false);
            });
        });

        describe('selected', () => {
            it('sets the branch prop', () => {
                branchModule.mutations[BRANCH_SELECTED](branchModule.state, 'my-branch');
                expect(branchModule.state.selected).toBe('my-branch');
            });
        });
    });

    it('defines a getters object', () => {
        expect(branchModule.getters).toBeInstanceOf(Object);
    });
});
