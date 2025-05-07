// This file is used to bundle Electron dependencies
const electron = require('electron');
const electronUpdater = require('electron-updater');
const electronLog = require('electron-log');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Export common modules used by the Electron app
module.exports = {
    electron,
    electronUpdater,
    electronLog,
    path,
    fs,
    os
};
