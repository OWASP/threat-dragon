'use strict';

import { app, protocol, BrowserWindow, Menu, ipcMain } from 'electron';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
import menu from '../desktop/menu.js';
import logger from '../desktop/logger.js';
import { electronURL, isDevelopment, isTest, isMacOS, isWin } from '../desktop/utils.js';

const { autoUpdater } = require('electron-updater');
const path = require('path');

if (isTest) {
  require('wdio-electron-service/main');
}

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
]);

async function createWindow () {
  // Create the browser window
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, '../preload/index.js')
    }
  });

  // Event listeners on the window
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.show();
    mainWindow.focus();
    // menu system needs to access the main window
    menu.setMainWindow(mainWindow);
  });

  if (isDevelopment) {
    if (!isTest) mainWindow.webContents.openDevTools();
  }
  if (electronURL) {
    logger.log.info('Running in development mode with ELECTRON_RENDERER_URL: ' + electronURL);
    // Load the url of the dev server when in development mode
    await mainWindow.loadURL(electronURL);

  } else {
    logger.log.info('Running in production mode');
    // import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
    // createProtocol('app');
    // Load the index.desktop.html when not in development mode
    // await mainWindow.loadURL('app://./index.desktop.html');
    await mainWindow.loadFile(path.join(__dirname, '../renderer/index.desktop.html'));
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

app.on('activate', async () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  logger.log.debug('Activate application');
  if (BrowserWindow.getAllWindows().length === 0) {
    await createWindow();
  }
});

// This method will be called when Electron has finished initialization
// and is ready to create browser windows
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
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

  ipcMain.on('update-menu', handleUpdateMenu);
  ipcMain.on('model-opened', handleModelOpened);
  ipcMain.on('model-saved', handleModelSaved);
  ipcMain.on('model-print', handleModelPrint);
  ipcMain.on('model-closed', handleModelClosed);

  await createWindow();

  // check for updates from github releases site
  await autoUpdater.checkForUpdatesAndNotify();
});

// this is emitted when a 'recent document' is opened
app.on('open-file', function(event, path) {
  // handle this event
  event.preventDefault();
  logger.log.debug('Open file from recent documents: ' + path);
  menu.readModelData(path);
});

function handleUpdateMenu (_event, locale) {
  logger.log.debug('Re-labeling the menu system for: ' + locale);
  menu.setLocale(locale);
  let template = menu.getMenuTemplate();
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

function handleModelOpened (_event, fileName) {
  logger.log.debug('Open model notification from renderer for file name: ' + fileName);
  menu.modelOpened();
}

function handleModelSaved (_event, modelData, fileName) {
  logger.log.debug('Model save request from renderer with file name : ' + fileName);
  menu.modelSaved(modelData, fileName);
}

function handleModelPrint (_event, printer) {
  logger.log.debug('Model print request from renderer with printer : ' + printer);
  menu.modelPrint(printer);
}

function handleModelClosed (_event, fileName) {
  logger.log.debug('Close model notification from renderer for file name: ' + fileName);
  menu.modelClosed();
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
