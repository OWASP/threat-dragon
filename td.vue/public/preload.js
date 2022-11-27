const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    updateMenu: (locale) => ipcRenderer.send('update-menu', locale),
    openModel: () => ipcRenderer.invoke('dialog:openModel'),
    modelSaved: (fileName) => ipcRenderer.send('save-model', fileName),
    modelClosed: (fileName) => ipcRenderer.send('close-model', fileName)
});
