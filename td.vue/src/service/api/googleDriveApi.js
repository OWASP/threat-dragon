import api from './api.js';

const resource = '/api/googleproviderthreatmodel';

/**
 * Gets the google drive folders for the given user
 * @returns {Promise}
 */
const folderAsync = (folderId='root', page = 1) => {
    return api.getAsync(`${resource}/folders`, { params: { page: page, folderId: folderId } });
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
