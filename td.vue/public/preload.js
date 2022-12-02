const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    // renderer to electron main
    updateMenu: (locale) => ipcRenderer.send('update-menu', locale),
    modelClosed: (fileName) => ipcRenderer.send('model-closed', fileName),
    modelOpened: (fileName) => ipcRenderer.send('model-opened', fileName),
    modelSaved: (fileName, modelData) => ipcRenderer.send('model-saved', fileName, modelData),

    // electron main to renderer
    onCloseModel: (callback) => ipcRenderer.on('close-model', callback),
    onModelData: (callback) => ipcRenderer.on('model-data', callback),
    onNewModel: (callback) => ipcRenderer.on('new-model', callback),
    onOpenModel: (callback) => ipcRenderer.on('open-model', callback)
});
