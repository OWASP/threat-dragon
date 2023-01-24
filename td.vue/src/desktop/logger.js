'use strict';

const logLevel = process.env.LOG_LEVEL || 'debug';
const isDevelopment = process.env.NODE_ENV !== 'production';
const isMacOS = process.platform === 'darwin';
const isWin = (process.platform === 'win32' || process.platform === 'win64');

export const log = require('electron-log');

if (isDevelopment) {
    if (isMacOS) {
        console.log('** Redirecting console to log ~/Library/Logs/Threat\\ Dragon/main.log');
    } else if (isWin) {
        console.log('** Redirecting console to log AppData\\Roaming\\Threat/ Dragon\\logs\\main.log');
    } else {
        console.log('** Redirecting console to log ~/.config/Threat\\ Dragon/logs/main.log');
    }
}

// set up electron-specific logLevel for the log file
log.info('Electron log level is set to: ' + logLevel);
log.transports.file.level = logLevel;

// redirect electron-console messages to electron-log file (also using logLevel)
Object.assign(console, log.functions);

// only echo error messages to console
log.transports.console.level = 'error';

export default {
    log
};
