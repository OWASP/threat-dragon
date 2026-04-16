const { contextBridge, ipcRenderer } = require('electron')

if (process.env.IS_TEST === 'true') {
    require('wdio-electron-service/preload');
}

contextBridge.exposeInMainWorld('electronAPI', {
    // renderer to electron main
    appClose: () => ipcRenderer.send('close-app'),
    modelClosed: (fileName) => ipcRenderer.send('model-closed', fileName),
    modelOpenConfirmed: (fileName) => ipcRenderer.send('model-open-confirmed', fileName),
    modelOpened: (fileName) => ipcRenderer.send('model-opened', fileName),
    modelPrint: (format) => ipcRenderer.send('model-print', format),
    modelSave: (modelData, fileName) => ipcRenderer.send('model-save', modelData, fileName),
    updateMenu: (locale) => ipcRenderer.send('update-menu', locale),

    // electron main to renderer
    onCloseAppRequest: (callback) => ipcRenderer.on('close-app-request', callback),
    onCloseModelRequest: (callback) => ipcRenderer.on('close-model-request', callback),
    onNewModelRequest: (callback) => ipcRenderer.on('new-model-request', callback),
    onOpenModel: (callback) => ipcRenderer.on('open-model', callback),
    onOpenModelRequest: (callback) => ipcRenderer.on('open-model-request', callback),
    onPrintModelRequest: (callback) => ipcRenderer.on('print-model-request', callback),
    onPrintModelConfirmed: (callback) => ipcRenderer.on('print-model-confirmed', callback),
    onSaveModelRequest: (callback) => ipcRenderer.on('save-model-request', callback),
    onSaveModelConfirmed: (callback) => ipcRenderer.on('save-model-confirmed', callback),
    onSaveModelFailed: (callback) => ipcRenderer.on('save-model-failed', callback)
});
