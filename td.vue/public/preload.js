const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    updateMenu: (locale) => ipcRenderer.send('update-menu', locale)
});
