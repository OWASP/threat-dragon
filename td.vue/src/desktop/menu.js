'use strict';

import { app, dialog } from 'electron';
import { log } from './logger.js';

const isMacOS = process.platform === 'darwin';

const { shell } = require('electron');
const fs = require('fs');

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

var model = {};
var filePath = '';
var isOpen = false;

export function getMenuTemplate () {
    return [
        ...(isMacOS ? [{ role: 'appMenu' }] : []),
        {
            label: messages[language].desktop.file.heading,
            submenu: [
                {
                    label: messages[language].desktop.file.open,
                    click () {
                        openModel();
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
                        saveModel();
                    }
                },
                {
                    label: messages[language].desktop.file.saveAs,
                    click () {
                        saveAsModel();
                    }
                },
                {
                    label: messages[language].desktop.file.close,
                    click () {
                        closeModel();
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

// close the model
function closeModel () {
    log.info(messages[language].desktop.file.close + ': ' + filePath);
    // TODO: send an empty model to the renderer
    modelClosed();
}

// clear out the model
export function modelClosed () {
    model = '';
    filePath = '';
    isOpen = false;
}

// Open file system dialog and read file contents into model
function openModel () {
    // TODO check that an existing file is not open and modified
    dialog.showOpenDialog({
        title: messages[language].desktop.file.open,
        properties: ['openFile'],
        filters: [
            { name: 'Threat Model', extensions: ['json'] },
            { name: 'All Files', extensions: ['*'] }
        ]
    }).then(result => {
        if (result.canceled === false) {
            filePath = result.filePaths[0];
            log.info(messages[language].desktop.file.open + ': ' + filePath);
            fs.readFile(filePath, (err, data) => {
                if (!err) {
                    // TODO: send the model to the renderer
                    model = data.toJSON();
                    isOpen = true;
                    // add the file name to the recent file list
                    app.addRecentDocument(filePath);
                } else {
                    log.warn(messages[language].threatmodel.errors.open + ': ' + err);
                    isOpen = false;
                }
            });
        } else {
            log.debug(messages[language].desktop.file.open + ' canceled');
        }
    }).catch(err => {
        log.warn(messages[language].threatmodel.errors.open + ': ' + err);
    });
}

// save the model catching any errors
function saveModel () {
    // if threat model exists, save to file system without dialog
    if (isOpen === true) {
        log.info(messages[language].threatmodel.saved + ': ' + filePath);
        // TODO: get the model from the renderer
        model = 'dummy data read from renderer';
        fs.writeFile(filePath, model, (err) => {
            if (err) {
                log.error(messages[language].threatmodel.errors.save + ': ' + err);
            }
        });
    } else {
        // quietly ignore
        log.debug(messages[language].desktop.file.save + ': empty file');
    }
}

// Open saveAs file system dialog and write contents to new file location
function saveAsModel () {
    var dialogOptions = {
        title: messages[language].desktop.file.saveAs,
        filters: [{ name: 'Threat Model', extensions: ['json'] }, { name: 'All Files', extensions: ['*'] }]
    };

    dialog.showSaveDialog(dialogOptions).then(result => {
        if (result.canceled === false) {
            filePath = result.filePaths[0];
            isOpen = true;
            log.info(messages[language].desktop.file.saveAs + ': ' + filePath);
            saveModel();
        } else {
            log.debug(messages[language].desktop.file.saveAs + ' canceled');
        }
    }).catch(err => {
        log.error(messages[language].desktop.file.saveAs + ': ' + messages[language].threatmodel.errors.save + ': ' + err);
    });
}

export const setLocale = (locale) => {
    language = locale;
};

export default {
    getMenuTemplate,
    modelClosed,
    setLocale
};
