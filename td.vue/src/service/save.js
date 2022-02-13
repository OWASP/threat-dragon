import env from './env.js';

/**
 * Saves the threat model using electron specific APIs
 * @param {Object} data
 * @param {string} fileName
 */
const saveElectron = (data, fileName) => {
    console.log(data);
    console.log(fileName);
    console.warn('Not implemented - TODO');
};

/**
 * Saves a local copy from the browser.
 * This appears to the user as a download
 * @param {Object} data
 * @param {string} fileName
 */
const saveLocalBrowser = (data, fileName) => {
    const contentType = 'application/json';
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: contentType });
    var a = document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = fileName;
    a.click();
    a.remove();
};

/**
 * Helper that figures out how to save the model.  
 * There are different flows for electron, vs browser local vs github
 * @param {Vuex.Store} store
 * @param {Object} data
 * @param {string} fileName
 */
const local = (data, fileName) => {
    if (env.isElectron()) {
        saveElectron(data, fileName);
    } else {
        saveLocalBrowser(data, fileName);
    }
};

export default {
    local
};
