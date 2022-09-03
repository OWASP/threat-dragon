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
                click() {
                    // Open file system dialog
                    dialog.showOpenDialog({
                        title: tc('desktop.file.open'),
                        properties: ['openFile'],
                        filters: [
                            { name: 'Threat Models', extensions: ['json'] },
                            { name: 'All Files', extensions: ['*'] }
                        ]
                    }).then(result => {
                        if (result.canceled === false) {
                            console.log(result.filePaths)
                        }
                    }).catch(err => {
                        console.log(err)
                    });
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
                click() {
                    // Save file system dialog
                    dialog.showErrorBox( 'Not yet implemented', 'Save model file TBD' );
                }
            },
            {
                label: tc('desktop.file.saveAs'),
                click() {
                    // SaveAs file system dialog
                    dialog.showSaveDialog({
                        title: tc('desktop.file.saveAs'),
                        properties: ['showHiddenFiles'],
                        filters: [
                            { name: 'Threat Models', extensions: ['json'] },
                            { name: 'All Files', extensions: ['*'] }
                        ]
                    }).then(result => {
                        if (result.canceled === false) {
                            console.log(result.filePath)
                        }
                    }).catch(err => {
                        console.log(err)
                    });
                }
            },
            {
                label: tc('desktop.file.close'),
                click() {
                    // Close file system dialog
                    dialog.showErrorBox( 'Not yet implemented', 'Close model file TBD' );
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

export default {
    menuTemplate
};
