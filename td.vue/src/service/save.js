import openThreatModel from '../service/openThreatModel.js';

/**
 * Saves the file locally
 * @param {Object} data
 * @param {string} fileName
 * @param {string} format
 */
const local = (data, fileName, format) => {
    if (format == 'otm'){
        saveOTM(data, fileName);
    }
    else{
        saveTD(data, fileName);
    }
};

function saveOTM (data, fileName) {
    var otm = openThreatModel.convertTDtoOTM(data);
    var saveOTM = JSON.stringify(otm);

    const contentType = 'application/json';
    const otmblob = new Blob([saveOTM], { type: contentType });
    const a = document.createElement('a');
    a.href = window.URL.createObjectURL(otmblob);
    a.download = fileName;
    a.click();
    a.remove();
}

function saveTD (data, fileName) {
    // TODO: Split into local browser and electron-specific saving
    const contentType = 'application/json';
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: contentType });
    const a = document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = fileName;
    a.click();
    a.remove();
}

export default {
    local
};
