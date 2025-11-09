'use strict';

import { app, dialog, BrowserWindow } from 'electron';
import path from 'path';
import logger from './logger.js';
import { isMacOS } from './utils.js';

const { shell, ipcMain } = require('electron');
const fs = require('fs');
const { spawn } = require('child_process');
const buildVersion = require('../../package.json').version;

// provided by electron server bootstrap
var mainWindow;
var aiSettingsWindow = null;
var aiThreatsWarningWindow = null;

// access the i18n message strings
import ara from '@/i18n/ar.js';
import deu from '@/i18n/de.js';
import ell from '@/i18n/el.js';
import eng from '@/i18n/en.js';
import fin from '@/i18n/fi.js';
import fra from '@/i18n/fr.js';
import hin from '@/i18n/hi.js';
import ind from '@/i18n/id.js';
import jpn from '@/i18n/ja.js';
import msa from '@/i18n/ms.js';
import por from '@/i18n/pt.js';
import spa from '@/i18n/es.js';
import zho from '@/i18n/zh.js';

const messages = { ara, deu, ell, eng, fin, fra, hin, ind, jpn, msa, por, spa, zho };
const defaultLanguage = 'eng';
var language = defaultLanguage;

export const model = {
    fileDirectory: '',
    filePath: '',
    isOpen: false
};

export function getMenuTemplate () {
    var menuTemplate = (isMacOS ? [{ role: 'appMenu' }] : []);
    menuTemplate.push(
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
            label: messages[language].desktop.aiTools.heading,
            submenu: [
                {
                    label: messages[language].desktop.aiTools.generateThreats,
                    click () {
                        generateThreatsAndMitigations();
                    }
                },
                {
                    label: messages[language].desktop.aiTools.settings,
                    click () {
                        openAISettings();
                    }
                }
            ]
        },
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
                {
                    label: messages[language].desktop.help.about.about,
                    click () {
                        showAboutBox();
                    }
                }
            ]
        }
    );

    if (isMacOS) {
        // recent docs only for macos, see www.electronjs.org/docs/latest/api/menu-item#roles
        menuTemplate[1].submenu.push(
            {
                label: messages[language].desktop.file.recentDocs,
                role: 'recentdocuments',
                submenu: [
                    {
                        label: messages[language].desktop.file.clearRecentDocs,
                        role: 'clearrecentdocuments'
                    }
                ]
            }
        );
    }

    return menuTemplate;
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

// open model file and send to renderer
function openModelFile (filename) {
    logger.log.debug(messages[language].desktop.file.open + ': ' + filename);
    var modelData;

    if (!filename.endsWith('.json')) {
        logger.log.warn(messages[language].threatmodel.errors.onlyJsonAllowed);
        model.isOpen = false;
        mainWindow.webContents.send('open-model', path.basename(filename), {modelError: 'onlyJsonAllowed'});
        return;
    }

    fs.readFile(filename, (err, data) => {
        if (!err) {
            try {
                modelData = JSON.parse(data);
            } catch (err) {
                logger.log.warn(messages[language].threatmodel.errors.invalidJson + ' : ' + err.message);
                model.isOpen = false;
                mainWindow.webContents.send('open-model', path.basename(filename), {modelError: 'invalidJson'});
                return;
            }
            model.isOpen = true;
            mainWindow.webContents.send('open-model', path.basename(filename), modelData);
            model.filePath = filename;
            model.fileDirectory = path.dirname(filename);
            app.addRecentDocument(filename);
        } else {
            logger.log.warn(messages[language].threatmodel.errors.open + ': ' + err);
            model.isOpen = false;
            mainWindow.webContents.send('open-model', path.basename(filename), {modelError: 'open'});
        }
    });
}

// request that the renderer send the model data, retain existing filename
function saveModel () {
    if (model.isOpen === false) {
        logger.log.debug('Skip save request because no model is open');
        mainWindow.webContents.send('save-model-failed', '', messages[language].threatmodel.warnings.noModelOpen);
        return;
    }
    logger.log.debug(messages[language].desktop.file.save + ': ' + 'prompt renderer for model data');
    mainWindow.webContents.send('save-model-request', path.basename(model.filePath));
}

