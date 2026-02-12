const { contextBridge, ipcRenderer } = require('electron')

if (process.env.IS_TEST === 'true') {
    require('wdio-electron-service/preload');
}

contextBridge.exposeInMainWorld('electronAPI', {
    // renderer to electron main
    appClose: () => ipcRenderer.send('close-app'),
    modelClosed: (fileName) => ipcRenderer.send('model-closed', fileName),
    modelOpenConfirmed: (fileName) => ipcRenderer.send('model-open-confirmed', fileName),
    modelOpened: (fileName) => ipcRenderer.send('model-opened', fileName),
    modelPrint: (format) => ipcRenderer.send('model-print', format),
    modelSave: (modelData, fileName) => ipcRenderer.send('model-save', modelData, fileName),
    updateMenu: (locale) => ipcRenderer.send('update-menu', locale),
    setTemplateFolderDefault: () => ipcRenderer.send('set-template-folder-default'),
    setTemplateFolderCustom: () => ipcRenderer.send('set-template-folder-custom'),
    setTemplateFolderExisting: () => ipcRenderer.send('set-template-folder-existing'),
    getTemplates: () => ipcRenderer.send('get-templates'),
    bootstrapTemplates: () => ipcRenderer.send('bootstrap-templates'),
    importTemplate: (templateData) => ipcRenderer.send('import-template', templateData),
    fetchModelById: (templateId) => ipcRenderer.send('fetch-model-by-id', templateId),
    exportTemplate: (data, filename) => ipcRenderer.send('export-template', data, filename),
    deleteTemplate: (templateId) => ipcRenderer.send('delete-template', templateId),
    updateTemplate: (templateMetadata) => ipcRenderer.send('update-template', templateMetadata),

    // electron main to renderer
    onTemplatesResult: (callback) => ipcRenderer.on('templates-result', callback),
    onCloseAppRequest: (callback) => ipcRenderer.on('close-app-request', callback),
    onCloseModelRequest: (callback) => ipcRenderer.on('close-model-request', callback),
    onNewModelRequest: (callback) => ipcRenderer.on('new-model-request', callback),
    onOpenModel: (callback) => ipcRenderer.on('open-model', callback),
    onOpenModelRequest: (callback) => ipcRenderer.on('open-model-request', callback),
    onPrintModelRequest: (callback) => ipcRenderer.on('print-model-request', callback),
    onPrintModelConfirmed: (callback) => ipcRenderer.on('print-model-confirmed', callback),
    onSaveModelRequest: (callback) => ipcRenderer.on('save-model-request', callback),
    onSaveModelConfirmed: (callback) => ipcRenderer.on('save-model-confirmed', callback),
    onSaveModelFailed: (callback) => ipcRenderer.on('save-model-failed', callback),
    onImportTemplateSuccess: (callback) => ipcRenderer.on('import-template-success', callback),
    onImportTemplateError: (callback) => ipcRenderer.on('import-template-error', callback),
    onFetchModelByIdResult: (callback) => ipcRenderer.on('fetch-model-by-id-result', callback),
    onExportTemplateSuccess: (callback) => ipcRenderer.on('export-template-success', callback),
    onExportTemplateError: (callback) => ipcRenderer.on('export-template-error', callback),
    onDeleteTemplateSuccess: (callback) => ipcRenderer.on('delete-template-success', callback),
    onDeleteTemplateError: (callback) => ipcRenderer.on('delete-template-error', callback),
    onUpdateTemplateSuccess: (callback) => ipcRenderer.on('update-template-success', callback),
    onUpdateTemplateError: (callback) => ipcRenderer.on('update-template-error', callback),
    onBootstrapTemplatesSuccess: (callback) => ipcRenderer.on('bootstrap-templates-success', callback),
    onBootstrapTemplatesError: (callback) => ipcRenderer.on('bootstrap-templates-error', callback),
    onSetTemplateFolderSuccess: (callback) => ipcRenderer.on('set-template-folder-success', callback),
    onSetTemplateFolderError: (callback) => ipcRenderer.on('set-template-folder-error', callback)
});