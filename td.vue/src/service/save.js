/**
 * Saves the file locally
 * This automatically opens the save prompt in electron
 * @param {Object} data
 * @param {string} fileName
 */
const local = (data, fileName) => {
    const contentType = 'application/json';
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: contentType });
    var a = document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = fileName;
    a.click();
    a.remove();
};

export default {
    local
};
