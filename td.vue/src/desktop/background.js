'use strict';

// Import all dependencies directly to avoid "electron is not defined" error
// When the file is copied directly to the output directory, these requires
// are used directly without any bundling
let electron, app, BrowserWindow, Menu, ipcMain, protocol, dialog;
let path, url, fs, os;
let electronLog, electronUpdater, autoUpdater;

try {
    // Try to load electron module
    electron = require('electron');
    app = electron.app;
    BrowserWindow = electron.BrowserWindow;
    Menu = electron.Menu;
    ipcMain = electron.ipcMain;
    protocol = electron.protocol;
    dialog = electron.dialog;

    // Core Node.js modules
    path = require('path');
    url = require('url');
    fs = require('fs');
    os = require('os');

    // Try to load electron-log
    try {
        electronLog = require('electron-log');
    } catch (logError) {
        console.error('Failed to load electron-log:', logError);
        // Create a fallback logger
        electronLog = {
            info: (...args) => console.log('[INFO]', ...args),
            error: (...args) => console.error('[ERROR]', ...args),
            warn: (...args) => console.warn('[WARN]', ...args),
            debug: (...args) => console.debug('[DEBUG]', ...args),
            transports: { file: { level: 'info' } }
        };
    }

    // Try to load electron-updater
    try {
        electronUpdater = require('electron-updater');
        autoUpdater = electronUpdater.autoUpdater;
    } catch (updaterError) {
        console.error('Failed to load electron-updater:', updaterError);
        // Create a dummy autoUpdater
        autoUpdater = {
            logger: null,
            on: () => {},
            checkForUpdatesAndNotify: () => Promise.resolve(),
            quitAndInstall: () => {}
        };
    }
} catch (e) {
    console.error('Error loading electron dependencies:', e);
    process.exit(1);
}

// Configure logging
electronLog.transports.file.level = 'info';
electronLog.info('Application starting...');

// Keep a global reference of the window object
let mainWindow;

// We'll use a simplified menu first
const getMenuTemplate = () => {
    const template = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Open',
                    click() {
                        openFile();
                    }
                },
                {
                    label: 'Save',
                    click() {
                        saveFile();
                    }
                },
                { type: 'separator' },
                {
                    label: 'Exit',
                    click() {
                        app.quit();
                    }
                }
            ]
        },
        {
            label: 'Edit',
            role: 'editMenu'
        },
        {
            label: 'View',
            role: 'viewMenu'
        },
        {
            label: 'Help',
            submenu: [
                {
                    label: 'About',
                    click() {
                        showAbout();
                    }
                }
            ]
        }
    ];

    return template;
};

// Helper function to open files
async function openFile() {
    try {
        const result = await dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [
                { name: 'Threat Models', extensions: ['json'] },
                { name: 'All Files', extensions: ['*'] }
            ]
        });

        if (!result.canceled && result.filePaths.length > 0) {
            const filePath = result.filePaths[0];
            const fileContent = fs.readFileSync(filePath, 'utf8');

            // Send to renderer
            mainWindow.webContents.send(
                'open-model',
                path.basename(filePath),
                JSON.parse(fileContent)
            );
            return filePath;
        }
    } catch (error) {
        electronLog.error('Error opening file:', error);
        dialog.showErrorBox('Error Opening File', error.message);
    }
    return null;
}

// Helper function to save files
async function saveFile(content, suggestedFileName) {
    try {
        const result = await dialog.showSaveDialog({
            defaultPath: suggestedFileName || 'threat-model.json',
            filters: [
                { name: 'Threat Models', extensions: ['json'] },
                { name: 'All Files', extensions: ['*'] }
            ]
        });

        if (!result.canceled) {
            fs.writeFileSync(result.filePath, content);
            return result.filePath;
        }
    } catch (error) {
        electronLog.error('Error saving file:', error);
        dialog.showErrorBox('Error Saving File', error.message);
    }
    return null;
}

