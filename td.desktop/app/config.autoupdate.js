'use strict';

function autoupdate(common, dialogs, electron, VERSION) {

    const log = electron.log;
    var logInfo = common.logger.getLogFn('config.autoupdate', 'info');
    var logError = common.logger.getLogFn('config.autoupdate', 'error');

    //adapted from https://github.com/crilleengvall/electron-tutorial-app

    const os = require('os').platform();
    const fs = require('fs');
    const path = require('path');
    var autoUpdater;

    function doUpdate() {
        autoUpdater.quitAndInstall();
    }

    function updateLater() {
        //this does not work - how to get it to update later
        //electron.userData.set({configName : 'preferences', key: 'updateOnLaunch'}, true);
    }

    // on windows only do this when executing from the installed location
    //https://github.com/electron/electron/issues/4535
    if (os === 'darwin' || fs.existsSync(path.resolve(path.dirname(process.execPath), '..', 'update.exe'))) {

        //temporary hack to get around lack of code signing in OSX
        try {
            autoUpdater = electron.autoUpdater;
            var feedURL;

            if (os === 'darwin') {
                feedURL = 'https://threatdragondownloads.azurewebsites.net/update/osx/' + VERSION;
            } else {
                feedURL = 'https://threatdragondownloads.azurewebsites.net/update/win32/' + VERSION;
            }

            autoUpdater.setFeedURL(feedURL);
            autoUpdater.on('update-downloaded', function () {
                dialogs.confirm('./app/layout/update.html', doUpdate, function () { return null; }, updateLater);
            });

            autoUpdater.checkForUpdates();
            logInfo('Configured autoupdate');
        }
        catch (e) {
            //do nothing
            logError('Failed to configure autoupdate');
            logError(e.message);
            log.error('Failed to configure autoupdate', e.message);
        }
    } else {
        logInfo('Skipped autoupdate config');
        log.info('Skipped autoupdate config');
    }
}

module.exports = autoupdate;
