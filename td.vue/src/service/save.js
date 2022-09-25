/**
 * Saves the file locally
 * @param {Object} data
 * @param {string} fileName
 */
const local = (data, fileName) => {
    // TODO: Split into local browser and electron-specific saving
    const contentType = 'application/json';
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: contentType });
    const a = document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = fileName;
    a.click();
    a.remove();
};

export default {
    local
};
