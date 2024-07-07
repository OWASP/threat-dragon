import { BRANCH_CLEAR, BRANCH_FETCH, BRANCH_SELECTED } from '@/store/actions/branch.js';
import branchModule, { clearState } from '@/store/modules/branch.js';
import threatmodelApi from '@/service/api/threatmodelApi.js';

describe('store/modules/branch.js', () => {
    const mocks = {
        commit: () => {},
        dispatch: () => {},
        rootState: {
            auth: {
                jwt: 'test'
            },
            repo: {
                selected: 'foobar'
            }
        }
    };

    beforeEach(() => {
        jest.spyOn(mocks, 'commit');
        jest.spyOn(mocks, 'dispatch');
    });

    afterEach(() => {
        clearState(branchModule.state);
    });

    describe('state', () => {
        it('defines an all array', () => {
            expect(branchModule.state.all).toBeInstanceOf(Array);
        });

        it('defines a selected string', () => {
            expect(branchModule.state.selected).toEqual('');
        });

        it('defines a page number', () => {
            expect(branchModule.state.page).toEqual(1);
        });

        it('defines a pageNext bool', () => {
            expect(branchModule.state.pageNext).toEqual(false);
        });

        it('defines a pagePrev bool', () => {
            expect(branchModule.state.pagePrev).toEqual(false);
        });
    });

    describe('actions', () => {
        it('commits the clear action', () => {
            branchModule.actions[BRANCH_CLEAR](mocks);
            expect(mocks.commit).toHaveBeenCalledWith(BRANCH_CLEAR);
        });

        describe('fetch', () => {
            const branches = [ 'foo', 'bar' ];
            const pagination = {
                page: 1,
                next: true,
                prev: false
            };

            beforeEach(async () => {
                jest.spyOn(threatmodelApi, 'branchesAsync').mockResolvedValue({ data: { branches, pagination }});
                await branchModule.actions[BRANCH_FETCH](mocks);
            });

            it('dispatches the clear event', () => {
                expect(mocks.dispatch).toHaveBeenCalledWith(BRANCH_CLEAR);
            });

            it('commits the fetch action', () => {
                expect(mocks.commit).toHaveBeenCalledWith(
                    BRANCH_FETCH,
                    {
                        'branches': branches,
                        'page': pagination.page,
                        'pageNext': pagination.next,
                        'pagePrev': pagination.prev
                    } 
                );
            });
        });

        it('commits the selected branch', () => {
            const branch = 'branch';
            branchModule.actions[BRANCH_SELECTED](mocks, branch);
            expect(mocks.commit).toHaveBeenCalledWith(BRANCH_SELECTED, branch);
        });
    });

    describe('mutations', () => {
        describe('clear', () => {
            beforeEach(() => {
                branchModule.state.all.push('test1');
                branchModule.state.all.push('test2');
                branchModule.state.selected = 'test5';
                branchModule.state.page = 1;
                branchModule.state.pageNext = false;
                branchModule.state.pagePrev = false;
                branchModule.mutations[BRANCH_CLEAR](branchModule.state);
            });

            it('empties the all array', () => {
                expect(branchModule.state.all).toHaveLength(0);
            });

            it('resets the selected property', () => {
                expect(branchModule.state.selected).toEqual('');
            });

            it('resets the page property', () => {
                expect(branchModule.state.page).toEqual(1);
            });

            it('resets the pageNext property', () => {
                expect(branchModule.state.pageNext).toEqual(false);
            });

            it('resets the pagePrev property', () => {
                expect(branchModule.state.pagePrev).toEqual(false);
            });
        });

        describe('fetch', () => {
            const branches = [ 'foo', 'bar' ];

            beforeEach(() => {
                branchModule.mutations[BRANCH_FETCH](branchModule.state, branches);
            });
        });

        describe('selected', () => {
            const branch = 'test';

            beforeEach(() => {
                branchModule.mutations[BRANCH_SELECTED](branchModule.state, branch);
            });

            it('sets the branch prop', () => {
                expect(branchModule.state.selected).toEqual(branch);
            });
        });
    });

    it('defines a getters object', () => {
        expect(branchModule.getters).toBeInstanceOf(Object);
    });
});
