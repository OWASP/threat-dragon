const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    updateMenu: (locale) => ipcRenderer.send('update-menu', locale),
    saveModel: (/*model*/) => ipcRenderer.send('save-model'/*, model*/)
});
