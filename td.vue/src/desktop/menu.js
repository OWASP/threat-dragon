'use strict';

import { dialog } from 'electron';
import { log } from './logger.js';

const isMacOS = process.platform === 'darwin';

const { shell } = require('electron');
const providerType = 'local';

// access the i18n message strings
import el from '../i18n/el.js';
import en from '../i18n/en.js';
import es from '../i18n/es.js';
import cn from '../i18n/cn.js';
import de from '../i18n/de.js';
import fr from '../i18n/fr.js';
import pt from '../i18n/pt.js';
import ru from '../i18n/ru.js';
// cn and zh are synonyms
const zh = cn;
const messages = { el, en, es, cn, de, fr, pt, ru, zh};
var language = 'en';

export function getMenuTemplate () {
    return [
        ...(isMacOS ? [{ role: 'appMenu' }] : []),
        {
            label: messages[language].desktop.file.heading,
            submenu: [
                {
                    label: messages[language].desktop.file.open,
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
                    label: messages[language].desktop.file.save,
                    click () {
                        saveThreatModel();
                    }
                },
                {
                    label: messages[language].desktop.file.saveAs,
                    click () {
                        saveAsThreatModel();
                    }
                },
                {
                    label: messages[language].desktop.file.close,
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
            label: messages[language].desktop.help.heading,
            submenu: [
                {
                    label: messages[language].desktop.help.docs,
                    click: async () => {
                        await shell.openExternal('https://www.threatdragon.com/docs/');
                    }
                },
                {
                    label: messages[language].desktop.help.visit,
                    click: async () => {
                        await shell.openExternal('https://owasp.org/www-project-threat-dragon/');
                    }
                },
                {
                    label: messages[language].desktop.help.sheets,
                    click: async () => {
                        await shell.openExternal('https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html');
                    }
                },
                { type: 'separator' },
                {
                    label: messages[language].desktop.help.github,
                    click: async () => {
                        await shell.openExternal('https://github.com/owasp/threat-dragon/');
                    }
                },
                {
                    label: messages[language].desktop.help.submit,
                    click: async () => {
                        await shell.openExternal('https://github.com/owasp/threat-dragon/issues/new/choose/');
                    }
                },
                {
                    label: messages[language].desktop.help.check,
                    click: async () => {
                        await shell.openExternal('https://github.com/OWASP/threat-dragon/releases/');
                    }
                },
                { type: 'separator' },
                { role: 'about' }
            ]
        }
    ];
}

// close the model using modal dialog if changed
function closeThreatModel () {
    log.debug('Close ' + providerType + ' model file, redirect to /dashboard/');
    dialog.showErrorBox('Not yet implemented', 'Close model file TBD for ' + providerType);
}

// Open file system dialog
function openThreatModel () {
    log.debug('Open File redirected to /${providerType}/threatmodel/import');
    dialog.showOpenDialog({
        title: messages[language].desktop.file.open,
        properties: ['openFile'],
        filters: [
            { name: 'Threat Model', extensions: ['json'] },
            { name: 'All Files', extensions: ['*'] }
        ]
    }).then(result => {
        if (result.canceled === false) {
            log.info(messages[language].threatmodel.opened + ': ' + result.filePath);
        }
    }).catch(err => {
        log.warn(messages[language].threatmodel.errors.open + ': ' + err);
    });
}

// save the model catching any errors
function saveThreatModel () {
    log.debug('Save ' + providerType + ' model file');
    // if threat model exists, save to file system without dialog
    dialog.showErrorBox('Not yet implemented', 'Save model file TBD for ' + providerType);
}

// SaveAs file system dialog
function saveAsThreatModel () {
    dialog.showSaveDialog({
        title: messages[language].desktop.file.saveAs,
        properties: ['showHiddenFiles'],
        filters: [
            { name: 'Threat Model', extensions: ['json'] },
            { name: 'All Files', extensions: ['*'] }
        ]
    }).then(result => {
        if (result.canceled === false) {
            log.info(messages[language].threatmodel.saved + ': ' + result.filePath);
        }
    }).catch(err => {
        log.warn(messages[language].threatmodel.errors.save + ': ' + err);
    });
}

export const setLocale = (locale) => {
    language = locale;
};

export default {
    getMenuTemplate,
    setLocale
};
