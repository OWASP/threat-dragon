import { REPOSITORY_CLEAR, REPOSITORY_FETCH, REPOSITORY_SELECTED } from '@/store/actions/repository.js';
import repoModule, { clearState } from '@/store/modules/repository.js';
import threatmodelApi from '@/service/api/threatmodelApi.js';

describe('store/modules/repository.js', () => {
    const mocks = {
        commit: () => {},
        dispatch: () => {},
        rootState: {
            auth: {
                jwt: 'test'
            }
        }
    };

    beforeEach(() => {
        jest.spyOn(mocks, 'commit');
        jest.spyOn(mocks, 'dispatch');
    });

    afterEach(() => {
        clearState(repoModule.state);
    });

    describe('state', () => {
        it('defines an all array', () => {
            expect(repoModule.state.all).toBeInstanceOf(Array);
        });

        it('defines a selected string', () => {
            expect(repoModule.state.selected).toEqual('');
        });

        it('defines a page number', () => {
            expect(repoModule.state.page).toEqual(1);
        });

        it('defines a pageNext bool', () => {
            expect(repoModule.state.pageNext).toEqual(false);
        });

        it('defines a pagePrev bool', () => {
            expect(repoModule.state.pagePrev).toEqual(false);
        });
    });

    describe('actions', () => {
        it('commits the clear action', () => {
            repoModule.actions[REPOSITORY_CLEAR](mocks);
            expect(mocks.commit).toHaveBeenCalledWith(REPOSITORY_CLEAR);
        });

        describe('fetch', () => {
            const repos = [ 'foo', 'bar' ];
            const pagination = {
                page: 1,
                next: true,
                prev: false
            };

            beforeEach(async () => {
                jest.spyOn(threatmodelApi, 'reposAsync').mockResolvedValue({ data: { repos, pagination }});
                await repoModule.actions[REPOSITORY_FETCH](mocks, 1);
            });

            it('dispatches the clear event', () => {
                expect(mocks.dispatch).toHaveBeenCalledWith(REPOSITORY_CLEAR);
            });

            it('commits the fetch action', () => {
                expect(mocks.commit).toHaveBeenCalledWith(
                    REPOSITORY_FETCH,
                    {
                        'repos': repos,
                        'page': pagination.page,
                        'pageNext': pagination.next,
                        'pagePrev': pagination.prev
                    }
                );
            });
        });

        it('commits the selected repo', () => {
            const repo = 'repo';
            repoModule.actions[REPOSITORY_SELECTED](mocks, repo);
            expect(mocks.commit).toHaveBeenCalledWith(REPOSITORY_SELECTED, repo);
        });
    });

    describe('mutations', () => {
        describe('clear', () => {
            beforeEach(() => {
                repoModule.state.all.push('test1');
                repoModule.state.all.push('test2');
                repoModule.state.selected = 'github';
                repoModule.state.page = 1;
                repoModule.state.pageNext = false;
                repoModule.state.pagePrev = false;
                repoModule.mutations[REPOSITORY_CLEAR](repoModule.state);
            });

            it('empties the all array', () => {
                expect(repoModule.state.all).toHaveLength(0);
            });

            it('resets the selected property', () => {
                expect(repoModule.state.selected).toEqual('');
            });

            it('resets the page property', () => {
                expect(repoModule.state.page).toEqual(1);
            });

            it('resets the pageNext property', () => {
                expect(repoModule.state.pageNext).toEqual(false);
            });

            it('resets the pagePrev property', () => {
                expect(repoModule.state.pagePrev).toEqual(false);
            });
        });

        describe('selected', () => {
            const repo = 'test';

            beforeEach(() => {
                repoModule.mutations[REPOSITORY_SELECTED](repoModule.state, repo);
            });

            it('sets the repo prop', () => {
                expect(repoModule.state.selected).toEqual(repo);
            });
        });
    });

    it('defines a getters object', () => {
        expect(repoModule.getters).toBeInstanceOf(Object);
    });
});
