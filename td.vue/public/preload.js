const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    updateMenu: (locale) => ipcRenderer.send('update-menu', locale),
    openModel: () => ipcRenderer.invoke('open-model'),
    modelSaved: (modelData, fileName) => ipcRenderer.send('save-model', modelData, fileName),
    modelClosed: (fileName) => ipcRenderer.send('close-model', fileName)
});
