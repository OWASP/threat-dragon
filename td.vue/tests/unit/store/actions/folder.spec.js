import { FOLDER_CLEAR, FOLDER_FETCH, FOLDER_SELECTED, FOLDER_NAVIGATE_BACK } from '@/store/actions/folder.js';
import folderActions from '@/store/actions/folder.js';
import googleDriveApi from '@/service/api/googleDriveApi.js';

// Mock the googleDriveApi
jest.mock('@/service/api/googleDriveApi.js', () => ({
    folderAsync: jest.fn()
}));

describe('store/actions/folder.js', () => {
    // Tests for action type constants
    describe('action types', () => {
        it('defines a clear action', () => {
            expect(FOLDER_CLEAR).toBe('FOLDER_CLEAR');
        });
        
        it('defines a fetch action', () => {
            expect(FOLDER_FETCH).toBe('FOLDER_FETCH');
        });
        
        it('defines a selected action', () => {
            expect(FOLDER_SELECTED).toBe('FOLDER_SELECTED');
        });

        it('defines a navigate back action', () => {
            expect(FOLDER_NAVIGATE_BACK).toBe('FOLDER_NAVIGATE_BACK');
        });

        it('exports all action types', () => {
            expect(folderActions.types).toEqual({
                FOLDER_FETCH
            });
        });
    });

    // Tests for FOLDER_FETCH action
    describe('FOLDER_FETCH action', () => {
        let commit, mockResponse;

        beforeEach(() => {
            commit = jest.fn();
            // Create a mock response for the folderAsync call
            mockResponse = {
                folders: [
                    { id: 'folder1', name: 'Folder 1' },
                    { id: 'folder2', name: 'Folder 2' }
                ],
                pagination: {
                    nextPageToken: 'next-token',
                    prevPageToken: 'prev-token'
                },
                parentId: 'parent-folder'
            };
            
            // Reset and set up the mock implementation
            googleDriveApi.folderAsync.mockReset();
            googleDriveApi.folderAsync.mockResolvedValue(mockResponse);
        });

        it('fetches folders and commits the result', async () => {
            const folderId = 'test-folder';
            const page = 1;
            const accessToken = 'test-token';

            // Call the action
            await folderActions.actions[FOLDER_FETCH]({ commit }, { folderId, page, accessToken });

            // Verify API call
            expect(googleDriveApi.folderAsync).toHaveBeenCalledWith(folderId, page, accessToken);

            // Verify commits
            expect(commit).toHaveBeenCalledWith('SET_FOLDERS', mockResponse.folders);
            expect(commit).toHaveBeenCalledWith('SET_PAGINATION', mockResponse.pagination);
            expect(commit).toHaveBeenCalledWith('SET_PARENT_ID', mockResponse.parentId);
        });

        it('handles API errors gracefully', async () => {
            // Set up the mock to reject
            const testError = new Error('API Error');
            googleDriveApi.folderAsync.mockRejectedValue(testError);
            
            // Mock console.error to prevent test output pollution
            console.error = jest.fn();

            // Call the action and expect it to throw
            await expect(
                folderActions.actions[FOLDER_FETCH]({ commit }, { folderId: 'test', page: 1, accessToken: 'token' })
            ).rejects.toThrow(testError);

            // Verify error is logged
            expect(console.error).toHaveBeenCalledWith(expect.stringMatching(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z\]\[ERROR\]\[store:actions:folder\] Error fetching folders:/), { error: testError });
            
            // Verify no commits were made
            expect(commit).not.toHaveBeenCalled();
        });

        it('uses correct default values when none provided', async () => {
            // Call with minimal parameters
            await folderActions.actions[FOLDER_FETCH]({ commit }, {});

            // Verify it called the API with expected defaults
            expect(googleDriveApi.folderAsync).toHaveBeenCalledWith(undefined, undefined, undefined);
        });
    });
});