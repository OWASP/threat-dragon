const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    updateMenu: (locale) => ipcRenderer.send('update-menu', locale),
    openModel: () => ipcRenderer.invoke('open-model'),
    modelClosed: (fileName) => ipcRenderer.send('model-closed', fileName),
    modelOpened: (fileName) => ipcRenderer.send('model-opened', fileName),
    modelSaved: (modelData, fileName) => ipcRenderer.send('model-saved', modelData, fileName)
});
