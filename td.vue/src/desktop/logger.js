'use strict';

const isDevelopment = process.env.NODE_ENV !== 'production';
const isMacOS = process.platform === 'darwin';
const isWin = (process.platform === 'win32' || process.platform === 'win64');

export const log = require('electron-log');
if (isDevelopment) {
    if (isMacOS) {
        console.log('** Redirecting console log to ~/Library/Logs/Threat\\ Dragon/main.log');
    } else if (isWin) {
        console.log('** Redirecting console log to AppData\\Roaming\\Threat/ Dragon\\logs\\main.log');
    } else {
        console.log('** Redirecting console log to ~/.config/Threat\\ Dragon/logs/main.log');
    }
}

// set up electron-specific logging
const logLevel = process.env.LOG_LEVEL || 'debug';
log.info('Electron log level is set to: ' + logLevel);
log.transports.file.level = logLevel;

// use electron-log instead of default console
Object.assign(console, log.functions);

if (!isDevelopment) {
    // in production only print error messages to console
    log.transports.console.level = 'error';
}

export default {
    log
};
