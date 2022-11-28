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
// use electron-log instead of default console
console.log = log.log;
// set up electron-specific logging
const logLevel = process.env.LOG_LEVEL || 'info';
log.info('Electron log level is set to: ' + logLevel);
log.transports.file.level = logLevel;

export default {
    log
};
