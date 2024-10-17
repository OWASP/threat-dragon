/**
 * Saves the file locally
 * @param {Object} data
 * @param {string} fileName
 */
const local = (data, fileName) => {
    saveTD(data, fileName);
};

function saveTD (data, fileName) {
    if ('showSaveFilePicker' in self) {
        console.debug('Save using browser file picker');
        writeFile(data, fileName);
    } else {
        console.debug('Save using browser local filesystem download');
        downloadFile(data, fileName);
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
    var fileHandle = null;
    const options = {
        suggestedName: fileName,
        types: [
            {
                description: 'Threat Model',
                accept: {
                    'application/json': ['.json'],
                },
            },
        ],
    };

    try {
        fileHandle = await window.showSaveFilePicker(options);
    } catch (err) {
        console.debug('Save failed, probably user canceled file picker');
        return;
    }

    if ( await verifyPermission(fileHandle) ) {
        const writable = await fileHandle.createWritable();
        try {
            await writable.write({ type: 'write', position: 0, data: jsonData });
        } catch (err) {
            console.debug('Save failed, could not write to filesystem');
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
