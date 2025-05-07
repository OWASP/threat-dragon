// Support file for Electron desktop testing with Cypress
// This replaces WebdriverIO support functionality

// Import Cypress commands
import './commands';

// Mock Electron API for desktop testing
beforeEach(() => {
    // Create a mock of the window.electronAPI that's provided in the Electron app
    cy.window().then((win) => {
    // Only mock if electronAPI doesn't already exist (for when running in Electron)
        if (!win.electronAPI) {
            win.electronAPI = {
                // Renderer to main process
                appClose: cy.stub(),
                modelClosed: cy.stub(),
                modelOpenConfirmed: cy.stub(),
                modelOpened: cy.stub(),
                modelPrint: cy.stub(),
                modelSave: cy.stub(),
                updateMenu: cy.stub(),
                quitAndInstall: cy.stub(),
        
                // Main process to renderer
                onCloseAppRequest: cy.stub().callsFake((callback) => {
                    // Store callback for testing
                    win.electronAPI._callbacks = win.electronAPI._callbacks || {};
                    win.electronAPI._callbacks.closeApp = callback;
                }),
                onCloseModelRequest: cy.stub().callsFake((callback) => {
                    win.electronAPI._callbacks = win.electronAPI._callbacks || {};
                    win.electronAPI._callbacks.closeModel = callback;
                }),
                onNewModelRequest: cy.stub().callsFake((callback) => {
                    win.electronAPI._callbacks = win.electronAPI._callbacks || {};
                    win.electronAPI._callbacks.newModel = callback;
                }),
                onOpenModel: cy.stub().callsFake((callback) => {
                    win.electronAPI._callbacks = win.electronAPI._callbacks || {};
                    win.electronAPI._callbacks.openModel = callback;
                }),
                onOpenModelRequest: cy.stub().callsFake((callback) => {
                    win.electronAPI._callbacks = win.electronAPI._callbacks || {};
                    win.electronAPI._callbacks.openModelRequest = callback;
                }),
                onPrintModelRequest: cy.stub().callsFake((callback) => {
                    win.electronAPI._callbacks = win.electronAPI._callbacks || {};
                    win.electronAPI._callbacks.printModel = callback;
                }),
                onSaveModelRequest: cy.stub().callsFake((callback) => {
                    win.electronAPI._callbacks = win.electronAPI._callbacks || {};
                    win.electronAPI._callbacks.saveModel = callback;
                }),
                onUpdateDownloaded: cy.stub().callsFake((callback) => {
                    win.electronAPI._callbacks = win.electronAPI._callbacks || {};
                    win.electronAPI._callbacks.updateDownloaded = callback;
                }),
        
                // Additional APIs for testing
                openFile: cy.stub().resolves({ filePaths: ['test-file-path.json'] }),
                saveFile: cy.stub().resolves('test-save-path.json'),
                getAppVersion: cy.stub().returns('2.4.1-test'),
                getAppName: cy.stub().returns('OWASP Threat Dragon'),
                getOsVersion: cy.stub().returns('Test OS v1.0'),
                getThreatModelPath: cy.stub().returns('/test/path'),
                getProviderLogon: cy.stub().returns({ userName: 'testUser', accessToken: 'testToken' }),
                getRecentModelList: cy.stub().returns([]),
                updateRecentModelList: cy.stub().resolves(),
        
                // Helper methods for testing IPC callbacks
                _triggerCallback: (name, ...args) => {
                    if (win.electronAPI._callbacks && win.electronAPI._callbacks[name]) {
                        win.electronAPI._callbacks[name]({}, ...args);
                    }
                }
            };
      
            // Add helper commands to trigger IPC events from main to renderer
            cy.wrap(win.electronAPI).as('electronAPI');
        }

        // Hook into console to help with debugging
        const originalConsoleLog = win.console.log;
        win.console.log = (...args) => {
            originalConsoleLog(...args);
            // You could do additional logging or assertions here
        };
    });
});