// ***********************************************************
// This support/index.js file is processed and loaded automatically
// before your test files.
//
// It's a great place to put global configuration and behavior
// that modifies Cypress.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Mock the Electron API for desktop tests
Cypress.on('window:before:load', (win) => {
    win.electronAPI = {
    // IPC methods for communication
        appClose: cy.stub().as('appClose'),
        modelOpened: cy.stub().as('modelOpened'),
        modelOpenConfirmed: cy.stub().as('modelOpenConfirmed'),
        modelClosed: cy.stub().as('modelClosed'),
        modelPrint: cy.stub().as('modelPrint'),
        saveModel: cy.stub().as('saveModel'),
    
        // IPC events (to be called from tests)
        onCloseAppRequest: cy.stub().callsFake((callback) => {
            win.electronAPI._closeAppCallback = callback;
        }),
        onCloseModelRequest: cy.stub().callsFake((callback) => {
            win.electronAPI._closeModelCallback = callback;
        }),
        onNewModelRequest: cy.stub().callsFake((callback) => {
            win.electronAPI._newModelCallback = callback;
        }),
        onOpenModel: cy.stub().callsFake((callback) => {
            win.electronAPI._openModelCallback = callback;
        }),
        onOpenModelRequest: cy.stub().callsFake((callback) => {
            win.electronAPI._openModelRequestCallback = callback;
        }),
        onPrintModelRequest: cy.stub().callsFake((callback) => {
            win.electronAPI._printModelCallback = callback;
        }),
        onSaveModelRequest: cy.stub().callsFake((callback) => {
            win.electronAPI._saveModelCallback = callback;
        }),
        onUpdateDownloaded: cy.stub().callsFake((callback) => {
            win.electronAPI._updateDownloadedCallback = callback;
        }),
    
        // File dialogs
        openFile: cy.stub().resolves({ filePaths: ['test-file-path.json'] }),
        saveFile: cy.stub().resolves('test-save-path.json'),
    
        // App info
        getAppVersion: cy.stub().returns('2.4.1'),
        getAppName: cy.stub().returns('OWASP Threat Dragon'),
        getOsVersion: cy.stub().returns('Test OS 1.0'),
    
        // Path operations
        getThreatModelPath: cy.stub().returns('/test/path'),
    
        // Recent models
        getRecentModelList: cy.stub().returns(['/test/path/model1.json', '/test/path/model2.json']),
        updateRecentModelList: cy.stub().resolves(true),
    
        // Provider auth
        getProviderLogon: cy.stub().returns({ userName: 'testUser', accessToken: 'testToken' }),
    
        // Updates
        quitAndInstall: cy.stub().as('quitAndInstall')
    };
});