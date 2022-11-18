const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    updateMenu: (locale) => ipcRenderer.send('update-menu', locale),
    openModel: () => ipcRenderer.invoke('dialog:openModel'),
    saveModel: () => ipcRenderer.send('save-model'),
    closeModel: () => ipcRenderer.send('close-model')
});