// Show about dialog
function showAbout() {
    dialog.showMessageBox(mainWindow, {
        title: 'About OWASP Threat Dragon',
        message: 'OWASP Threat Dragon',
        detail: `Version: ${app.getVersion()}\nElectron: ${process.versions.electron}\nChrome: ${
            process.versions.chrome
        }\nNode.js: ${process.versions.node}\nV8: ${
            process.versions.v8
        }\nOS: ${os.type()} ${os.release()} ${os.arch()}`
    });
}

function createWindow() {
    try {
        // Create the browser window
        electronLog.info('Creating browser window');
        mainWindow = new BrowserWindow({
            width: 1400,
            height: 1000,
            show: false,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                preload: path.resolve(__dirname, 'simple-preload.js'),
                webSecurity: false, // For local development
                allowRunningInsecureContent: true, // Only for development
                devTools: true // Always enable DevTools
            }
        });

        electronLog.info('Browser window created, setting up event handlers');

        // Log any window errors
        mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
            electronLog.error(`Page failed to load: ${errorDescription} (${errorCode})`);
            // Show a dialog with the error
            dialog.showErrorBox(
                'Page Load Failed',
                `Failed to load the application: ${errorDescription} (${errorCode})`
            );

            // Try to reload after a short delay
            setTimeout(() => {
                try {
                    electronLog.info('Attempting to reload after load failure');
                    mainWindow.reload();
                } catch (reloadError) {
                    electronLog.error('Error during reload:', reloadError);
                }
            }, 2000);
        });

        mainWindow.webContents.on('crashed', (event, killed) => {
            electronLog.error(`Renderer process crashed (killed: ${killed})`);
            dialog.showErrorBox(
                'Application Crashed',
                'The application has crashed unexpectedly. Please restart.'
            );
        });

        mainWindow.on('unresponsive', () => {
            electronLog.error('Window became unresponsive');
            dialog.showErrorBox(
                'Application Not Responding',
                'The application is not responding. You may need to restart it.'
            );
        });

        mainWindow.on('closed', () => {
            electronLog.info('Main window closed');
            mainWindow = null;
        });

        // Set up the menu
        try {
            electronLog.info('Setting up application menu');
            const menu = Menu.buildFromTemplate(getMenuTemplate());
            Menu.setApplicationMenu(menu);
            electronLog.info('Application menu set up successfully');
        } catch (menuError) {
            electronLog.error('Error setting up menu:', menuError);
        }

        // Only show window when ready
        mainWindow.webContents.on('did-finish-load', () => {
            try {
                electronLog.info('Page finished loading, showing window');
                mainWindow.show();
                mainWindow.focus();
                electronLog.info('Window loaded and shown');
            } catch (showError) {
                electronLog.error('Error showing window:', showError);
            }
        });

        // Listen for console logs from the renderer
        mainWindow.webContents.on('console-message', (event, level, message) => {
            const levels = ['debug', 'info', 'warning', 'error'];
            const logLevel = levels[level] || 'info';

            if (logLevel === 'debug') {
                electronLog.debug(`Console message from renderer: ${message}`);
            } else if (logLevel === 'info') {
                electronLog.info(`Console message from renderer: ${message}`);
            } else if (logLevel === 'warning') {
                electronLog.warn(`Console message from renderer: ${message}`);
            } else if (logLevel === 'error') {
                electronLog.error(`Console message from renderer: ${message}`);
            } else {
                electronLog.info(`Console message from renderer: ${message}`);
            }
        });

        // In development mode, use the live development server
        if (process.env.NODE_ENV === 'development' && process.env.WEBPACK_DEV_SERVER_URL) {
            electronLog.info(
                'Running in development mode with URL: ' + process.env.WEBPACK_DEV_SERVER_URL
            );
            mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
            mainWindow.webContents.openDevTools();
        } else {
            // In production, load the bundled index.html
            try {
                // Check if file exists before loading
                const indexPath = path.join(__dirname, 'index.html');
                if (fs.existsSync(indexPath)) {
                    electronLog.info(`index.html exists at ${indexPath}`);

                    // List files in the directory to verify contents
                    const files = fs.readdirSync(__dirname);
                    electronLog.info(`Files in directory: ${files.join(', ')}`);

                    // Check for preload file
                    const preloadPath = path.join(__dirname, 'simple-preload.js');
                    if (fs.existsSync(preloadPath)) {
                        electronLog.info(`simple-preload.js exists at ${preloadPath}`);
                    } else {
                        electronLog.error(`simple-preload.js NOT found at ${preloadPath}`);
                    }
                } else {
                    electronLog.error(`index.html NOT found at ${indexPath}`);
                    // List files in the directory
                    const files = fs.readdirSync(__dirname);
                    electronLog.info(`Files in directory: ${files.join(', ')}`);
                }

                // Always open dev tools to help debug issues
                mainWindow.webContents.openDevTools();

                const startUrl = url.format({
                    pathname: indexPath,
                    protocol: 'file:',
                    slashes: true
                });

                electronLog.info(`Attempting to load app from ${startUrl}`);
                mainWindow.loadURL(startUrl);
                electronLog.info(`Loading command sent for ${startUrl}`);

                // Add a delay to keep the app running
                electronLog.info('Setting keepalive timeout');
                setTimeout(() => {
                    electronLog.info('Keepalive check: Window is still open');
                }, 5000);
            } catch (error) {
                electronLog.error('Error loading app:', error);

                // Try loading from the current directory as a fallback
                try {
                    electronLog.info('Trying fallback with direct HTML content');
                    mainWindow.webContents.loadURL(`data:text/html,
            <html>
            <head>
              <title>OWASP Threat Dragon - Error</title>
              <style>
                body { font-family: sans-serif; padding: 20px; background: #f5f5f5; }
                h1 { color: #cc0000; }
              </style>
            </head>
            <body>
              <h1>Error Loading Application</h1>
              <p>There was an error loading the application. Please check the logs.</p>
              <p>Error details:</p>
              <pre>${error.toString()}</pre>
              <p>Stack trace:</p>
              <pre>${error.stack}</pre>
            </body>
            </html>
          `);
                } catch (fallbackError) {
                    electronLog.error('Fallback page also failed:', fallbackError);
                    dialog.showErrorBox(
                        'Application Load Failed',
                        `Failed to load the application: ${error.message}\n\nFallback also failed: ${fallbackError.message}`
                    );
                }
            }
        }

        // Set up IPC handlers
        try {
            electronLog.info('Setting up IPC handlers');
            setupIPC();
            electronLog.info('IPC handlers set up successfully');
        } catch (ipcError) {
            electronLog.error('Error setting up IPC handlers:', ipcError);
        }

        // Set up auto-updater events
        try {
            electronLog.info('Setting up auto-updater');
            setupAutoUpdater();
            electronLog.info('Auto-updater set up successfully');
        } catch (updaterError) {
            electronLog.error('Error setting up auto-updater:', updaterError);
        }

        electronLog.info('createWindow completed successfully');
        return mainWindow;
    } catch (windowError) {
        electronLog.error('Error creating window:', windowError);
        dialog.showErrorBox(
            'Window Creation Error',
            `Failed to create application window: ${windowError.message}`
        );
        throw windowError; // Rethrow to allow the outer try/catch to handle it
    }
}

