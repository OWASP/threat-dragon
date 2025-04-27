import env from '../env/Env.js';
import { google } from 'googleapis';
import loggerHelper from '../helpers/logger.helper.js';

const logger = loggerHelper.get('repositories/googledrive.js');

const getClient = (accessToken) => {
    const oauth2Client = new google.auth.OAuth2(
        env.get().config.GOOGLE_CLIENT_ID,
        env.get().config.GOOGLE_CLIENT_SECRET,
        env.get().config.GOOGLE_REDIRECT_URI
    );
    oauth2Client.setCredentials({ access_token: accessToken });
    return oauth2Client;
};

const getFolderDetailsAsync = async (folderId, accessToken) => {
    logger.debug(`Getting folder details for folder ID: ${folderId}`);

    const auth = getClient(accessToken);
    const driveClient = google.drive({ version: 'v3', auth });

    const res = await driveClient.files.get({
        fileId: folderId,
        fields: 'id, name, mimeType'
    });

    logger.debug(`Retrieved folder details for: ${res.data.name}`);
    logger.audit(
        `Data access: Retrieved folder details for Google Drive folder ${res.data.name} (${folderId})`
    );

    return res.data;
};

const listFilesInFolderAsync = async (folderId, pageToken, accessToken) => {
    logger.debug(`Listing files in folder ID: ${folderId}, page token: ${pageToken || 'none'}`);

    const auth = getClient(accessToken);
    const driveClient = google.drive({ version: 'v3', auth });

    const res = await driveClient.files.list({
        q: `'${folderId}' in parents and (mimeType='application/vnd.google-apps.folder' or mimeType='application/json')`,
        fields: 'nextPageToken, files(id, name, parents, mimeType)',
        pageSize: 10,
        ...(pageToken ? { pageToken } : {})
    });

    logger.debug(`Retrieved ${res.data.files.length} files/folders from Google Drive`);
    logger.audit(
        `Data access: Retrieved ${res.data.files.length} files/folders from Google Drive folder (${folderId})`
    );

    return {
        folders: res.data.files,
        nextPageToken: res.data.nextPageToken
    };
};

const getFolderParentIdAsync = async (folderId, accessToken) => {
    logger.debug(`Getting parent ID for folder ID: ${folderId}`);

    const auth = getClient(accessToken);
    const driveClient = google.drive({ version: 'v3', auth });

    const res = await driveClient.files.get({
        fileId: folderId,
        fields: 'id, name, parents'
    });

    const parentId = res.data.parents ? res.data.parents[0] : '';

    logger.debug(`Retrieved parent ID: ${parentId} for folder: ${res.data.name}`);
    logger.audit(
        `Data access: Retrieved parent folder information for Google Drive folder ${res.data.name} (${folderId})`
    );

    return parentId;
};

const getFileContentAsync = async (fileId, accessToken) => {
    logger.debug(`Getting file content for file ID: ${fileId}`);

    const auth = getClient(accessToken);
    const driveClient = google.drive({ version: 'v3', auth });

    // First get the file metadata to log the file name
    const metaRes = await driveClient.files.get({
        fileId: fileId,
        fields: 'id, name'
    });

    const res = await driveClient.files.get({
        fileId: fileId,
        alt: 'media'
    });

    logger.debug(`Retrieved content for file: ${metaRes.data.name}`);
    logger.audit(
        `Data access: Retrieved threat model content from Google Drive file ${metaRes.data.name} (${fileId})`
    );

    return res.data;
};

const createFileInFolderAsync = async (folderId, fileName, fileContent, accessToken) => {
    logger.info(`Creating file "${fileName}" in folder ID: ${folderId}`);

    const auth = getClient(accessToken);
    const driveClient = google.drive({ version: 'v3', auth });

    let folderName = folderId;

    // Get folder name for better logging
    try {
        const folderRes = await driveClient.files.get({
            fileId: folderId,
            fields: 'id, name'
        });

        if (folderRes && folderRes.data && folderRes.data.name) {
            folderName = folderRes.data.name;
        }
    } catch (error) {
        logger.warn(`Could not get folder name for logging: ${error.message}`);
    }

    const fileMetadata = {
        name: fileName,
        parents: [folderId]
    };

    const media = {
        mimeType: 'application/json',
        body: JSON.stringify(fileContent, null, '  ')
    };

    const res = await driveClient.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id'
    });

    if (res && res.data && res.data.id) {
        logger.info(`Created file with ID: ${res.data.id}`);
    } else {
        logger.info(`Created file in folder ${folderId}`);
    }

    logger.audit(
        `Data modification: Created threat model file "${fileName}" in Google Drive folder ${folderName} (${folderId})`
    );

    return res && res.data ? res.data : res;
};

const updateFileAsync = async (fileId, fileContent, accessToken) => {
    logger.info(`Updating file with ID: ${fileId}`);

    const auth = getClient(accessToken);
    const driveClient = google.drive({ version: 'v3', auth });

    let fileName = fileId;

    // Get file name for better logging
    try {
        const fileRes = await driveClient.files.get({
            fileId: fileId,
            fields: 'id, name'
        });

        if (fileRes && fileRes.data && fileRes.data.name) {
            fileName = fileRes.data.name;
            logger.info(`Updating file: ${fileName}`);
        }
    } catch (error) {
        logger.warn(`Could not get file name for logging: ${error.message}`);
    }

    const media = {
        mimeType: 'application/json',
        body: JSON.stringify(fileContent, null, '  ')
    };

    const res = await driveClient.files.update({
        fileId: fileId,
        media: media,
        fields: 'id'
    });

    if (res && res.data && res.data.id) {
        logger.info(`Updated file with ID: ${res.data.id}`);
    } else {
        logger.info(`Updated file with ID: ${fileId}`);
    }

    logger.audit(
        `Data modification: Updated threat model file "${fileName}" (${fileId}) in Google Drive`
    );

    return res && res.data ? res.data : res;
};

const deleteFileAsync = async (fileId, accessToken) => {
    logger.info(`Deleting file with ID: ${fileId}`);

    const auth = getClient(accessToken);
    const driveClient = google.drive({ version: 'v3', auth });

    // Get file name for better logging
    try {
        const fileRes = await driveClient.files.get({
            fileId: fileId,
            fields: 'id, name'
        });

        await driveClient.files.delete({
            fileId: fileId
        });

        logger.info(`Deleted file: ${fileRes.data.name}`);
        logger.audit(
            `Data modification: Deleted threat model file "${fileRes.data.name}" (${fileId}) from Google Drive`
        );
    } catch (error) {
        // If file doesn't exist or can't be accessed, just log the deletion attempt
        logger.warn(`Could not get file details before deletion: ${error.message}`);

        await driveClient.files.delete({
            fileId: fileId
        });

        logger.info(`Deleted file with ID: ${fileId}`);
        logger.audit(
            `Data modification: Deleted threat model file with ID ${fileId} from Google Drive`
        );
    }

    return { success: true };
};

export default {
    getFolderDetailsAsync,
    getFolderParentIdAsync,
    listFilesInFolderAsync,
    getFileContentAsync,
    createFileInFolderAsync,
    updateFileAsync,
    deleteFileAsync
};
