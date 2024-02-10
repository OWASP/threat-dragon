/**
 * Saves the file locally
 * @param {Object} data
 * @param {string} fileName
 */
const local = (data, fileName) => {
    saveTD(data, fileName);
};

function saveTD (data, fileName) {
    // saving using local browser  
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
