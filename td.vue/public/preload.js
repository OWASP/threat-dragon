const { contextBridge, ipcRenderer } = require('electron')

if (process.env.IS_TEST === 'true') {
    require('wdio-electron-service/preload');
}

contextBridge.exposeInMainWorld('electronAPI', {
    // renderer to electron main
    updateMenu: (locale) => ipcRenderer.send('update-menu', locale),
    modelClosed: (fileName) => ipcRenderer.send('model-closed', fileName),
    modelModified: (modified) => ipcRenderer.send('model-modified', modified),
    modelOpenConfirmed: (fileName) => ipcRenderer.send('model-open-confirmed', fileName),
    modelOpened: (fileName) => ipcRenderer.send('model-opened', fileName),
    modelPrint: (printer) => ipcRenderer.send('model-print', printer),
    modelSaved: (modelData, fileName) => ipcRenderer.send('model-saved', modelData, fileName),

    // electron main to renderer
    onCloseModelRequest: (callback) => ipcRenderer.on('close-model-request', callback),
    onNewModelRequest: (callback) => ipcRenderer.on('new-model-request', callback),
    onOpenModel: (callback) => ipcRenderer.on('open-model', callback),
    onOpenModelRequest: (callback) => ipcRenderer.on('open-model-request', callback),
    onPrintModelRequest: (callback) => ipcRenderer.on('print-model-request', callback),
    onSaveModel: (callback) => ipcRenderer.on('save-model', callback)
});
