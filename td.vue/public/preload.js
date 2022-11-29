const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    // renderer to electron main
    updateMenu: (locale) => ipcRenderer.send('update-menu', locale),
    modelClosed: (fileName) => ipcRenderer.send('model-closed', fileName),
    modelOpened: (fileName) => ipcRenderer.send('model-opened', fileName),
    modelSaved: (modelData, fileName) => ipcRenderer.send('model-saved', modelData, fileName),

    // electron main to renderer
    onCloseModel: (callback) => ipcRenderer.on('close-model', callback)
});
