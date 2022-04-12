'use strict';

import { dialog } from 'electron';

const isMacOS = process.platform === 'darwin';
const { shell } = require('electron');

export const menuTemplate = [
    ...(isMacOS ? [{ role: 'appMenu' }] : []),
    {
        label: 'File',
        submenu: [
            {
                label: 'Open (TBD)',
                click() {
                    dialog.showErrorBox( 'Not yet implemented', 'Open file system dialog TBD' );
                }
            },
            {
                label: 'Save (TBD)',
                click() {
                    dialog.showErrorBox( 'Not yet implemented', 'Save file system dialog TBD' );
                }
            },
            {
                label: 'Save As (TBD)',
                click() {
                    dialog.showErrorBox( 'Not yet implemented', 'Save As file system dialog TBD' );
                }
            },
            {
                label: 'Close Model (TBD)',
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
                label: 'Documentation',
                click: async () => {
                    await shell.openExternal('https://www.threatdragon.com/docs/');
                }
            },
            {
                label: 'Visit us at OWASP',
                click: async () => {
                    await shell.openExternal('https://owasp.org/www-project-threat-dragon/');
                }
            },
            {
                label: 'OWASP Cheat Sheets',
                click: async () => {
                    await shell.openExternal('https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html');
                }
            },
            { type: 'separator' },
            {
                label: 'Visit us on GitHub',
                click: async () => {
                    await shell.openExternal('https://github.com/owasp/threat-dragon/');
                }
            },
            {
                label: 'Submit an Issue',
                click: async () => {
                    await shell.openExternal('https://github.com/owasp/threat-dragon/issues/new/choose/');
                }
            },
            {
                label: 'Check for updates ...',
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
