const { contextBridge, ipcRenderer } = require('electron')

if (process.env.IS_TEST === 'true') {
    require('wdio-electron-service/preload');
}

contextBridge.exposeInMainWorld('electronAPI', {
    // renderer to electron main
    updateMenu: (locale) => ipcRenderer.send('update-menu', locale),
    modelClosed: (fileName) => ipcRenderer.send('model-closed', fileName),
    modelModified: (modified) => ipcRenderer.send('model-modified', modified),
    modelOpened: (fileName) => ipcRenderer.send('model-opened', fileName),
    modelPrint: (printer) => ipcRenderer.send('model-print', printer),
    modelSaved: (modelData, fileName) => ipcRenderer.send('model-saved', modelData, fileName),

    // electron main to renderer
    onCloseModelRequest: (callback) => ipcRenderer.on('close-model-request', callback),
    onNewModel: (callback) => ipcRenderer.on('new-model', callback),
    onOpenModel: (callback) => ipcRenderer.on('open-model', callback),
    onPrintModel: (callback) => ipcRenderer.on('print-model', callback),
    onSaveModel: (callback) => ipcRenderer.on('save-model', callback)
});
