// preload.js
const { contextBridge, ipcRenderer } = require('electron');

// Try to load passive events support for use in renderer process
try {
    const passiveEventsSupport = require('passive-events-support/dist/main.js');
    if (passiveEventsSupport && typeof passiveEventsSupport.configure === 'function') {
        passiveEventsSupport.configure({
            strict: false,
            capture: false
        });
    }
} catch (err) {
    console.warn('Failed to load passive-events-support:', err.message);
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
