import api from './api.js';
import store from '@/store'; // Import the Vuex store

const resource = '/api/googleproviderthreatmodel';

/**
 * Gets the google drive folders for the given user
 * @returns {Promise}
 */
const folderAsync = (folderId = 'root', page = 1, accessToken) => {
    return api.getAsync(`${resource}/folders`, {
        params: { page, folderId },
        headers: { Authorization: `Bearer ${accessToken}` }
    });
};

const createAsync = (folder, fileContent, fileName) => {
    return api.postAsync(`${resource}/${folder}/create`, {fileContent, fileName});
};

const updateAsync = (fileId, fileContent) => {
    return api.putAsync(`${resource}/${fileId}/update`, {fileContent});
};

const modelAsync = (fileId) => {
    return api.getAsync(`${resource}/${fileId}/data`);
};

export default {
    folderAsync,
    createAsync,
    updateAsync,
    modelAsync
};