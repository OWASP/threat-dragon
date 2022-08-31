'use strict';

import { dialog } from 'electron';
import { tc } from '../i18n/index.js';

const isMacOS = process.platform === 'darwin';
const { shell } = require('electron');

export const menuTemplate = [
    ...(isMacOS ? [{ role: 'appMenu' }] : []),
    {
        label: 'File',
        submenu: [
            {
                label: tc('desktop.file.open') + ' (TBD)',
                click() {
                    dialog.showErrorBox( 'Not yet implemented', 'Open file system dialog TBD' );
                }
            },
            {
                role: 'recentdocuments',
                submenu: [
                    { role: 'clearrecentdocuments' }
                ]
            },
            {
                label: tc('desktop.file.save') + ' (TBD)',
                click() {
                    dialog.showErrorBox( 'Not yet implemented', 'Save file system dialog TBD' );
                }
            },
            {
                label: tc('desktop.file.saveAs') + ' (TBD)',
                click() {
                    dialog.showErrorBox( 'Not yet implemented', 'Save As file system dialog TBD' );
                }
            },
            {
                label: tc('desktop.file.close') + ' (TBD)',
                click() {
                    dialog.showErrorBox( 'Not yet implemented', 'Close Model file system dialog TBD' );
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
        label: 'Help',
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