function setupIPC() {
    // Handle IPC events from renderer to main
    ipcMain.on('app-close', () => {
        app.quit();
    });

    // Handle threat model save operations
    ipcMain.on('model-save', async (event, modelData, fileName) => {
        try {
            electronLog.info(`Save request received for model: ${fileName}`);

            // This handler is simplified - we're now doing most of the
            // saving logic directly in the renderer process to avoid
            // serialization issues with complex objects

            // Just log the event - actual saving is done in the renderer
            electronLog.info(`Save handled in renderer, model filename: ${fileName}`);

            // For backward compatibility, still reply with success
            event.reply('model-save-result', { success: true });
        } catch (error) {
            electronLog.error('Error in model-save handler:', error);
            dialog.showErrorBox('Save Error', `Failed to process save request: ${error.message}`);
            event.reply('model-save-result', { success: false, error: error.message });
        }
    });

    // Handle file operations
    ipcMain.handle('open-file', openFile);
    ipcMain.handle('save-file', (event, content, suggestedFileName) => {
        return saveFile(content, suggestedFileName);
    });

    // Handle model-related events
    ipcMain.on('model-opened', (event, fileName) => {
        electronLog.info(`Model opened: ${fileName}`);
    });

    ipcMain.on('model-closed', (event, fileName) => {
        electronLog.info(`Model closed: ${fileName}`);
    });

    ipcMain.on('model-open-confirmed', (event, fileName) => {
        electronLog.info(`Model open confirmed: ${fileName}`);
    });

    // Handle app info requests
    ipcMain.handle('get-app-version', () => app.getVersion());
    ipcMain.handle('get-app-name', () => app.getName());
    ipcMain.handle('get-os-version', () => `${os.type()} ${os.release()}`);
}

