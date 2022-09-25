'use strict';

import { dialog } from 'electron';
import { tc } from '../i18n/index.js';

const isMacOS = process.platform === 'darwin';
const { shell } = require('electron');

export const menuTemplate = [
    ...(isMacOS ? [{ role: 'appMenu' }] : []),
    {
        label: tc('desktop.file.heading'),
        submenu: [
            {
                label: tc('desktop.file.open'),
                click () {
                    openThreatModel();
                }
            },
            {
                role: 'recentdocuments',
                submenu: [
                    { role: 'clearrecentdocuments' }
                ]
            },
            {
                label: tc('desktop.file.save'),
                click () {
                    saveThreatModel();
                }
            },
            {
                label: tc('desktop.file.saveAs'),
                click () {
                    saveAsThreatModel();
                }
            },
            {
                label: tc('desktop.file.close'),
                click () {
                    closeThreatModel();
                }
            },
            { type: 'separator' },
            { role: 'close' }
        ]
    },
    { role: 'editMenu' },
    { role: 'viewMenu' },
    { role: 'windowMenu' },
    {
        label: tc('desktop.help.heading'),
        submenu: [
            {
                label: tc('desktop.help.docs'),
                click: async () => {
                    await shell.openExternal('https://www.threatdragon.com/docs/');
                }
            },
            {
                label: tc('desktop.help.visit'),
                click: async () => {
                    await shell.openExternal('https://owasp.org/www-project-threat-dragon/');
                }
            },
            {
                label: tc('desktop.help.sheets'),
                click: async () => {
                    await shell.openExternal('https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html');
                }
            },
            { type: 'separator' },
            {
                label: tc('desktop.help.github'),
                click: async () => {
                    await shell.openExternal('https://github.com/owasp/threat-dragon/');
                }
            },
            {
                label: tc('desktop.help.submit'),
                click: async () => {
                    await shell.openExternal('https://github.com/owasp/threat-dragon/issues/new/choose/');
                }
            },
            {
                label: tc('desktop.help.check'),
                click: async () => {
                    await shell.openExternal('https://github.com/OWASP/threat-dragon/releases/');
                }
            },
            { type: 'separator' },
            { role: 'about' }
        ]
    }
];

// close the model using modal dialog if changed
function closeThreatModel () {
    // Close threat model, if changed then show Save? modal dialog
    dialog.showErrorBox('Not yet implemented', 'Close model file TBD');
}

// Open file system dialog
function openThreatModel () {
    dialog.showOpenDialog({
        title: tc('desktop.file.open'),
        properties: ['openFile'],
        filters: [
            { name: 'Threat Model', extensions: ['json'] },
            { name: 'All Files', extensions: ['*'] }
        ]
    }).then(result => {
        if (result.canceled === false) {
            console.log(tc('threatmodel.opened') + ': ' + result.filePath);
        }
    }).catch(err => {
        console.warn(tc('threatmodel.errors.open') + ': ' + err);
    });
}

// save the model catching any errors
function saveThreatModel () {
    // if threat model exists, save to file system without dialog
    dialog.showErrorBox('Not yet implemented', 'Save model file TBD');
}

// SaveAs file system dialog
function saveAsThreatModel () {
    dialog.showSaveDialog({
        title: tc('desktop.file.saveAs'),
        properties: ['showHiddenFiles'],
        filters: [
            { name: 'Threat Model', extensions: ['json'] },
            { name: 'All Files', extensions: ['*'] }
        ]
    }).then(result => {
        if (result.canceled === false) {
            console.log(tc('threatmodel.saved') + ': ' + result.filePath);
        }
    }).catch(err => {
        console.warn(tc('threatmodel.errors.save') + ': ' + err);
    });
}

export default {
    menuTemplate
};
