const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    updateMenu: () => ipcRenderer.send('update-menu')
})
