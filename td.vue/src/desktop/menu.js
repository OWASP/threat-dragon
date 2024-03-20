'use strict';

import { app, dialog } from 'electron';
import path from 'path';
import logger from './logger.js';
import { isMacOS } from './utils.js';

const { shell } = require('electron');
const fs = require('fs');

// provided by electron server bootstrap
var mainWindow;

// access the i18n message strings
import ara from '@/i18n/ar.js';
import deu from '@/i18n/de.js';
import ell from '@/i18n/el.js';
import eng from '@/i18n/en.js';
import fin from '@/i18n/fi.js';
import fra from '@/i18n/fr.js';
import hin from '@/i18n/hi.js';
import id from '@/i18n/id.js';
import ms from '@/i18n/ms.js';
import por from '@/i18n/pt.js';
// hide RUS & UKR for now: import rus from '@/i18n/ru.js';
import spa from '@/i18n/es.js';
// hide RUS & UKR for now: import ukr from '@/i18n/uk.js';
import zho from '@/i18n/zh.js';

const messages = { ara, deu, ell, eng, fin, fra, hin, id, ms, por, spa, zho };
// hide RUS & UKR for now: const messages = { ara, deu, ell, eng, fin, fra, hin, id, ms, por, rus, spa, ukr, zho };
const languages = [ 'ara', 'deu', 'ell', 'eng', 'fin', 'fra', 'hin', 'id', 'ms', 'por', 'spa', 'zho' ];
// hide RUS & UKR for now: const languages = [ 'ara', 'deu', 'ell', 'eng', 'fin', 'fra', 'hin', 'id', 'ms', 'por', 'rus', 'spa', 'ukr', 'zho' ];
const defaultLanguage = 'eng';
var language = defaultLanguage;

export const model = {
    fileDirectory: '',
    filePath: '',
    isOpen: false
};

