/**
 * Saves the file locally
 * @param {Object} data
 * @param {string} fileName
 */
import logger from '@/utils/logger.js';
const log = logger.getLogger('service:save');
const local = (data, fileName) => {
    return saveTD(data, fileName);
};

function saveTD(data, fileName) {
    // Check if running in Electron
    const isElectronEnv =
        typeof window !== 'undefined' && window.electronAPI && window.electronAPI.isElectron;

    if (isElectronEnv) {
        log.debug('Save using Electron file dialog');
        return saveElectron(data, fileName);
    } else if ('showSaveFilePicker' in window) {
        log.debug('Save using browser file picker');
        return writeFile(data, fileName);
    } else {
        log.debug('Save using browser local filesystem download');
        return downloadFile(data, fileName);
    }
}

async function saveElectron(data, fileName) {
    const jsonData = JSON.stringify(data, null, 2);
    try {
        // Use Electron's saveFile function via IPC
        const result = await window.electronAPI.saveFile(jsonData, fileName);
        log.debug('Electron save successful', { result });
        return result;
    } catch (err) {
        log.error('Electron save failed', { error: err });
        throw err;
    }
}

function downloadFile(data, fileName) {
    const contentType = 'application/json';
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: contentType });
    const a = document.createElement('a');

    a.href = window.URL.createObjectURL(blob);
    a.download = fileName;
    a.click();
    a.remove();
}

async function writeFile(data, fileName) {
    const jsonData = JSON.stringify(data, null, 2);
    let fileHandle = null;
    const options = {
        suggestedName: fileName,
        types: [
            {
                description: 'Threat Model',
                accept: {
                    'application/json': ['.json']
                }
            }
        ]
    };

    try {
        fileHandle = await window.showSaveFilePicker(options);
    } catch (err) {
        log.debug('Save failed, probably user canceled file picker');
        return;
    }

    if (await verifyPermission(fileHandle)) {
        const writable = await fileHandle.createWritable();
        try {
            await writable.write({ type: 'write', position: 0, data: jsonData });
        } catch (err) {
            log.debug('Save failed, could not write to filesystem');
        }
        await writable.close();
    }
}

async function verifyPermission(fileHandle) {
    const options = { mode: 'readwrite' };

    // Check if permission was already granted. If so, return true.
    if ((await fileHandle.queryPermission(options)) === 'granted') {
        return true;
    }

    // Request permission. If the user grants permission, return true.
    if ((await fileHandle.requestPermission(options)) === 'granted') {
        return true;
    }

    return false;
}

export default {
    local
};
