'use strict';

import { app, protocol, BrowserWindow, Menu, ipcMain } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
import { getMenuTemplate, modelClosed, modelSaved, setLocale } from './menu.js';
import { log } from './logger.js';

const path = require('path');

require('update-electron-app')({
    updateInterval: '1 hour',
    logger: require('electron-log')
});

const isDevelopment = process.env.NODE_ENV !== 'production';
const isWin = (process.platform === 'win32' || process.platform === 'win64');

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    { scheme: 'app', privileges: { secure: true, standard: true } }
]);

async function createWindow () {
    // Create the browser window
    const win = new BrowserWindow({
        width: 1400,
        height: 900,
        show: false,
        webPreferences: {
            enableRemoteModule: false,
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__static, 'preload.js')
        }
    });

    // Event listeners on the window
    win.webContents.on('did-finish-load', () => {
        win.show();
        win.focus();
    });

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        log.info('Running in development mode with WEBPACK_DEV_SERVER_URL: ' + process.env.WEBPACK_DEV_SERVER_URL);
        // Load the url of the dev server if in development mode
        await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
        if (!process.env.IS_TEST) win.webContents.openDevTools();
    } else {
        createProtocol('app');
        // Load the index.html when not in development
        win.loadURL('app://./index.html');
    }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        log.debug('Quit application');
        app.quit();
    } else {
        log.debug('Ignoring window-all-closed for MacOS');
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    log.debug('Activate application');
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// This method will be called when Electron has finished initialization
// and is ready to create browser windows
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    log.debug('Building the menu system for the default language');
    let template = getMenuTemplate();
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));

    // Install Vue Devtools
    if (isDevelopment && !process.env.IS_TEST) {
        try {
            await installExtension(VUEJS_DEVTOOLS);
        } catch (e) {
            log.error('Vue Devtools failed to install:', e.toString());
        }
    }

    ipcMain.on('update-menu', handleUpdateMenu);
    ipcMain.handle('dialog:openModel', handleOpenModel);
    ipcMain.on('save-model', handleModelSaved);
    ipcMain.on('close-model', handleModelClosed);

    createWindow();
});

function handleUpdateMenu (_event, locale) {
    log.debug('Re-labeling the menu system for: ' + locale);
    setLocale(locale);
    let template = getMenuTemplate();
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

function handleOpenModel (event) {
    log.debug('Open model requested from renderer frame: ' + event.senderFrame);
    return { path: 'dummy-file-path', text: 'dummy text is here' };
}

function handleModelSaved (_event, fileName) {
    log.debug('Model save request from renderer with file name : ' + fileName);
    modelSaved(fileName);
}

function handleModelClosed (_event, fileName) {
    log.debug('Close model event for file name: ' + fileName);
    modelClosed();
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
