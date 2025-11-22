'use strict';

import { app, protocol, BrowserWindow, Menu, ipcMain } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
import menu from './menu.js';
import logger from './logger.js';
import { electronURL, isDevelopment, isTest, isMacOS, isWin } from './utils.js';

const { autoUpdater } = require('electron-updater');
const path = require('path');

if (isTest) {
    require('wdio-electron-service/main');
}

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    { scheme: 'app', privileges: { secure: true, standard: true } }
]);

let runApp = true;
async function createWindow () {

    // Create the browser window
    const mainWindow = new BrowserWindow({
        width: 1400,
        height: 1000,
        show: false,
        webPreferences: {
            enableRemoteModule: false,
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__static, 'preload.js')
        }
    });

    // Event listeners on the window
    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.show();
        mainWindow.focus();
        // menu system needs to access the main window
        menu.setMainWindow(mainWindow);
    });

    mainWindow.on('close', (event) => {
        if (runApp) {
            event.preventDefault();
            mainWindow.webContents.send('close-app-request');
        }
    });

    if (electronURL) {
        logger.log.info('Running in development mode with WEBPACK_DEV_SERVER_URL: ' + electronURL);
        // Load the url of the dev server when in development mode
        await mainWindow.loadURL(electronURL);
        if (!isTest) {
            mainWindow.webContents.openDevTools();
        }
    } else {
        createProtocol('app');
        // Load the index.html when not in development mode
        mainWindow.loadURL('app://./index.html');
    }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (!isMacOS) {
        logger.log.debug('Quit application');
        app.quit();
    } else {
        logger.log.debug('Ignoring window-all-closed for MacOS');
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    logger.log.debug('Activate application');
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// This method will be called when Electron has finished initialization
// and is ready to create browser windows
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    logger.log.debug('Building the menu system for the default language');
    let template = menu.getMenuTemplate();
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));

    // Install Vue Devtools
    if (isDevelopment && !isTest) {
        try {
            await installExtension(VUEJS_DEVTOOLS);
        } catch (e) {
            logger.log.error('Vue Devtools failed to install:', e.toString());
        }
    }

    ipcMain.on('close-app', handleCloseApp);
    ipcMain.on('model-closed', handleModelClosed);
    ipcMain.on('model-open-confirmed', handleModelOpenConfirmed);
    ipcMain.on('model-opened', handleModelOpened);
    ipcMain.on('model-print', handleModelPrint);
    ipcMain.on('model-save', handleModelSave);
    ipcMain.on('update-menu', handleUpdateMenu);

    createWindow();

    // check for updates from github releases site
    autoUpdater.checkForUpdatesAndNotify();
});

// this is emitted when a 'recent document' is opened
app.on('open-file', function(event, path) {
    // apply custom handler to this event
    event.preventDefault();
    logger.log.debug('Request to open file from recent documents: ' + path);
    menu.openModelRequest(path);
});

function handleCloseApp() {
    logger.log.debug('Close application request from renderer ');
    runApp = false;
    app.quit();
}

function handleModelClosed (_event, fileName) {
    logger.log.debug('Close model notification from renderer for file name: ' + fileName);
    menu.modelClosed();
}

function handleModelOpenConfirmed (_event, fileName) {
    logger.log.debug('Open model confirmation from renderer for file name: ' + fileName);
    menu.openModel(fileName);
}

function handleModelOpened (_event, fileName) {
    logger.log.debug('Open model notification from renderer for file name: ' + fileName);
    menu.modelOpened();
}

function handleModelPrint (_event, format) {
    logger.log.debug('Model print request from renderer with printer : ' + format);
    menu.modelPrint(format);
}

function handleModelSave (_event, modelData, fileName) {
    logger.log.debug('Model save request from renderer with file name : ' + fileName);
    menu.modelSave(modelData, fileName);
}

function handleUpdateMenu (_event, locale) {
    logger.log.debug('Re-labeling the menu system for: ' + locale);
    menu.setLocale(locale);
    let template = menu.getMenuTemplate();
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (isWin) {
        process.on('message', (data) => {
            if (data === 'graceful-exit') {
                app.quit();
            }
        });
    } else {
        process.on('SIGTERM', () => {
            app.quit();
        });
    }
}
