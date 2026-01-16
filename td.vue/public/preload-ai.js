const { contextBridge, ipcRenderer } = require('electron');

// Expose secure APIs for AI-related windows
contextBridge.exposeInMainWorld('electronAPI', {
    // AI Threats Warning Window APIs
    sendWarningOk: () => ipcRenderer.send('ai-threats-warning-ok'),
    
    // AI Threats Progress Window APIs
    onProgressConfig: (callback) => {
        // Wrap callback to remove event parameter for consistency
        ipcRenderer.on('ai-threats-progress-config', (event, ...args) => callback(event, ...args));
    },
    
    // AI Threats Results Window APIs
    onResultsData: (callback) => {
        // Wrap callback to remove event parameter for consistency
        ipcRenderer.on('ai-threats-results-data', (event, ...args) => callback(event, ...args));
    },
    
    // AI Settings Window APIs
    sendLoadRequest: () => ipcRenderer.send('ai-settings-load-request'),
    sendSaveRequest: (settings) => ipcRenderer.send('ai-settings-save-request', settings),
    sendWindowClose: () => ipcRenderer.send('ai-settings-window-close'),
    sendHasChanges: (hasChanges) => ipcRenderer.send('ai-settings-has-changes', hasChanges),
    sendShouldClose: (shouldClose) => ipcRenderer.send('ai-settings-should-close', shouldClose),
    
    onSettingsLoaded: (callback) => {
        ipcRenderer.on('ai-settings-loaded', (event, ...args) => callback(event, ...args));
    },
    onSettingsSaved: (callback) => {
        ipcRenderer.on('ai-settings-saved', (event, ...args) => callback(event, ...args));
    },
    onSettingsSaveError: (callback) => {
        ipcRenderer.on('ai-settings-save-error', (event, ...args) => callback(event, ...args));
    },
    onSettingsCheckChanges: (callback) => {
        ipcRenderer.on('ai-settings-check-changes', (event, ...args) => callback(event, ...args));
    },
    onSettingsCloseCheck: (callback) => {
        ipcRenderer.on('ai-settings-close-check', (event, ...args) => callback(event, ...args));
    },
    
    // Window control
    closeWindow: () => {
        // Use IPC to close window safely
        ipcRenderer.send('ai-window-close');
    }
});