function setupAutoUpdater() {
    autoUpdater.logger = electronLog;
    autoUpdater.logger.transports.file.level = 'info';

    autoUpdater.on('checking-for-update', () => {
        electronLog.info('Checking for updates...');
    });

    autoUpdater.on('update-available', (info) => {
        electronLog.info('Update available:', info);
        mainWindow.webContents.send('update-available', info);
    });

    autoUpdater.on('update-downloaded', (info) => {
        electronLog.info('Update downloaded:', info);
        mainWindow.webContents.send('update-downloaded', info);
    });

    autoUpdater.on('error', (err) => {
        electronLog.error('AutoUpdater error:', err);
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady()
    .then(() => {
        try {
            electronLog.info('whenReady started, registering protocol');

            // Register app:// protocol for loading the app in production
            protocol.registerFileProtocol('app', (request, callback) => {
                try {
                    const url = request.url.substr(6); // strip app://
                    const normalizedPath = path.normalize(`${__dirname}/${url}`);
                    electronLog.info(`Protocol request for ${url} mapped to ${normalizedPath}`);
                    callback({ path: normalizedPath });
                } catch (protocolError) {
                    electronLog.error('Error in protocol handler:', protocolError);
                    callback({ error: -2 }); // Failed to load
                }
            });

            electronLog.info('Protocol registered, creating window');
            createWindow();

            // In this file you can include the rest of your app's specific main process code
            electronLog.info('App is ready, window created');

            // Check for updates right when the app launches
            if (!process.env.NODE_ENV || process.env.NODE_ENV === 'production') {
                electronLog.info('Checking for updates...');
                autoUpdater
                    .checkForUpdatesAndNotify()
                    .catch((err) => electronLog.error('Error checking for updates:', err));
            }

            // Wait a short time to ensure app is stable
            setTimeout(() => {
                electronLog.info('Application has been running for 2 seconds');
            }, 2000);

            app.on('activate', () => {
                // On macOS it's common to re-create a window when the dock icon is clicked
                if (BrowserWindow.getAllWindows().length === 0) {
                    createWindow();
                }
            });
        } catch (startupError) {
            // Log any errors during startup
            electronLog.error('Error during app startup:', startupError);
            dialog.showErrorBox(
                'Startup Error',
                `Failed to start the application: ${startupError.message}`
            );
        }
    })
    .catch((err) => {
        console.error('Error in whenReady promise:', err);
        electronLog.error('Error in whenReady promise:', err);
    });

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Handle quit and install on auto-update
ipcMain.on('quit-and-install', () => {
    autoUpdater.quitAndInstall();
});

// Log any unhandled errors and keep app running
process.on('uncaughtException', (error) => {
    electronLog.error('Uncaught exception:', error);
    // Don't exit immediately, show error to user
    if (mainWindow) {
        dialog.showErrorBox(
            'Uncaught Exception',
            `An error occurred: ${error.message}\n\nStack: ${error.stack}`
        );
    }
});

// Also catch unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    electronLog.error('Unhandled Rejection at:', promise, 'reason:', reason);
    if (mainWindow) {
        dialog.showErrorBox('Unhandled Promise Rejection', `An error occurred: ${reason}`);
    }
});
