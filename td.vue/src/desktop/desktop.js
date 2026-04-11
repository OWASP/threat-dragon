'use strict';

import { app, protocol, BrowserWindow, Menu, ipcMain } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
import menu from './menu.js';
import template from './templates.js';
import logger from './logger.js';
import { electronURL, isDevelopment, isTest, isMacOS, isWin } from './utils.js';

const { autoUpdater } = require('electron-updater');
const path = require('path');

if (isTest) {
    require('wdio-electron-service/main');
}

export function registerDesktop (deps) {
    const {
        app,
        protocol,
        BrowserWindow: BrowserWindowCtor,
        Menu: MenuApi,
        ipcMain: ipcMainApi,
        menu: menuApi,
        logger: loggerApi,
        utils,
        createProtocol: createProtocolFn,
        installExtension: installExtensionFn,
        VUEJS_DEVTOOLS: devtoolsId,
        autoUpdater: autoUpdaterApi,
        path: pathModule
    } = deps;

    const { electronURL: url, isDevelopment: isDev, isTest: testMode, isMacOS: macos, isWin: win } = utils;

    let runApp = true;

    async function createWindow () {
        const mainWindow = new BrowserWindowCtor({
            width: 1400,
            height: 1000,
            show: false,
            webPreferences: {
                enableRemoteModule: false,
                nodeIntegration: false,
                contextIsolation: true,
                preload: pathModule.join(__static, 'preload.js')
            }
        });


        // Event listeners on the window
        mainWindow.webContents.on('did-finish-load', () => {
            mainWindow.show();
            mainWindow.focus();
            // menu system needs to access the main window
            menuApi.setMainWindow(mainWindow);
            template.setMainWindow(mainWindow);

        });

        mainWindow.on('close', (event) => {
            if (runApp) {
                event.preventDefault();
                mainWindow.webContents.send('close-app-request');
            }
        });

        if (url) {
            loggerApi.log.info('Running in development mode with WEBPACK_DEV_SERVER_URL: ' + url);
            // Load the url of the dev server when in development mode
            await mainWindow.loadURL(url);
            if (!testMode) {
                mainWindow.webContents.openDevTools();
            }
        } else {
            createProtocolFn('app');
            // Load the index.html when not in development mode
            mainWindow.loadURL('app://./index.html');
        }
    }
    // Scheme must be registered before the app is ready
    protocol.registerSchemesAsPrivileged([
        { scheme: 'app', privileges: { secure: true, standard: true } }
    ]);

    // Quit when all windows are closed.
    app.on('window-all-closed', () => {
        // On macOS it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (!macos) {
            loggerApi.log.debug('Quit application');
            app.quit();
        } else {
            loggerApi.log.debug('Ignoring window-all-closed for MacOS');
        }
    });

    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        loggerApi.log.debug('Activate application');
        if (BrowserWindowCtor.getAllWindows().length === 0) {
            createWindow();
        }
    });

    // This method will be called when Electron has finished initialization
    // and is ready to create browser windows
    // Some APIs can only be used after this event occurs.
    app.on('ready', async () => {
        loggerApi.log.debug('Building the menu system for the default language');
        let template = menuApi.getMenuTemplate();
        MenuApi.setApplicationMenu(MenuApi.buildFromTemplate(template));

        // Install Vue Devtools
        if (isDev && !testMode) {
            try {
                await installExtensionFn(devtoolsId);
            } catch (e) {
                loggerApi.log.error('Vue Devtools failed to install:', e.toString());
            }
        }

        ipcMainApi.on('close-app', handleCloseApp);
        ipcMainApi.on('model-closed', handleModelClosed);
        ipcMainApi.on('model-open-confirmed', handleModelOpenConfirmed);
        ipcMainApi.on('model-opened', handleModelOpened);
        ipcMainApi.on('model-print', handleModelPrint);
        ipcMainApi.on('model-save', handleModelSave);
        ipcMainApi.on('update-menu', handleUpdateMenu);
        ipcMainApi.on('set-template-folder-default', handleSetTemplateFolderDefault);
        ipcMainApi.on('set-template-folder-custom', handleSetTemplateFolderCustom);
        ipcMainApi.on('set-template-folder-existing', handleSetTemplateFolderExisting);
        ipcMainApi.on('get-templates', handleGetTemplates);
        ipcMainApi.on('bootstrap-templates', handleBootstrapTemplates);
        ipcMainApi.on('import-template', handleImportTemplate);
        ipcMainApi.on('fetch-model-by-id', handleFetchModelById);
        ipcMainApi.on('export-template', handleExportTemplate);
        ipcMainApi.on('delete-template', handleDeleteTemplate);
        ipcMainApi.on('update-template', handleUpdateTemplate);

        createWindow();

        // check for updates from github releases site
        autoUpdaterApi.checkForUpdatesAndNotify();
    });

    // this is emitted when a 'recent document' is opened
    app.on('open-file', function (event, filePath) {
        // apply custom handler to this event
        event.preventDefault();
        loggerApi.log.debug('Request to open file from recent documents: ' + filePath);
        menuApi.openModelRequest(filePath);
    });

    function handleSetTemplateFolderDefault() {
        loggerApi.log.debug('Set template folder to default location');
        template.setTemplateFolderDefault();
    }

    function handleSetTemplateFolderCustom() {
        loggerApi.log.debug('Set template folder to custom location');
        template.setTemplateFolderCustom();
    }

    function handleSetTemplateFolderExisting() {
        loggerApi.log.debug('Select existing template folder');
        template.setTemplateFolderExisting();
    }

    function handleGetTemplates() {
        loggerApi.log.debug('Get templates request from renderer');
        template.getTemplates();
    }

    function handleBootstrapTemplates() {
        loggerApi.log.debug('Bootstrap templates request from renderer');
        template.bootstrapTemplates();
    }

    function handleCloseApp () {
        loggerApi.log.debug('Close application request from renderer ');
        runApp = false;
        app.quit();
    }

    function handleModelClosed (_event, fileName) {
        loggerApi.log.debug('Close model notification from renderer for file name: ' + fileName);
        menuApi.modelClosed();
    }

    function handleModelOpenConfirmed (_event, fileName) {
        loggerApi.log.debug('Open model confirmation from renderer for file name: ' + fileName);
        menuApi.openModel(fileName);
    }

    function handleModelOpened (_event, fileName) {
        loggerApi.log.debug('Open model notification from renderer for file name: ' + fileName);
        menuApi.modelOpened();
    }


    function handleModelPrint (_event, format) {
        loggerApi.log.debug('Model print request from renderer with printer : ' + format);
        menuApi.modelPrint(format);
    }

    function handleModelSave (_event, modelData, fileName) {
        loggerApi.log.debug('Model save request from renderer with file name : ' + fileName);
        menuApi.modelSave(modelData, fileName);
    }
    function handleImportTemplate(_event, templateData) {
        loggerApi.log.debug('Import template request from renderer');
        template.importTemplate(templateData);
    }

    function handleFetchModelById(_event, templateId) {
        loggerApi.log.debug('Fetch model by ID request from renderer for template ID: ' + templateId);
        template.fetchModelById(templateId);
    }
    function handleUpdateMenu (_event, locale) {
        loggerApi.log.debug('Re-labeling the menu system for: ' + locale);
        menuApi.setLocale(locale);
        let template = menuApi.getMenuTemplate();
        MenuApi.setApplicationMenu(MenuApi.buildFromTemplate(template));
    }

    function handleExportTemplate(_event, data, filename) {
        loggerApi.log.debug('Export template request from renderer with filename: ' + filename);
        template.exportTemplate(data, filename);
    }

    function handleDeleteTemplate(_event, templateId) {
        loggerApi.log.debug('Delete template request from renderer for template ID: ' + templateId);
        template.deleteTemplate(templateId);
    }

    function handleUpdateTemplate(_event, templateMetadata) {
        loggerApi.log.debug('Update template request from renderer for template ID: ' + templateMetadata.id);
        template.updateTemplate(templateMetadata);
    }

    // Exit cleanly on request from parent process in development mode.
    if (isDev) {
        if (win) {
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
}

if (!isTest) {
    registerDesktop({
        app,
        protocol,
        BrowserWindow,
        Menu,
        ipcMain,
        menu,
        logger,
        utils: { electronURL, isDevelopment, isTest, isMacOS, isWin },
        createProtocol,
        installExtension,
        VUEJS_DEVTOOLS,
        autoUpdater,
        path
    });
}