// request that the renderer send the model data
function saveModelAs () {
    if (model.isOpen === false) {
        logger.log.debug('Skip saveAs request because no model is open');
        mainWindow.webContents.send('save-model-failed', '', messages[language].threatmodel.warnings.noModelOpen);
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
        mainWindow.webContents.send('save-model-failed', newName, messages[language].threatmodel.errors.save);
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
        mainWindow.webContents.send('save-model-failed', '', messages[language].threatmodel.warnings.noModelOpen);
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
                mainWindow.webContents.send('save-model-failed', model.filePath, messages[language].threatmodel.errors.save);
            } else {
                logger.log.debug(messages[language].threatmodel.prompts.saved + ': ' + model.filePath);
                mainWindow.webContents.send('save-model-confirmed', model.filePath);
            }
        });
    } else {
        // warn that no model is open
        logger.log.warn(messages[language].threatmodel.warnings.noModelOpen);
        mainWindow.webContents.send('save-model-failed', '', messages[language].threatmodel.warnings.noModelOpen);
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
                mainWindow.webContents.send('print-model-confirmed', htmlPath);
            }).catch(error => {
                logger.log.error(`Failed to write HTML to ${htmlPath}: `, error);
                mainWindow.webContents.send('save-model-failed', htmlPath, messages[language].threatmodel.warnings.export);
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
        properties: ['openFile'],
        filters: [{ name: 'PDF report', extensions: ['pdf'] }, { name: 'All Files', extensions: ['*'] }]
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
                    mainWindow.webContents.send('print-model-confirmed', pdfPath);
                });
            }).catch(error => {
                logger.log.error(`Failed to write PDF to ${pdfPath}: `, error);
                mainWindow.webContents.send('save-model-failed', pdfPath, messages[language].threatmodel.warnings.export);
            });

            logger.log.debug(messages[language].forms.exportPdf + ' : ' + pdfPath);
        } else {
            logger.log.debug(messages[language].forms.exportPdf + ' : canceled');
        }
    }).catch(err => {
        logger.log.error(err);
    });
}

