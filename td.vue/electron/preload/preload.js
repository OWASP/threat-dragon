import { contextBridge, ipcRenderer } from 'electron';

if (process.env.IS_TEST === 'true') {
  require('wdio-electron-service/preload');
}

contextBridge.exposeInMainWorld('electronAPI', {
  // renderer to electron main
  updateMenu: (locale) => ipcRenderer.send('update-menu', locale),
  modelOpened: (fileName) => ipcRenderer.send('model-opened', fileName),
  modelSaved: (modelData, fileName) => ipcRenderer.send('model-saved', modelData, fileName),
  modelPrint: (printer) => ipcRenderer.send('model-print', printer),
  modelClosed: (fileName) => ipcRenderer.send('model-closed', fileName),

  // electron main to renderer
  onOpenModel: (callback) => ipcRenderer.on('open-model', callback),
  onSaveModel: (callback) => ipcRenderer.on('save-model', callback),
  onNewModel: (callback) => ipcRenderer.on('new-model', callback),
  onPrintModel: (callback) => ipcRenderer.on('print-model', callback),
  onCloseModel: (callback) => ipcRenderer.on('close-model', callback),
});
