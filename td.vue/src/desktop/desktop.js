'use strict';

import { app, protocol, BrowserWindow, Menu, ipcMain, globalShortcut } from 'electron';
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

protocol.registerSchemesAsPrivileged([
    { scheme: 'app', privileges: { secure: true, standard: true } }
]);

let runApp = true;

async function createWindow () {
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

    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.show();
        mainWindow.focus();
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
        await mainWindow.loadURL(electronURL);
        if (!isTest) mainWindow.webContents.openDevTools();
    } else {
        createProtocol('app');
        mainWindow.loadURL('app://./index.html');
    }
    return mainWindow;
}

app.on('window-all-closed', () => {
    if (!isMacOS) {
        logger.log.debug('Quit application');
        app.quit();
    } else {
        logger.log.debug('Ignoring window-all-closed for MacOS');
    }
});

app.on('activate', () => {
    logger.log.debug('Activate application');
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

app.on('ready', async () => {
    logger.log.debug('Building the menu system for the default language');
    Menu.setApplicationMenu(Menu.buildFromTemplate(menu.getMenuTemplate()));

    globalShortcut.register('CommandOrControl+O', () => {
        const window = BrowserWindow.getFocusedWindow();
        if (window) {
            logger.log.debug('Ctrl+O → open model');
            window.webContents.send('open-model-shortcut');
        }
    });

    globalShortcut.register('CommandOrControl+S', () => {
        const window = BrowserWindow.getFocusedWindow();
        if (window) {
            logger.log.debug('Ctrl+S → save model');
            window.webContents.send('save-model-shortcut');
        }
    });

    if (isDevelopment && !isTest) {
        try {
            await installExtension(VUEJS_DEVTOOLS);
        } catch (e) {
            logger.log.error('Vue Devtools failed:', e.toString());
        }
    }

    ipcMain.on('close-app', handleCloseApp);
    ipcMain.on('model-closed', handleModelClosed);
    ipcMain.on('model-open-confirmed', handleModelOpenConfirmed);
    ipcMain.on('model-opened', handleModelOpened);
    ipcMain.on('model-print', handleModelPrint);
    ipcMain.on('model-save', handleModelSave);
    ipcMain.on('update-menu', handleUpdateMenu);

    await createWindow();

    autoUpdater.autoInstallOnAppQuit = true;
    autoUpdater.autoDownload = false;
    autoUpdater.checkForUpdatesAndNotify();
});

app.on('open-file', function(event, path) {
    event.preventDefault();
    logger.log.debug('Opening recent document: ' + path);
    menu.openModelRequest(path);
});

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});

function handleCloseApp() {
    logger.log.debug('Renderer requested close');
    runApp = false;
    app.quit();
}

function handleModelClosed (_event, fileName) {
    logger.log.debug('Renderer says model closed: ' + fileName);
    menu.modelClosed();
}

function handleModelOpenConfirmed (_event, fileName) {
    logger.log.debug('Renderer confirms open: ' + fileName);
    menu.openModel(fileName);
}

function handleModelOpened (_event, fileName) {
    logger.log.debug('Renderer opened model: ' + fileName);
    menu.modelOpened();
}

function handleModelPrint (_event, format) {
    logger.log.debug('Print request: ' + format);
    menu.modelPrint(format);
}

function handleModelSave (_event, data, fileName) {
    logger.log.debug('Save request for: ' + fileName);
    menu.modelSave(data, fileName);
}

function handleUpdateMenu (_event, locale) {
    logger.log.debug('Updating menu for: ' + locale);
    menu.setLocale(locale);
    Menu.setApplicationMenu(Menu.buildFromTemplate(menu.getMenuTemplate()));
}

if (isDevelopment) {
    if (isWin) {
        process.on('message', data => {
            if (data === 'graceful-exit') app.quit();
        });
    } else {
        process.on('SIGTERM', () => app.quit());
    }
}
