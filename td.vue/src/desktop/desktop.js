'use strict';

import { app, protocol, BrowserWindow, Menu, ipcMain } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
import { menuTemplate, log } from './desktop.menu.js';

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
    // Create the browser window.
    const win = new BrowserWindow({
        width: 1400,
        height: 900,
        webPreferences: {
            // Required for Spectron testing?
            // enableRemoteModule: !!process.env.IS_TEST,

            nodeIntegration: false,
            contextIsolation: true
        }
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
    log.debug('Building the menu system');
    Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));

    // Install Vue Devtools
    if (isDevelopment && !process.env.IS_TEST) {
        try {
            await installExtension(VUEJS_DEVTOOLS);
        } catch (e) {
            log.error('Vue Devtools failed to install:', e.toString());
        }
    }

    ipcMain.on('build-menu', handleBuildMenu)
    createWindow();
});

function handleBuildMenu () {
    log.debug('Rebuilding the menu system');
    Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));
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
