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
	const logID = 'Electron Service: ';

    log.debug(logID + 'logging verbosity level', logLevel);
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
        log.debug(logID + 'save');
        dialog.showSaveDialog(remote.getCurrentWindow(), {
            defaultPath: "new-model.json",
            filters: [{ name: 'Threat Models', extensions: ['json'] }]
        }).then(result => {
            if (result.canceled) {
                log.warn(logID + 'save canceled');
                onNoSave();
            } else {
                log.info(logID + 'save to file:', result.filePath);
                onSave(result.filePath);
            }
        }).catch(err => {
            logError('Error on save: ' + err);
            log.error(logID + 'error on save:', err);
        });
    }

    function saveAsPDF(defaultPath, onSave, onNoSave) {
        log.debug(logID + 'save PDF using path:', defaultPath);
        if (defaultPath == null) {
            logInfo('No path to model found, ensure model has been saved');
            log.warn(logID + 'no valid path, no PDF print');
            onNoSave();
            return;
        }
        dialog.showSaveDialog(remote.getCurrentWindow(), {
            defaultPath: defaultPath,
            filters: [{ name: 'PDF files', extensions: ['pdf'] }]
        }).then(result => {
            if (result.canceled) {
                log.warn(logID + 'save PDF canceled');
                onNoSave();
            } else {
                log.info(logID + 'save to PDF file:', result.filePath);
                onSave(result.filePath);
            }
        }).catch(err => {
            logError('Error on PDF save: ' + err);
            log.error(logID + 'error on PDF save:', err);
        });
    }

    function open(onOpen, onNoOpen) {
        log.debug(logID + 'open');
        dialog.showOpenDialog(remote.getCurrentWindow(), {
            filters: [{ name: 'Threat Models', extensions: ['json'] }, { name: 'All Files', extensions: ['*'] }]
        }).then(result => {
            if (result.canceled) {
                log.info(logID + 'open canceled');
                onNoOpen();
            } else {
                log.info(logID + 'open file', result.filePaths);
                onOpen(result.filePaths);
            }
        }).catch(err => {
            logError('Error on open: ' + err);
            log.error(logID + 'error on open:', err);
        });
    }

    function getUserData(location) {
        const data = parseDataFile(location.configName, defaultPreferences);
        log.info(logID + 'got user data:', data);
        return data[location.key];
    }

    function setUserData(location, value) {
        var configName = location.configName;
        var data = parseDataFile(configName, defaultPreferences);
        data[location.key] = value;
        try {
            logInfo('writing: ' + JSON.stringify(data));
            fs.writeFileSync(getFilePath(configName), JSON.stringify(data), 'utf8');
            log.debug(logID + 'wrote:', JSON.stringify(data));
        }
        catch (error) {
            logError('Error on write: ' + error.message);
            log.error(logID + 'error on write:', error.message);
        }
    }

    //private methods

    function parseDataFile(configName, defaults) {

        var filePath = getFilePath(configName);
        logInfo('Threat Model file ' + filePath);
        log.info(logID + 'path:',  filePath);

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
