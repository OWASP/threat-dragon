import api from './api.js';

const resource = '/api/googleproviderthreatmodel';

/**
 * Gets the google drive folders for the given user
 * @param {string} folderId - The folder ID to list (defaults to 'root')
 * @param {number} page - Pagination page number
 * @returns {Promise}
 */
const folderAsync = (folderId = 'root', page = 1) => {
    return api.getAsync(`${resource}/folders`, {
        params: { page, folderId }
    });
};

/**
 * Creates a new file in a Google Drive folder
 * @param {string} folder - The folder ID to create the file in
 * @param {object} fileContent - The content to save in the file
 * @param {string} fileName - The name for the new file
 * @returns {Promise}
 */
const createAsync = (folder, fileContent, fileName) => {
    return api.postAsync(`${resource}/${folder}/create`, { fileContent, fileName });
};

/**
 * Updates an existing file in Google Drive
 * @param {string} fileId - The file ID to update
 * @param {object} fileContent - The new content for the file
 * @returns {Promise}
 */
const updateAsync = (fileId, fileContent) => {
    return api.putAsync(`${resource}/${fileId}/update`, { fileContent });
};

/**
 * Gets the content of a threat model file from Google Drive
 * @param {string} fileId - The file ID to read
 * @returns {Promise}
 */
const modelAsync = (fileId) => {
    return api.getAsync(`${resource}/${fileId}/data`);
};

export default {
    folderAsync,
    createAsync,
    updateAsync,
    modelAsync
};
