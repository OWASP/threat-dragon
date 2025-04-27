// preload.js
const { contextBridge, ipcRenderer } = require('electron');

// Instead of directly requiring the passive-events-support module,
// we'll implement a simplified version of the functionality
// This avoids webpack parsing issues with the module
const setupPassiveSupport = () => {
    try {
        // Check if passive event listeners are supported
        let passiveSupported = false;
        try {
            const options = {
                get passive() {
                    passiveSupported = true;
                    return true;
                }
            };
            
            // Test passive listener support
            window.addEventListener('test', null, options);
            window.removeEventListener('test', null, options);
        } catch (err) {
            passiveSupported = false;
        }
        
        // List of events that should use passive listeners when possible
        const passiveEvents = [
            'touchstart', 'touchmove', 'touchenter', 'touchend', 'touchleave',
            'wheel', 'mousewheel'
        ];
        
        // Only proceed if we need to patch and we're in a browser environment
        if (passiveSupported && typeof window !== 'undefined' && window.EventTarget) {
            // Store the original addEventListener
            const originalAddEventListener = EventTarget.prototype.addEventListener;
            
            // Override addEventListener
            EventTarget.prototype.addEventListener = function(type, listener, options) {
                // If this is a passive-eligible event and no explicit passive option was provided
                if (passiveEvents.includes(type) && (!options || options.passive === undefined)) {
                    // Check if the listener uses preventDefault
                    const listenerStr = listener.toString();
                    const usesPreventDefault = listenerStr.includes('preventDefault');
                    
                    // Set passive option based on preventDefault usage
                    const newOptions = typeof options === 'object' ? { ...options } : {};
                    newOptions.passive = !usesPreventDefault;
                    
                    // Call original with new options
                    originalAddEventListener.call(this, type, listener, newOptions);
                } else {
                    // Call original with unchanged arguments
                    originalAddEventListener.call(this, type, listener, options);
                }
            };
        }
    } catch (err) {
        console.warn('Failed to setup passive event support:', err.message);
    }
};

// Setup passive event support when the window is available
if (typeof window !== 'undefined') {
    setupPassiveSupport();
}

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing all of electron's API
contextBridge.exposeInMainWorld('electronAPI', {
    // Check if running in Electron
    isElectron: true,

    // Renderer to main process (sending)
    appClose: () => ipcRenderer.send('app-close'),
    modelClosed: (fileName) => ipcRenderer.send('model-closed', fileName),
    modelOpenConfirmed: (fileName) => ipcRenderer.send('model-open-confirmed', fileName),
    modelOpened: (fileName) => ipcRenderer.send('model-opened', fileName),
    modelPrint: (format) => ipcRenderer.send('model-print', format),
    modelSave: (modelData, fileName) => ipcRenderer.send('model-save', modelData, fileName),
    updateMenu: (locale) => ipcRenderer.send('update-menu', locale),
    quitAndInstall: () => ipcRenderer.send('quit-and-install'),
    // Add reload-window message for logout functionality
    send: (channel, ...args) => {
        // Only allow specific channels for security
        const allowedChannels = ['reload-window'];
        if (allowedChannels.includes(channel)) {
            ipcRenderer.send(channel, ...args);
        }
    },

    // Main to renderer process (receiving)
    onCloseAppRequest: (callback) => ipcRenderer.on('close-app-request', callback),
    onCloseModelRequest: (callback) => ipcRenderer.on('close-model-request', callback),
    onNewModelRequest: (callback) => ipcRenderer.on('new-model-request', callback),
    onOpenModel: (callback) => ipcRenderer.on('open-model', callback),
    onOpenModelRequest: (callback) => ipcRenderer.on('open-model-request', callback),
    onPrintModelRequest: (callback) => ipcRenderer.on('print-model-request', callback),
    onSaveModelRequest: (callback) => ipcRenderer.on('save-model-request', callback),
    onModelSaveResult: (callback) => ipcRenderer.on('model-save-result', callback),
    offModelSaveResult: (callback) => ipcRenderer.removeListener('model-save-result', callback),
    onUpdateAvailable: (callback) => ipcRenderer.on('update-available', callback),
    onUpdateDownloaded: (callback) => ipcRenderer.on('update-downloaded', callback),

    // Invoke functions (async calls that return a result)
    getAppVersion: () => ipcRenderer.invoke('get-app-version'),
    getAppName: () => ipcRenderer.invoke('get-app-name'),
    getOsVersion: () => ipcRenderer.invoke('get-os-version'),
    openFile: () => ipcRenderer.invoke('open-file'),
    saveFile: (content, suggestedFileName) =>
        ipcRenderer.invoke('save-file', content, suggestedFileName),
    getThreatModelPath: () => ipcRenderer.invoke('get-threat-model-path'),
    getProviderLogon: () => ipcRenderer.invoke('get-provider-logon'),
    getRecentModelList: () => ipcRenderer.invoke('get-recent-model-list'),
    updateRecentModelList: (list) => ipcRenderer.invoke('update-recent-model-list', list)
});
