import googleDriveApi from '@/service/api/googleDriveApi.js';

export const FOLDER_CLEAR = 'FOLDER_CLEAR';
export const FOLDER_FETCH = 'FOLDER_FETCH';
export const FOLDER_SELECTED = 'FOLDER_SELECTED';
export const FOLDER_NAVIGATE_BACK = 'FOLDER_NAVIGATE_BACK';

const actions = {
    [FOLDER_FETCH]: async ({ commit }, { page, folderId, accessToken }) => {
        console.log('Action - Access Token:', accessToken); // Add this line
        try {
            const response = await googleDriveApi.folderAsync(folderId, page, accessToken);
            commit('SET_FOLDERS', response.folders);
            commit('SET_PAGINATION', response.pagination);
            commit('SET_PARENT_ID', response.parentId);
        } catch (error) {
            console.error('Error fetching folders:', error);
            throw error;
        }
    }
};

export default {
    actions,
    types: { FOLDER_FETCH }
};