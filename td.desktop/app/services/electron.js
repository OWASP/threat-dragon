'use strict';

const electron = require('electron');
const remote = electron.remote;
const dialog = remote.dialog;
const globals = remote.getGlobal('params');
const log = globals.logger;
const logLevel = log.transports.console.level;
const fs = require('fs');
const path = require('path');
const userDataPath = electron.remote.app.getPath('userData');

function electronservice(common) {

    log.debug('Electron Service: logging verbosity level', logLevel);

    var logInfo = common.logger.getLogFn('electron service', 'info');
    var logError = common.logger.getLogFn('electron service', 'error');

    var service = {
        dialog: {
            save: save,
            saveAsPDF: saveAsPDF,
            open: open,
            messageBox: messageBox
        },
        currentWindow: remote.getCurrentWindow(),
        shell: electron.shell,
        globals: globals,
        log: log,
        logLevel: logLevel,
        Menu: remote.Menu,
        app: remote.app,
        autoUpdater: remote.autoUpdater,
        userData: {
            get: getUserData,
            set: setUserData
        }
    };

    var defaultPreferences = {
        updateOnLaunch: true
    };

    return service;

    function messageBox(options) {
        dialog.showMessageBox(remote.getCurrentWindow(), options);
    }

    function save(onSave, onNoSave) {
        log.debug('Electron Service: save');
        dialog.showSaveDialog(remote.getCurrentWindow(), {
            defaultPath: "new-model.json",
            filters: [{ name: 'Threat Models', extensions: ['json'] }]
        }).then(result => {
            if (result.canceled) {
                log.warn('Electron Service: save canceled');
                onNoSave();
            } else {
                log.info('Electron Service: save to file', result.filePath);
                onSave(result.filePath);
            }
        }).catch(err => {
            log.error(err);
        });
    }

    function saveAsPDF(defaultPath, onSave, onNoSave) {
        log.debug('Electron Service: save PDF using path:', defaultPath);
        if (defaultPath == null) {
            logInfo('No path to model found, ensure model has been saved');
            log.warn('Electron Service: no valid path, no PDF print');
            onNoSave();
            return;
        }
        dialog.showSaveDialog(remote.getCurrentWindow(), {
            defaultPath: defaultPath,
            filters: [{ name: 'PDF files', extensions: ['pdf'] }]
        }).then(result => {
            if (result.canceled) {
                log.warn('Electron Service: save PDF canceled');
                onNoSave();
            } else {
                log.info('Electron Service: save to PDF file', result.filePath);
                onSave(result.filePath);
            }
        }).catch(err => {
            log.error(err);
        });
    }

    function open(onOpen, onNoOpen) {
        log.debug('Electron Service: open');
        dialog.showOpenDialog(remote.getCurrentWindow(), {
            filters: [{ name: 'Threat Models', extensions: ['json'] }, { name: 'All Files', extensions: ['*'] }]
        }).then(result => {
            if (result.canceled) {
                log.info('Electron Service: open canceled');
                onNoOpen();
            } else {
                log.info('Electron Service: open file', result.filePaths);
                onOpen(result.filePaths);
            }
        }).catch(err => {
            log.error(err);
        });
    }

    function getUserData(location) {
        const data = parseDataFile(location.configName, defaultPreferences);
        logInfo('got ' + data);
        log.info('got', data);
        return data[location.key];
    }

    function setUserData(location, value) {
        var configName = location.configName;
        var data = parseDataFile(configName, defaultPreferences);
        data[location.key] = value;
        try {
            logInfo('writing: ' + JSON.stringify(data));
            fs.writeFileSync(getFilePath(configName), JSON.stringify(data), 'utf8');
            logInfo('wrote: ' + JSON.stringify(data));
            log.info('wrote:', JSON.stringify(data));
        }
        catch (error) {
            logError('error on write: ' + error.message);
            log.error('error on write:', error.message);
        }
    }

    //private methods

    function parseDataFile(configName, defaults) {

        var filePath = getFilePath(configName);
        logInfo('path = ' + filePath);
        log.info('path =', filePath);

        try {
            return JSON.parse(fs.readFileSync(filePath), 'utf8');
        } catch (error) {
            // if there was some kind of error, return the passed in defaults instead.
            return defaults;
        }
    }

    function getFilePath(configName) {
        return path.join(userDataPath, configName + '.json');
    }
}

module.exports = electronservice;
