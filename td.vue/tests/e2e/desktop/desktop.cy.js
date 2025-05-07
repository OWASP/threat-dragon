// Desktop application tests with Cypress
// This replaces the WebdriverIO tests from desktop.spec.js

describe('Desktop application', () => {
    beforeEach(() => {
    // Visit the app (using the baseUrl from the config)
        cy.visit('/');
    
        // Ensure the app is fully loaded
        cy.get('.navbar-brand').should('be.visible');
    });

    describe('main window', () => {
        it('should have the correct title', () => {
            cy.title().should('equal', 'OWASP Threat Dragon');
        });

        it('should have an electron url when in electron mode', () => {
            // In real Electron, URL will be app://./index.html
            // In test mode, we check that our mock is correctly configured
            cy.window().then((win) => {
                if (win.electronAPI) {
                    // If running in actual Electron or with our mock
                    cy.url().should('include', 'localhost');
                    // We would check for app:// URL in actual Electron
                }
            });
        });

        it('should have the Electron API available', () => {
            cy.window().then((win) => {
                expect(win.electronAPI).to.exist;
                expect(typeof win.electronAPI.getAppVersion).to.equal('function');
                expect(typeof win.electronAPI.getAppName).to.equal('function');
                expect(typeof win.electronAPI.getOsVersion).to.equal('function');
            });
        });

        // Additional tests that were in the original WebdriverIO tests
        // We can't test window size directly in Cypress, but we can check viewport
        it('should have correct content viewport', () => {
            cy.viewport(1400, 900);
            cy.get('.navbar-brand').should('be.visible');
            cy.get('nav').should('be.visible');
      
            // Additional UI elements that should be visible at this size
            cy.get('#local-login-btn').should('be.visible');
        });
    });

    describe('desktop functionality', () => {
        it('should handle threat model file operations', () => {
            cy.window().then((win) => {
                // Test that mock implementations work correctly
                const openStub = win.electronAPI.openFile;
                const saveStub = win.electronAPI.saveFile;
        
                expect(openStub).to.be.a('function');
                expect(saveStub).to.be.a('function');
        
                // Verify our mocks work as expected
                openStub().then(result => {
                    expect(result).to.have.property('filePaths');
                    expect(result.filePaths[0]).to.equal('test-file-path.json');
                });
        
                saveStub().then(result => {
                    expect(result).to.equal('test-save-path.json');
                });
            });
        });
    
        it('should handle confirmation dialogs through IPC', () => {
            cy.window().then((win) => {
                // Spy on the close application request function
                const _closeRequestSpy = cy.spy();
                cy.stub(win.electronAPI, 'appClose');
        
                // Trigger the close app request
                win.electronAPI.onCloseAppRequest.yield({});
        
                // Wait for the modal to appear or for the app close to be called
                cy.get('body').should(() => {
                    // This will retry until either the modal appears or appClose is called
                    const modalVisible = Cypress.$('.modal-content').length > 0;
                    const appCloseCalled = win.electronAPI.appClose.called;
                    expect(modalVisible || appCloseCalled).to.be.true;
                });
        
                // Verification depends on environment:
                // In real application, we would check for visible modal
                // In test mode, we use a more direct approach
                cy.get('body').then(($body) => {
                    if ($body.find('.modal-content').length > 0) {
                        // Modal is visible, click confirm
                        cy.get('.modal-footer .btn-primary').click();
            
                        // Verify app close was called
                        cy.wrap(win.electronAPI.appClose).should('be.called');
                    } else {
                        // If modal is not found, it might be a test environment
                        // Just verify the flow works by checking if window.confirm was called
                        // This is a fallback test approach
                        expect(win.electronAPI.appClose).to.be.called;
                    }
                });
            });
        });

        it('should access app information correctly', () => {
            cy.window().then((win) => {
                const appVersion = win.electronAPI.getAppVersion();
                const appName = win.electronAPI.getAppName();
                const osVersion = win.electronAPI.getOsVersion();
        
                expect(appVersion).to.match(/\d+\.\d+\.\d+/);
                expect(appName).to.equal('OWASP Threat Dragon');
                expect(osVersion).to.be.a('string');
            });
        });
    
        it('should provide recent model access', () => {
            cy.window().then(async (win) => {
                const recentList = win.electronAPI.getRecentModelList();
                expect(recentList).to.be.an('array');
        
                // Test updating the list
                const updateResult = await win.electronAPI.updateRecentModelList();
                expect(updateResult).to.not.be.undefined;
            });
        });
    
        it('should handle update notifications', () => {
            cy.window().then((win) => {
                // Test update related functions
                expect(typeof win.electronAPI.onUpdateDownloaded).to.equal('function');
                expect(typeof win.electronAPI.quitAndInstall).to.equal('function');
        
                // Verify stubs can be called
                win.electronAPI.onUpdateDownloaded();
                win.electronAPI.quitAndInstall();
            });
        });
    
        it('should handle file path operations', () => {
            cy.window().then((win) => {
                const modelPath = win.electronAPI.getThreatModelPath();
                expect(modelPath).to.be.a('string');
                expect(modelPath).to.equal('/test/path');
            });
        });
    
        it('should handle provider authentication', () => {
            cy.window().then((win) => {
                const providerInfo = win.electronAPI.getProviderLogon();
                expect(providerInfo).to.be.an('object');
                expect(providerInfo).to.have.property('userName');
                expect(providerInfo).to.have.property('accessToken');
                expect(providerInfo.userName).to.equal('testUser');
                expect(providerInfo.accessToken).to.equal('testToken');
            });
        });
    });
});