export function getMenuTemplate () {
    return [
        ...(isMacOS ? [{ role: 'appMenu' }] : []),
        {
            label: messages[language].desktop.file.heading,
            submenu: [
                {
                    label: messages[language].desktop.file.open,
                    click () {
                        openModelRequest('');
                    }
                },
                {
                    label: messages[language].desktop.file.recentDocs,
                    role: 'recentdocuments',
                    submenu: [
                        {
                            label: messages[language].desktop.file.clearRecentDocs,
                            role: 'clearrecentdocuments'
                        }
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
                        saveModelAs();
                    }
                },
                {
                    label: messages[language].desktop.file.new,
                    click () {
                        newModel();
                    }
                },
                {
                    label: messages[language].forms.exportAs,
                    submenu: [
                        {
                            label: messages[language].forms.exportHtml,
                            click () {
                                printModel('HTML');
                            }
                        },
                        {
                            label: messages[language].forms.exportPdf,
                            click () {
                                printModel('PDF');
                            }
                        },
                        {
                            label: messages[language].forms.exportOtm,
                            enabled: false
                        },
                        {
                            label: messages[language].forms.exportTd,
                            enabled: false
                        }
                    ]
                },
                {
                    label: messages[language].desktop.file.close,
                    click () {
                        closeModelRequest();
                    }
                },
                { type: 'separator' },
                {
                    label: messages[language].desktop.file.closeWindow,
                    role: 'close'
                }
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
                        await shell.openExternal('https://owasp.org/www-project-threat-dragon/docs-2/');
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

// Open file system dialog and read file contents into model
function openModel (filename) {
    logger.log.debug('Open file with name : ' + filename);

    if (filename !== '') {
        openModelFile(filename);
        return;
    }

    // no filename yet, so ask for one
    dialog.showOpenDialog({
        title: messages[language].desktop.file.open,
        properties: ['openFile'],
        filters: [
            { name: 'Threat Model', extensions: ['json'] },
            { name: 'All Files', extensions: ['*'] }
        ]
    }).then(result => {
        if (result.canceled === false) {
            openModelFile(result.filePaths[0]);
        } else {
            logger.log.debug(messages[language].desktop.file.open + ' : canceled');
        }
    }).catch(err => {
        logger.log.warn(messages[language].threatmodel.errors.open + ': ' + err);
        model.isOpen = false;
    });
}

// request to the renderer for confirmation that it is OK to open a model file
function openModelRequest (filename) {
    logger.log.debug('Request to renderer to open an existing model');
    mainWindow.webContents.send('open-model-request', filename);
}

// request to the renderer for confirmation that it is OK to open a model file
function openModelFile (filename) {
    logger.log.debug(messages[language].desktop.file.open + ': ' + filename);
    fs.readFile(filename, (err, data) => {
        if (!err) {
            let modelData = JSON.parse(data);
            mainWindow.webContents.send('open-model', path.basename(filename), modelData);
            model.filePath = filename;
            model.isOpen = true;
            model.fileDirectory = path.dirname(filename);
            app.addRecentDocument(filename);
        } else {
            logger.log.warn(messages[language].threatmodel.errors.open + ': ' + err);
            model.isOpen = false;
        }
    });
}

// request that the renderer send the model data, retain existing filename
function saveModel () {
    if (model.isOpen === false) {
        logger.log.debug('Skip save request because no model is open');
        return;
    }
    logger.log.debug(messages[language].desktop.file.save + ': ' + 'prompt renderer for model data');
    mainWindow.webContents.send('save-model-request', path.basename(model.filePath));
}

// request that the renderer send the model data
function saveModelAs () {
    if (model.isOpen === false) {
        logger.log.debug('Skip saveAs request because no model is open');
        return;
    }
    logger.log.debug(messages[language].desktop.file.saveAs + ': ' + 'clear location, prompt renderer for model data');
    // clear any existing filename to force a SaveAs
    model.filePath = '';
    mainWindow.webContents.send('save-model-request', path.basename(model.filePath));
}

// Open saveAs file system dialog and write contents to new file location
function saveModelDataAs (modelData, fileName) {
    let newName = 'new-model.json';
    if (fileName) {
        newName = fileName;
    }
    var dialogOptions = {
        title: messages[language].desktop.file.saveAs,
        defaultPath: path.join(model.fileDirectory, newName),
        filters: [{ name: 'Threat Model', extensions: ['json'] }, { name: 'All Files', extensions: ['*'] }]
    };

    dialog.showSaveDialog(dialogOptions).then(result => {
        if (result.canceled === false) {
            model.filePath = result.filePath;
            model.isOpen = true;
            model.fileDirectory = path.dirname(model.filePath);
            logger.log.debug(messages[language].desktop.file.saveAs + ': ' + model.filePath);
            app.addRecentDocument(model.filePath);
            saveModelData(modelData);
        } else {
            logger.log.debug(messages[language].desktop.file.saveAs + ' : canceled');
        }
    }).catch(err => {
        logger.log.error(messages[language].desktop.file.saveAs + ': ' + messages[language].threatmodel.errors.save + ': ' + err);
        model.isOpen = false;
    });
}

// request that the renderer open a new model
function newModel () {
    let newName = 'new-model.json';
    logger.log.debug(messages[language].desktop.file.new + ': ' + newName);
    mainWindow.webContents.send('new-model-request', newName);
}

// request that the renderer display the model report/print page
function printModel (format) {
    if (model.isOpen === false) {
        logger.log.debug('Skip print request because no model open');
        return;
    }
    logger.log.debug(messages[language].forms.exportPdf+ ': ' + model.filePath);
    // prompt the renderer to open the print/report window
    mainWindow.webContents.send('print-model-request', format);
}

// request that the renderer close the model
function closeModelRequest () {
    logger.log.debug(messages[language].desktop.file.close + ': ' + model.filePath);
    mainWindow.webContents.send('close-model-request', path.basename(model.filePath));
}

// save the threat model
function saveModelData (modelData) {
    if (model.isOpen === true) {
        fs.writeFile(model.filePath, JSON.stringify(modelData, undefined, 2), (err) => {
            if (err) {
                logger.log.error(messages[language].threatmodel.errors.save + ': ' + err);
            } else {
                logger.log.debug(messages[language].threatmodel.saved + ': ' + model.filePath);
            }
        });
    } else {
        // quietly ignore
        logger.log.debug(messages[language].desktop.file.save + ': ignored empty file');
    }
}

// Open saveAs file system dialog and write report contents as HTML
function saveHTMLReport (htmlPath) {
    htmlPath += '.html';
    var dialogOptions = {
        title: messages[language].forms.saveAS,
        defaultPath: htmlPath,
        filters: [{ name: 'HTML export', extensions: ['html'] }, { name: 'All Files', extensions: ['*'] }]
    };

    dialog.showSaveDialog(dialogOptions).then(result => {
        if (result.canceled === false) {
            htmlPath = result.filePath;
            mainWindow.webContents.savePage(htmlPath, 'HTMLComplete').then(() => {
                logger.log.debug(messages[language].forms.saveAs + ' : ' + htmlPath);
            }).catch(error => {
                logger.log.error(`Failed to write HTML to ${htmlPath}: `, error);
            });
        } else {
            logger.log.debug(messages[language].forms.saveAs + ' : canceled');
        }
    }).catch(err => {
        logger.log.error(err);
    });
}

// Open saveAs file system dialog and write PDF report
function savePDFReport (pdfPath) {
    pdfPath += '.pdf';
    var dialogOptions = {
        title: messages[language].forms.exportPdf,
        defaultPath: pdfPath,
        filters: [{ name: 'PDF report', extensions: ['.pdf'] }, { name: 'All Files', extensions: ['*'] }]
    };

    dialog.showSaveDialog(dialogOptions).then(result => {
        if (result.canceled === false) {
            pdfPath = result.filePath;
            mainWindow.webContents.printToPDF({
                landscape: false,
                displayHeaderFooter: false,
                printBackground: false,
                pageSize: 'A4',
                margins: { top: 0, bottom: 0, left: 0, right: 0 },
                preferCSSPageSize: true
            }).then(data => {
                fs.writeFile(pdfPath, data, (error) => {
                    if (error) throw error;
                    logger.log.debug(`Wrote PDF successfully to ` + pdfPath);
                });
            }).catch(error => {
                logger.log.error(`Failed to write PDF to ${pdfPath}: `, error);
            });

            logger.log.debug(messages[language].forms.exportPdf + ' : ' + pdfPath);
        } else {
            logger.log.debug(messages[language].forms.exportPdf + ' : canceled');
        }
    }).catch(err => {
        logger.log.error(err);
    });
}

// the renderer has closeed / cleared out the model
export const modelClosed = () => {
    model.filePath = '';
    model.isOpen = false;
};

// the renderer has opened a new model
export const modelOpened = () => {
    // for security reasons the renderer can not provide the full path
    // so wait for a save before filling in the file path
    model.filePath = '';
    model.isOpen = true;
};

// the renderer has requested a report to be saved
export const modelPrint = (format) => {
    let reportPath = path.join(path.dirname(model.filePath), path.basename(model.filePath, '.json'));
    if (!model.filePath || model.filePath === '') {
        reportPath = path.join(__dirname, '/new_model');
    }

    if (format === 'PDF') {
        savePDFReport(reportPath);
    } else if (format === 'HTML') {
        saveHTMLReport(reportPath);
    } else {
        logger.log.warn('Report output type not recognised:' + format);
    }
};

// the renderer has requested to save the model with a filename
export const modelSave = (modelData, fileName) => {
    // if the filePath is empty then this is the first time a save has been requested
    if (!model.filePath || model.filePath === '') {
        saveModelDataAs(modelData, fileName);
    } else {
        saveModelData(modelData);
    }
};

// the renderer has changed the language
export const setLocale = (locale) => {
    language = languages.includes(locale) ? locale : defaultLanguage;
};

export const setMainWindow = (window) => {
    mainWindow = window;
};

export default {
    getMenuTemplate,
    modelClosed,
    modelOpened,
    modelPrint,
    modelSave,
    openModel,
    openModelRequest,
    setLocale,
    setMainWindow
};
