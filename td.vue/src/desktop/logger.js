'use strict';
export const log = require('electron-log');

export const consoleLogLevel = 'error';
export const fileLogLevel = process.env.LOG_LEVEL || 'debug';
const isDevelopment = process.env.NODE_ENV !== 'production';
const isMacOS = process.platform === 'darwin';
const isWin = (process.platform === 'win32' || process.platform === 'win64');

if (isDevelopment) {
    if (isMacOS) {
        console.log('** Redirecting console to log ~/Library/Logs/Threat\\ Dragon/main.log');
    } else if (isWin) {
        console.log('** Redirecting console to log AppData\\Roaming\\Threat/ Dragon\\logs\\main.log');
    } else {
        console.log('** Redirecting console to log ~/.config/Threat\\ Dragon/logs/main.log');
    }
}

// set up electron-specific fileLogLevel for the log file
log.info('Electron log level is set to: ' + fileLogLevel);
log.transports.file.level = fileLogLevel;

// redirect electron-console messages to electron-log file (also uses fileLogLevel)
Object.assign(console, log.functions);

// only echo error messages to console
log.transports.console.level = consoleLogLevel;
