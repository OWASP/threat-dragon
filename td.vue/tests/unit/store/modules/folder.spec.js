import { folderClear, folderFetch, folderSelected, folderNavigateBack } from '@/store/actions/folder';
import repoModule, { clearState } from '@/store/modules/folder';
import googleDriveApi from '@/service/api/googleDriveApi';
import { createStoreMocks } from '../../helpers/store';

describe('store/modules/folder.js', () => {
    let apiSpy;
    const mocks = createStoreMocks();

    beforeEach(() => {
        jest.spyOn(mocks, 'commit');
        jest.spyOn(mocks, 'dispatch');
        apiSpy = jest.spyOn(googleDriveApi, 'folderAsync');
    });

    afterEach(() => {
        clearState(repoModule.state);
        apiSpy.mockRestore();
    });

    describe('state', () => {
        it('defines an all array', () => {
            expect(repoModule.state.all).toBeInstanceOf(Array);
        });

        it('defines a selected folder', () => {
            expect(repoModule.state.selected).toBe('root');
        });

        it('defines pagination defaults', () => {
            expect(repoModule.state.page).toBe(1);
            expect(repoModule.state.pageTokens).toBeInstanceOf(Array);
            expect(repoModule.state.pageNext).toBe(false);
            expect(repoModule.state.pagePrev).toBe(false);
        });

        it('defines a parent', () => {
            expect(repoModule.state.parentId).toBe('');
        });
    });

    describe('actions', () => {

        it('commits the clear action', () => {
            repoModule.actions[folderClear](mocks);
            expect(mocks.commit).toHaveBeenCalledWith(folderClear);
        });

        describe('fetch', () => {
            const folder = {folderId: 'foo', page: 2};
    
            beforeEach(async () => {
                repoModule.state.pageTokens = ['test1', 'test2'];
                apiSpy.mockResolvedValue({ data: { folders: ['foo', 'bar'], parentId: 'baz', pagination: {nextPageToken: 42} } });
                await repoModule.actions[folderFetch](mocks, folder);
            });
    
            it('does not commit clear', () => {
                expect(mocks.commit).not.toHaveBeenCalledWith(folderClear);
            });

            it('passes folder and page token to the API', () => {
                expect(apiSpy).toHaveBeenCalledWith('foo', 'test2');
            });

            it('commits the fetch result', () => {
                expect(mocks.commit).toHaveBeenCalledWith(folderFetch, {
                    folders: ['foo', 'bar'],
                    page: folder.page,
                    pageNext: true,
                    pagePrev: true,
                    parentId: 'baz'
                });
            });
        });

        describe('fetch using defaults', () => {

            beforeEach(async () => {
                apiSpy.mockResolvedValue({ data: { folders: ['foo', 'bar'], parentId: 'baz', pagination: {} } });
                await repoModule.actions[folderFetch](mocks);
            });

            it('commits clear when no folder present', () => {
                expect(mocks.commit).toHaveBeenCalledWith(folderClear);
            });

            it('commits the fetch result', () => {
                expect(mocks.commit).toHaveBeenCalledWith(folderClear);
                expect(mocks.commit).toHaveBeenCalledWith(folderFetch, {
                    folders: ['foo', 'bar'],
                    page: 1,
                    pageNext: false,
                    pagePrev: false,
                    parentId: 'baz'
                });
            });

            it('passes folder and page token to the API', () => {
                expect(apiSpy).toHaveBeenCalledWith('', '');
            });
        });

        describe('select using defaults', () => {
            const folder = {id: 'foo', mimeType: 'bar'};

            beforeEach(async () => {
                await repoModule.actions[folderSelected](mocks, folder);
            });

            it('commits selected folder', () => {
                expect(mocks.commit).toHaveBeenCalledWith(folderSelected, folder.id);
            });

            it('dispatches the folder', () => {
                expect(mocks.dispatch).toHaveBeenCalledWith(folderFetch, {
                    folderId: folder.id
                });
            });
        });

        describe('select for application/json', () => {
            const folder = {id: 'foo', mimeType: 'application/json'};

            beforeEach(async () => {
                await repoModule.actions[folderSelected](mocks, folder);
            });

            it('commits selected folder', () => {
                expect(mocks.commit).toHaveBeenCalledWith(folderSelected, folder.id);
            });

            it('does not dispatch the folder', () => {
                expect(mocks.dispatch).not.toHaveBeenCalled();
            });
        });

        describe('navigate back', () => {
            const parentId = 'foo';

            beforeEach(async () => {
                repoModule.state.parentId = parentId;
                await repoModule.actions[folderNavigateBack]({
                    commit: mocks.commit,
                    dispatch: mocks.dispatch,
                    state: repoModule.state
                });
            });

            it('commits selected folder', () => {
                expect(mocks.commit).toHaveBeenCalledWith(folderSelected, parentId);
            });

            it('dispatches the folder', () => {
                expect(mocks.dispatch).toHaveBeenCalledWith(folderFetch, {
                    folderId: parentId
                });
            });
        });
    });

    describe('mutations', () => {

        describe('clear', () => {
            beforeEach(() => {
                repoModule.state.all.push('test1', 'test2');
                repoModule.state.selected = 'github';
                repoModule.state.page = 5;
                repoModule.state.pageTokens = ['foo', 'bar'];
                repoModule.state.pageNext = true;
                repoModule.state.pagePrev = true;
                repoModule.state.parentId = 'foobar';
                repoModule.mutations[folderClear](repoModule.state);
            });

            it('resets properties', () => {
                expect(repoModule.state.all).toHaveLength(0);
                expect(repoModule.state.selected).toBe('root');
                expect(repoModule.state.parentId).toBe('');
            });

            it('resets page properties', () => {
                expect(repoModule.state.page).toBe(1);
                expect(repoModule.state.pageTokens[0]).toBe('');
                expect(repoModule.state.pageNext).toBe(false);
                expect(repoModule.state.pagePrev).toBe(false);
            });
        });

        describe('fetch', () => {
            const testFolders = {
                folders: ['test1', 'test2'],
                page: 99,
                pageNext: false,
                pagePrev: false,
                parentId: 'foobar'
            };

            beforeEach(() => {
                repoModule.state.all.push('foo', 'bar', 'baz');
                repoModule.state.page = 5;
                repoModule.state.pageNext = true;
                repoModule.state.pagePrev = true;
                repoModule.state.parentId = 'baz';
                repoModule.mutations[folderFetch](repoModule.state, testFolders);
            });

            it('copies the repo properties', () => {
                expect(repoModule.state.all).toHaveLength(2);
                expect(repoModule.state.all[1]).toBe('test2');
                expect(repoModule.state.parentId).toBe('foobar');
            });

            it('copies the page properties', () => {
                expect(repoModule.state.page).toBe(99);
                expect(repoModule.state.pageNext).toBe(false);
                expect(repoModule.state.pagePrev).toBe(false);
            });
        });

        describe('selected', () => {
            it('selects the folder', () => {
                repoModule.mutations[folderSelected](repoModule.state, 'foo');
                expect(repoModule.state.selected).toBe('foo');
            });
        });
    });
});