function showAboutBox () {
    var dialogOptions = {
        type: 'info',
        title: messages[language].desktop.help.about.about + ' ' + messages[language].home.title,
        icon: '../assets/threatdragon_logo_solid_image.svg',
        message: messages[language].home.title,
        detail: messages[language].desktop.help.about.version + ' ' + buildVersion
    };
    dialog.showMessageBoxSync(dialogOptions);
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

// the renderer has sent model data for AI threat generation
export const aiThreatGeneration = (modelData) => {
    runPythonThreatGeneration(modelData);
};

// the renderer has changed the language
export const setLocale = (locale) => {
    const languages = [ 'ara', 'deu', 'ell', 'eng', 'fin', 'fra', 'hin', 'ind', 'jpn', 'msa', 'por', 'spa', 'zho' ];
    language = languages.includes(locale) ? locale : defaultLanguage;
};

export const setMainWindow = (window) => {
    mainWindow = window;
};

// AI Tools menu handlers
function generateThreatsAndMitigations() {
    logger.log.debug('Generate Threats & Mitigations clicked');
    
    // Open warning dialog first
    openAIThreatsWarning();
}

function getPythonExecutable() {
    const packageJsonPath = require.resolve('../../package.json');
    const tdVuePath = path.dirname(packageJsonPath);
    const venvPath = path.join(tdVuePath, 'venv');
    const pythonPath = process.platform === 'win32' 
        ? path.join(venvPath, 'Scripts', 'python.exe')
        : path.join(venvPath, 'bin', 'python');
    return path.resolve(pythonPath);
}

function getMainPyPath() {
    const packageJsonPath = require.resolve('../../package.json');
    const tdVuePath = path.dirname(packageJsonPath);
    return path.resolve(path.join(tdVuePath, 'ai-tools', 'src', 'main.py'));
}

function proceedWithThreatGeneration() {
    if (model.isOpen === false) {
        mainWindow.webContents.send('save-model-failed', '', messages[language].threatmodel.warnings.noModelOpen);
        return;
    }
    
    // Request model data from renderer
    logger.log.debug('Requesting model data from renderer for AI threat generation');
    mainWindow.webContents.send('ai-threat-generation-request');
}

function runPythonThreatGeneration(modelData) {
    const pythonExecutable = getPythonExecutable();
    const mainPyPath = getMainPyPath();
    
    if (!fs.existsSync(pythonExecutable)) {
        dialog.showErrorBox('Python Not Found', `Python executable not found at:\n${pythonExecutable}`);
        return;
    }
    
    if (!fs.existsSync(mainPyPath)) {
        dialog.showErrorBox('Script Not Found', `main.py not found at:\n${mainPyPath}`);
        return;
    }
    
    // Load schema JSON - use fs.readFileSync for npm build compatibility
    let schema;
    try {
        // Get the schema file path relative to the package.json location
        const packageJsonPath = require.resolve('../../package.json');
        const tdVuePath = path.dirname(packageJsonPath);
        const schemaPath = path.join(tdVuePath, 'src', 'service', 'schema', 'owasp-threat-dragon-v2.schema.json');
        
        // Read and parse the schema JSON file
        const schemaContent = fs.readFileSync(schemaPath, 'utf8');
        schema = JSON.parse(schemaContent);
        
        logger.log.debug(`Schema loaded from: ${schemaPath}`);
    } catch (err) {
        logger.log.error(`Failed to load schema: ${err.message}`);
        dialog.showErrorBox('Schema Error', `Failed to load schema JSON:\n${err.message}`);
        return;
    }
    
    // Get paths for arguments
    const aiSettingsPath = getAISettingsPath();
    const logsFolderPath = app.getPath('logs');
    
    // Build arguments array
    const args = [
        mainPyPath,
        '--settings-json', aiSettingsPath,
        '--logs-folder', logsFolderPath
    ];
    
    const pythonProcess = spawn(pythonExecutable, args, {
        cwd: path.dirname(mainPyPath),
        stdio: ['pipe', 'pipe', 'pipe']
    });
    
    // Write model and schema to stdin as JSON strings with UTF-8 encoding
    // Python expects: first line = model JSON, second line = schema JSON
    try {
        const modelJson = JSON.stringify(modelData);
        const schemaJson = JSON.stringify(schema);
        
        // Write both JSON strings as separate lines with newline separators
        pythonProcess.stdin.setDefaultEncoding('utf8');
        pythonProcess.stdin.write(modelJson + '\n');
        pythonProcess.stdin.write(schemaJson + '\n');
        pythonProcess.stdin.end();
        
        logger.log.debug('Model and schema data written to Python stdin');
    } catch (err) {
        logger.log.error(`Failed to write data to Python stdin: ${err.message}`);
        dialog.showErrorBox('Data Error', `Failed to prepare data for Python:\n${err.message}`);
        pythonProcess.kill();
        return;
    }
    
    pythonProcess.stderr.on('data', (data) => {
        logger.log.error(`Python error: ${data.toString()}`);
    });
    
    pythonProcess.on('error', (error) => {
        dialog.showErrorBox('Execution Error', `Failed to start Python process:\n${error.message}`);
    });
}

function openAIThreatsWarning() {
    logger.log.debug('Opening AI Threats Warning dialog');
    
    // If window already exists, focus it instead of creating a new one
    if (aiThreatsWarningWindow && !aiThreatsWarningWindow.isDestroyed()) {
        aiThreatsWarningWindow.focus();
        return;
    }

    // Create the warning window
    aiThreatsWarningWindow = new BrowserWindow({
        width: 620,
        height: 500,
        minWidth: 100,
        minHeight: 100,
        maxWidth: 620,
        maxHeight: 500,
        resizable: true,
        parent: mainWindow,
        modal: true,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        show: false
    });

    // Completely remove the menu bar
    aiThreatsWarningWindow.setMenuBarVisibility(false);

    // Handle IPC messages from the warning window - set up BEFORE loading
    const okHandler = () => {
        logger.log.debug('AI Threats Warning: User clicked OK, proceeding with threat generation');
        if (aiThreatsWarningWindow && !aiThreatsWarningWindow.isDestroyed()) {
            aiThreatsWarningWindow.close();
        }
        // Proceed with threat generation
        proceedWithThreatGeneration();
    };
    ipcMain.on('ai-threats-warning-ok', okHandler);

    // Clean up IPC listeners when window is closed
    aiThreatsWarningWindow.once('closed', () => {
        ipcMain.removeListener('ai-threats-warning-ok', okHandler);
        aiThreatsWarningWindow = null;
    });

    // Load the warning HTML file
    const isDev = process.env.NODE_ENV === 'development';
    if (isDev) {
        aiThreatsWarningWindow.loadURL('http://localhost:8080/ai-threats-warning.html');
    } else {
        aiThreatsWarningWindow.loadURL('app://./ai-threats-warning.html');
    }

    aiThreatsWarningWindow.once('ready-to-show', () => {
        aiThreatsWarningWindow.show();
    });
}

// Get the path to ai-settings.json in user data directory
function getAISettingsPath() {
    const userDataPath = app.getPath('userData');
    return path.join(userDataPath, 'ai-settings.json');
}

// Load API key from credential manager using keytar
async function loadAPIKey() {
    try {
        const keytar = require('keytar');
        const service = 'org.owasp.threatdragon';
        const account = 'ai-api-key';
        
        const apiKey = await keytar.getPassword(service, account);
        return apiKey || '';
    } catch (err) {
        logger.log.warn('Error loading API key from credential manager: ' + err.message);
        if (err.message.includes('Cannot find module')) {
            logger.log.error('keytar module not found. Please install it: npm install keytar');
        }
        return '';
    }
}

// Save API key to credential manager using keytar
async function saveAPIKey(apiKey) {
    try {
        const keytar = require('keytar');
        const service = 'org.owasp.threatdragon';
        const account = 'ai-api-key';
        
        if (apiKey && apiKey.trim() !== '') {
            await keytar.setPassword(service, account, apiKey);
            logger.log.debug('API key saved to credential manager');
            return true;
        } else {
            // If API key is empty, delete it from credential manager
            try {
                await keytar.deletePassword(service, account);
                logger.log.debug('API key removed from credential manager');
            } catch (deleteErr) {
                // Ignore error if password doesn't exist
                logger.log.debug('API key not found in credential manager (already removed)');
            }
            return true;
        }
    } catch (err) {
        logger.log.error('Error saving API key to credential manager: ' + err.message);
        if (err.message.includes('Cannot find module')) {
            logger.log.error('keytar module not found. Please install it: npm install keytar');
        }
        return false;
    }
}

// Load AI settings from file (excluding API key which is stored in credential manager)
async function loadAISettings() {
    const settingsPath = getAISettingsPath();
    let settings = {
        llmModel: '',
        temperature: 0.1,
        responseFormat: false,
        apiBase: '',
        logLevel: 'INFO'
    };
    
    try {
        if (fs.existsSync(settingsPath)) {
            const data = fs.readFileSync(settingsPath, 'utf8');
            const fileSettings = JSON.parse(data);
            // Merge file settings, but exclude apiKey (it's stored in credential manager)
            settings = {
                llmModel: fileSettings.llmModel || '',
                temperature: fileSettings.temperature !== undefined ? fileSettings.temperature : 0.1,
                responseFormat: fileSettings.responseFormat === true,
                apiBase: fileSettings.apiBase || '',
                logLevel: fileSettings.logLevel || 'INFO'
            };
        }
    } catch (err) {
        logger.log.warn('Error loading AI settings: ' + err.message);
    }
    
    // Load API key from credential manager (async)
    settings.apiKey = await loadAPIKey();
    
    return settings;
}

// Save AI settings to file (excluding API key which is stored in credential manager)
async function saveAISettings(settings) {
    const settingsPath = getAISettingsPath();
    
    // Extract API key from settings before saving to JSON
    const apiKey = settings.apiKey || '';
    const settingsWithoutApiKey = {
        llmModel: settings.llmModel || '',
        temperature: settings.temperature !== undefined ? settings.temperature : 0.1,
        responseFormat: settings.responseFormat === true,
        apiBase: settings.apiBase || '',
        logLevel: settings.logLevel || 'INFO'
    };
    
    try {
        // Save non-sensitive settings to JSON file
        fs.writeFileSync(settingsPath, JSON.stringify(settingsWithoutApiKey, null, 2), 'utf8');
        logger.log.debug('AI settings saved to: ' + settingsPath);
        
        // Save API key separately to credential manager (async)
        const apiKeySaved = await saveAPIKey(apiKey);
        if (!apiKeySaved) {
            logger.log.warn('Failed to save API key to credential manager');
            // Continue anyway - other settings were saved successfully
        }
        
        return true;
    } catch (err) {
        logger.log.error('Error saving AI settings: ' + err.message);
        return false;
    }
}

function openAISettings() {
    logger.log.debug('AI Settings clicked');
    
    // If window already exists, focus it instead of creating a new one
    if (aiSettingsWindow && !aiSettingsWindow.isDestroyed()) {
        aiSettingsWindow.focus();
        return;
    }

    // Create the settings window
    aiSettingsWindow = new BrowserWindow({
        width: 620,
        height: 660,
        minWidth: 100,
        minHeight: 100,
        maxWidth: 620,
        maxHeight: 660,
        resizable: true,
        parent: mainWindow,
        modal: true,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        show: false
    });

    // Completely remove the menu bar
    aiSettingsWindow.setMenuBarVisibility(false);

    // Handle IPC messages from the settings window - set up BEFORE loading
    // Load settings request - set up listener for this window instance
    const loadHandler = () => {
        if (aiSettingsWindow && !aiSettingsWindow.isDestroyed()) {
            // Use async IIFE to properly await the async function
            (async () => {
                try {
                    const settings = await loadAISettings();
                    if (aiSettingsWindow && !aiSettingsWindow.isDestroyed()) {
                        aiSettingsWindow.webContents.send('ai-settings-loaded', settings);
                    }
                } catch (err) {
                    logger.log.error('Error loading settings: ' + err.message);
                    if (aiSettingsWindow && !aiSettingsWindow.isDestroyed()) {
                        aiSettingsWindow.webContents.send('ai-settings-loaded', {
                            apiKey: '',
                            llmModel: '',
                            temperature: 0.1,
                            responseFormat: false,
                            apiBase: '',
                            logLevel: 'INFO'
                        });
                    }
                }
            })();
        }
    };
    ipcMain.on('ai-settings-load-request', loadHandler);

    // Save settings request
    const saveHandler = async (event, settings) => {
        if (aiSettingsWindow && !aiSettingsWindow.isDestroyed()) {
            if (await saveAISettings(settings)) {
                aiSettingsWindow.webContents.send('ai-settings-saved');
            } else {
                aiSettingsWindow.webContents.send('ai-settings-save-error', 'Failed to save settings');
            }
        }
    };
    ipcMain.on('ai-settings-save-request', saveHandler);

    // Check for unsaved changes request
    const checkUnsavedChangesHandler = (event) => {
        if (aiSettingsWindow && !aiSettingsWindow.isDestroyed()) {
            // Send request to renderer to check for unsaved changes
            aiSettingsWindow.webContents.send('ai-settings-check-changes');
        }
    };
    ipcMain.on('ai-settings-check-changes-request', checkUnsavedChangesHandler);

    // Close window request (will be called after confirmation)
    const closeHandler = () => {
        if (aiSettingsWindow && !aiSettingsWindow.isDestroyed()) {
            aiSettingsWindow.close();
        }
    };
    ipcMain.on('ai-settings-window-close', closeHandler);

    // Handle window close event to check for unsaved changes (for X button)
    aiSettingsWindow.on('close', (event) => {
        // Prevent default close behavior
        event.preventDefault();
        // Check if there are unsaved changes by asking the renderer
        // The renderer will show the same confirm dialog as the Close button
        aiSettingsWindow.webContents.send('ai-settings-close-check');
        
        // Wait for response from renderer about whether to proceed with close
        const closeResponseHandler = (e, shouldClose) => {
            ipcMain.removeListener('ai-settings-should-close', closeResponseHandler);
            if (shouldClose) {
                // User confirmed to close, destroy the window
                aiSettingsWindow.destroy();
            }
            // If shouldClose is false, user cancelled, so don't close
        };
        ipcMain.once('ai-settings-should-close', closeResponseHandler);
    });

    // Clean up IPC handlers when window is closed
    aiSettingsWindow.once('closed', () => {
        // Remove IPC handlers
        ipcMain.removeListener('ai-settings-load-request', loadHandler);
        ipcMain.removeListener('ai-settings-save-request', saveHandler);
        ipcMain.removeListener('ai-settings-window-close', closeHandler);
        ipcMain.removeListener('ai-settings-check-changes-request', checkUnsavedChangesHandler);
        // Clear window reference
        aiSettingsWindow = null;
    });

    // Load the settings HTML file (after IPC listeners are set up)
    const isDev = process.env.NODE_ENV === 'development';
    if (isDev) {
        aiSettingsWindow.loadURL('http://localhost:8080/ai-settings.html');
    } else {
        // Use app protocol for production (same as main window)
        aiSettingsWindow.loadURL('app://./ai-settings.html');
    }

    // Show window when ready
    aiSettingsWindow.once('ready-to-show', () => {
        aiSettingsWindow.show();
    });
}

export default {
    getMenuTemplate,
    modelClosed,
    modelOpened,
    modelPrint,
    modelSave,
    aiThreatGeneration,
    openModel,
    openModelRequest,
    setLocale,
    setMainWindow
};
