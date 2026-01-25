'use strict';

import { app, dialog, BrowserWindow } from 'electron';
import path from 'path';
import logger from './logger.js';
import { isMacOS } from './utils.js';

const { shell, ipcMain } = require('electron');
const fs = require('fs');
const { spawn, execSync } = require('child_process');
const buildVersion = require('../../package.json').version;

// provided by electron server bootstrap
var mainWindow;
var aiSettingsWindow = null;
var aiThreatsWarningWindow = null;
var aiThreatsProgressWindow = null;
var aiThreatsResultsWindow = null;
var aiPythonRequiredWindow = null;
var aiSafeStorageWarningWindow = null;
var currentPythonProcess = null;
var isPythonProcessCancelled = false;

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
export const aiThreatGeneration = async (modelData) => {
    await runPythonThreatGeneration(modelData);
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
    
    // Check if Python is installed before proceeding
    if (!isPythonInstalled()) {
        logger.log.warn('Python is not installed - showing Python Required dialog');
        showPythonRequiredDialog();
        return;
    }
    
    openAIThreatsWarning();
}

/**
 * Check if Python is installed by trying to execute it
 * Returns true if Python can be executed, false otherwise
 */
function isPythonInstalled() {
    const pythonExe = getPythonExecutable();
    try {
        // Try to execute Python with --version to check if it's available
        execSync(`"${pythonExe}" --version`, { stdio: 'ignore' });
        return true;
    } catch {
        return false;
    }
}

function getPythonExecutable() {
    const isWindows = process.platform === 'win32';
    const baseDir = app.isPackaged 
        ? process.resourcesPath 
        : path.dirname(require.resolve('../../package.json'));
    
    if (isWindows) {
        return path.join(baseDir, 'python-embedded', 'python.exe');
    }
    return path.join(baseDir, 'venv', 'bin', 'python');
}

/**
 * Show Python Required dialog when Python is not found
 */
function showPythonRequiredDialog() {
    logger.log.debug('Opening Python Required dialog');
    
    if (aiPythonRequiredWindow && !aiPythonRequiredWindow.isDestroyed()) {
        aiPythonRequiredWindow.focus();
        return;
    }

    aiPythonRequiredWindow = new BrowserWindow({
        width: 450,
        height: 350,
        resizable: false,
        parent: mainWindow,
        modal: true,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: getPreloadPath()
        },
        show: false
    });

    aiPythonRequiredWindow.setMenuBarVisibility(false);

    const closeHandler = (event) => {
        if (event.sender === aiPythonRequiredWindow.webContents) {
            aiPythonRequiredWindow.close();
        }
    };
    ipcMain.on('ai-window-close', closeHandler);

    aiPythonRequiredWindow.once('closed', () => {
        ipcMain.removeListener('ai-window-close', closeHandler);
        aiPythonRequiredWindow = null;
    });

    const isDev = process.env.NODE_ENV === 'development';
    if (isDev) {
        aiPythonRequiredWindow.loadURL('http://localhost:8080/ai-python-required.html');
    } else {
        aiPythonRequiredWindow.loadURL('app://./ai-python-required.html');
    }

    aiPythonRequiredWindow.once('ready-to-show', () => {
        aiPythonRequiredWindow.show();
    });
}

function getMainPyPath() {
    let aiToolsPath;
    
    if (app.isPackaged) {
        // In production build, extraResources are in process.resourcesPath
        aiToolsPath = path.join(process.resourcesPath, 'ai-tools', 'src', 'main.py');
    } else {
        // In development, use relative path from package.json
        const packageJsonPath = require.resolve('../../package.json');
        const tdVuePath = path.dirname(packageJsonPath);
        aiToolsPath = path.join(tdVuePath, 'ai-tools', 'src', 'main.py');
    }
    
    return path.resolve(aiToolsPath);
}

function getPreloadPath() {
    // __static is provided by vue-cli-plugin-electron-builder
    if (typeof __static !== 'undefined') {
        return path.join(__static, 'preload-ai.js');
    }
    
    // Fallback for development
    if (app.isPackaged) {
        // In production, preload is in the app resources
        return path.join(process.resourcesPath, 'preload-ai.js');
    } else {
        // In development, use relative path
        const packageJsonPath = require.resolve('../../package.json');
        const tdVuePath = path.dirname(packageJsonPath);
        return path.join(tdVuePath, 'public', 'preload-ai.js');
    }
}

function proceedWithThreatGeneration() {
    if (model.isOpen === false) {
        mainWindow.webContents.send('save-model-failed', '', messages[language].threatmodel.warnings.noModelOpen);
        return;
    }
    logger.log.debug('Requesting model data from renderer for AI threat generation');
    mainWindow.webContents.send('ai-threat-generation-request');
}

async function runPythonThreatGeneration(modelData) {
    const pythonExecutable = getPythonExecutable();
    const mainPyPath = getMainPyPath();
    
    // Note: We don't pre-check if Python exists - we let it fail and handle the error
    // This provides a better user experience with the Python Required dialog
    
    if (!fs.existsSync(mainPyPath)) {
        dialog.showErrorBox('Script Not Found', `main.py not found at:\n${mainPyPath}`);
        return;
    }
    
    // Load API key from credential manager
    let apiKey;
    try {
        apiKey = await loadAPIKey();
        if (!apiKey || apiKey.trim() === '') {
            dialog.showErrorBox('API Key Not Found', 'API key not found. Please set it in AI Settings.');
            return;
        }
    } catch (err) {
        logger.log.error(`Failed to load API key: ${err.message}`);
        dialog.showErrorBox('API Key Error', `Failed to load API key:\n${err.message}`);
        return;
    }
    
    // Load schema JSON - use fs.readFileSync for npm build compatibility
    let schema;
    try {
        let schemaPath;
        if (app.isPackaged) {
            // In production build, try to resolve from app path
            // Schema should be accessible via require.resolve or in resources
            const appPath = app.getAppPath();
            schemaPath = path.join(appPath, 'src', 'assets', 'schema', 'threat-dragon-v2.schema.json');
            // If not found, try resources path (if schema was included as extraResource)
            if (!fs.existsSync(schemaPath)) {
                schemaPath = path.join(process.resourcesPath, 'src', 'assets', 'schema', 'threat-dragon-v2.schema.json');
            }
        } else {
            // In development, use relative path from package.json
            const packageJsonPath = require.resolve('../../package.json');
            const tdVuePath = path.dirname(packageJsonPath);
            schemaPath = path.join(tdVuePath, 'src', 'assets', 'schema', 'threat-dragon-v2.schema.json');
        }
        
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
    
    // Open progress window before starting Python process
    openAIThreatsProgress();
    
    // Reset cancellation flag
    isPythonProcessCancelled = false;
    
    const pythonProcess = spawn(pythonExecutable, args, {
        cwd: path.dirname(mainPyPath),
        stdio: ['pipe', 'pipe', 'pipe']
    });
    
    // Store process globally for cancellation handling
    currentPythonProcess = pythonProcess;
    
    // Write API key, model and schema to stdin
    // API key first, then model JSON, then schema JSON
    try {
        const modelJson = JSON.stringify(modelData);
        const schemaJson = JSON.stringify(schema);
        
        pythonProcess.stdin.setDefaultEncoding('utf8');
        // Write API key first (never log this)
        pythonProcess.stdin.write(apiKey + '\n');
        pythonProcess.stdin.write(modelJson + '\n');
        pythonProcess.stdin.write(schemaJson + '\n');
        pythonProcess.stdin.end();
        
        logger.log.debug('API key, model and schema data written to Python stdin');
    } catch (err) {
        logger.log.error(`Failed to write data to Python stdin: ${err.message}`);
        closeAIThreatsProgress();
        dialog.showErrorBox('Data Error', `Failed to prepare data for Python:\n${err.message}`);
        pythonProcess.kill();
        currentPythonProcess = null;
        return;
    }
    
    // Collect stdout data
    let stdoutData = '';
    let stderrData = '';
    
    pythonProcess.stdout.on('data', (data) => {
        stdoutData += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
        const errorText = data.toString();
        stderrData += errorText;
       logger.log.debug(`Python stderr: ${errorText}`);
    });
    
    pythonProcess.on('error', (error) => {
        closeAIThreatsProgress();
        currentPythonProcess = null;
        
        // Check if this is a "file not found" error (Python not installed/available)
        if (error.code === 'ENOENT') {
            logger.log.warn('Python executable not found - showing Python Required dialog');
            showPythonRequiredDialog();
        } else {
            dialog.showErrorBox('Execution Error', `Failed to start Python process:\n${error.message}`);
        }
    });
    
    pythonProcess.on('close', (code) => {
        currentPythonProcess = null;
        
        if (isPythonProcessCancelled) {
            logger.log.debug('Python process was cancelled by user');
            return;
        }
        
        if (code !== 0) {
            logger.log.error(`Python process exited with code ${code}`);
            if (stderrData) {
                logger.log.error(`Python stderr output: ${stderrData}`);
            }
            
            closeAIThreatsProgress();
            
            // Extract error message from stderr or stdout
            let errorMessage = `The AI threat generation process failed with exit code ${code}.`;
            const allOutput = (stderrData || '') + '\n' + (stdoutData || '');
            const errorMatch = allOutput.match(/ERROR:[^\n]*/);
            if (errorMatch) {
                const fullError = errorMatch[0].replace(/^ERROR:\s*/, '').trim();
                if (fullError) {
                    errorMessage = fullError;
                }
            } else if (stderrData) {
                const stderrLines = stderrData.trim().split('\n').filter(line => line.trim());
                if (stderrLines.length > 0) {
                    errorMessage = stderrLines[stderrLines.length - 1];
                }
            }
            
            dialog.showErrorBox('AI Threat Generation Failed', errorMessage);
            return;
        }
        
        // Process completed successfully - parse the output
        try {
            // Extract JSON between JSON_START and JSON_END markers
            const jsonStartIndex = stdoutData.indexOf('<<JSON_START>>');
            const jsonEndIndex = stdoutData.indexOf('<<JSON_END>>');
            
            if (jsonStartIndex === -1 || jsonEndIndex === -1) {
                throw new Error('Could not find JSON markers in Python output');
            }
            
            const jsonString = stdoutData.substring(
                jsonStartIndex + '<<JSON_START>>'.length,
                jsonEndIndex
            ).trim();
            
            const updatedModel = JSON.parse(jsonString);
            logger.log.debug('Successfully parsed updated model from Python output');
            
            // Extract metadata (cost and validation info) if available
            let metadata = null;
            const metadataStartIndex = stdoutData.indexOf('<<METADATA_START>>');
            const metadataEndIndex = stdoutData.indexOf('<<METADATA_END>>');
            
            if (metadataStartIndex !== -1 && metadataEndIndex !== -1) {
                const metadataString = stdoutData.substring(
                    metadataStartIndex + '<<METADATA_START>>'.length,
                    metadataEndIndex
                ).trim();
                try {
                    metadata = JSON.parse(metadataString);
                    logger.log.debug('Successfully parsed metadata from Python output');
                } catch (metadataErr) {
                    logger.log.warn(`Failed to parse metadata: ${metadataErr.message}`);
                }
            }
            
            closeAIThreatsProgress();
            mainWindow.webContents.send('ai-threat-generation-complete', updatedModel);
            
            if (metadata) {
                openAIThreatsResults(metadata);
            }
            
        } catch (err) {
            logger.log.error(`Failed to parse Python output: ${err.message}`);
            logger.log.error(`Python stdout: ${stdoutData}`);
            closeAIThreatsProgress();
            dialog.showErrorBox('Parse Error', 
                `Failed to parse the updated model from Python output:\n${err.message}\n\n` +
                `Check the logs for more details.`);
        }
    });
}

function openAIThreatsWarning() {
    logger.log.debug('Opening AI Threats Warning dialog');
    
    if (aiThreatsWarningWindow && !aiThreatsWarningWindow.isDestroyed()) {
        aiThreatsWarningWindow.focus();
        return;
    }

    aiThreatsWarningWindow = new BrowserWindow({
        width: 620,
        height: 560,
        minWidth: 100,
        minHeight: 100,
        maxWidth: 620,
        maxHeight: 560,
        resizable: true,
        parent: mainWindow,
        modal: true,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: getPreloadPath()
        },
        show: false
    });

    aiThreatsWarningWindow.setMenuBarVisibility(false);

    const okHandler = (event) => {
        // Verify sender is the warning window
        if (event.sender !== aiThreatsWarningWindow.webContents) {
            return;
        }
        logger.log.debug('AI Threats Warning: User clicked OK, proceeding with threat generation');
        if (aiThreatsWarningWindow && !aiThreatsWarningWindow.isDestroyed()) {
            aiThreatsWarningWindow.close();
        }
        proceedWithThreatGeneration();
    };
    ipcMain.on('ai-threats-warning-ok', okHandler);
    
    const closeHandler = (event) => {
        if (event.sender === aiThreatsWarningWindow.webContents) {
            aiThreatsWarningWindow.close();
        }
    };
    ipcMain.on('ai-window-close', closeHandler);

    aiThreatsWarningWindow.once('closed', () => {
        ipcMain.removeListener('ai-threats-warning-ok', okHandler);
        ipcMain.removeListener('ai-window-close', closeHandler);
        aiThreatsWarningWindow = null;
    });

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

function openAIThreatsProgress() {
    logger.log.debug('Opening AI Threats Progress dialog');
    
    if (aiThreatsProgressWindow && !aiThreatsProgressWindow.isDestroyed()) {
        aiThreatsProgressWindow.focus();
        return;
    }

    aiThreatsProgressWindow = new BrowserWindow({
        width: 600,
        height: 450,
        resizable: false,
        parent: mainWindow,
        modal: true,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: getPreloadPath()
        },
        show: false
    });

    aiThreatsProgressWindow.setMenuBarVisibility(false);

    // Handle window close event with confirmation
    aiThreatsProgressWindow.on('close', (event) => {
        if (currentPythonProcess && !currentPythonProcess.killed) {
            event.preventDefault();
            
            const response = dialog.showMessageBoxSync(aiThreatsProgressWindow, {
                type: 'question',
                buttons: ['Yes', 'No'],
                defaultId: 1,
                cancelId: 1,
                title: 'Confirm Cancel',
                message: 'Are you sure?',
                detail: 'The threat generation process is still running. Do you want to cancel it?'
            });
            
            if (response === 0) {
                logger.log.debug('User confirmed cancellation, killing Python process');
                isPythonProcessCancelled = true;
                const processToKill = currentPythonProcess;
                
                try {
                    processToKill.kill('SIGINT');
                    logger.log.debug('Python process sent SIGINT signal');
                    
                    // Force kill after 5 seconds if still running
                    const forceKillTimeout = setTimeout(() => {
                        if (processToKill && !processToKill.killed) {
                            try {
                                logger.log.debug('Process still running after 5 seconds, sending SIGKILL');
                                processToKill.kill('SIGKILL');
                            } catch (killErr) {
                                logger.log.error(`Error force killing Python process with SIGKILL: ${killErr.message}`);
                            }
                        }
                    }, 5000);
                    
                    processToKill.once('close', () => {
                        clearTimeout(forceKillTimeout);
                        logger.log.debug('Python process exited, cleared force kill timeout');
                    });
                    
                } catch (err) {
                    logger.log.error(`Error sending SIGINT to Python process: ${err.message}`);
                    try {
                        processToKill.kill('SIGKILL');
                        logger.log.debug('Python process force killed with SIGKILL after SIGINT failed');
                    } catch (killErr) {
                        logger.log.error(`Error force killing Python process: ${killErr.message}`);
                    }
                }
                
                currentPythonProcess = null;
                aiThreatsProgressWindow.destroy();
            }
        }
    });

    const closeProgressHandler = (event) => {
        if (event.sender === aiThreatsProgressWindow.webContents) {
            aiThreatsProgressWindow.close();
        }
    };
    ipcMain.on('ai-window-close', closeProgressHandler);

    aiThreatsProgressWindow.once('closed', () => {
        ipcMain.removeListener('ai-window-close', closeProgressHandler);
        aiThreatsProgressWindow = null;
    });

    const isDev = process.env.NODE_ENV === 'development';
    if (isDev) {
        aiThreatsProgressWindow.loadURL('http://localhost:8080/ai-threats-progress.html');
    } else {
        aiThreatsProgressWindow.loadURL('app://./ai-threats-progress.html');
    }

    aiThreatsProgressWindow.once('ready-to-show', () => {
        aiThreatsProgressWindow.show();
        // Load and send configuration to the progress window
        (async () => {
            try {
                const settings = await loadAISettings();
                if (aiThreatsProgressWindow && !aiThreatsProgressWindow.isDestroyed()) {
                    aiThreatsProgressWindow.webContents.send('ai-threats-progress-config', {
                        llmModel: settings.llmModel || '',
                        temperature: settings.temperature !== undefined ? settings.temperature : 0.1,
                        responseFormat: settings.responseFormat === true,
                        apiBase: settings.apiBase || '',
                        logLevel: settings.logLevel || 'INFO'
                    });
                }
            } catch (err) {
                logger.log.error(`Error loading settings for progress window: ${err.message}`);
            }
        })();
    });
}

function closeAIThreatsProgress() {
    if (aiThreatsProgressWindow && !aiThreatsProgressWindow.isDestroyed()) {
        aiThreatsProgressWindow.close();
        aiThreatsProgressWindow = null;
    }
}

function openAIThreatsResults(metadata) {
    logger.log.debug('Opening AI Threats Results dialog');
    
    if (aiThreatsResultsWindow && !aiThreatsResultsWindow.isDestroyed()) {
        aiThreatsResultsWindow.focus();
        return;
    }

    aiThreatsResultsWindow = new BrowserWindow({
        width: 600,
        height: 600,
        minWidth: 500,
        minHeight: 400,
        maxWidth: 800,
        maxHeight: 600,
        resizable: true,
        parent: mainWindow,
        modal: true,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: getPreloadPath()
        },
        show: false
    });

    aiThreatsResultsWindow.setMenuBarVisibility(false);

    const closeResultsHandler = (event) => {
        if (event.sender === aiThreatsResultsWindow.webContents) {
            aiThreatsResultsWindow.close();
        }
    };
    ipcMain.on('ai-window-close', closeResultsHandler);

    aiThreatsResultsWindow.once('closed', () => {
        ipcMain.removeListener('ai-window-close', closeResultsHandler);
        aiThreatsResultsWindow = null;
    });

    const isDev = process.env.NODE_ENV === 'development';
    if (isDev) {
        aiThreatsResultsWindow.loadURL('http://localhost:8080/ai-threats-results.html');
    } else {
        aiThreatsResultsWindow.loadURL('app://./ai-threats-results.html');
    }

    aiThreatsResultsWindow.once('ready-to-show', () => {
        aiThreatsResultsWindow.show();
        aiThreatsResultsWindow.webContents.send('ai-threats-results-data', metadata);
    });
}

// Get the path to ai-settings.json in user data directory
function getAISettingsPath() {
    const userDataPath = app.getPath('userData');
    return path.join(userDataPath, 'ai-settings.json');
}

// Get the path to the encrypted API key file
function getAPIKeyPath() {
    const userDataPath = app.getPath('userData');
    return path.join(userDataPath, '.api-key.enc');
}

// Load API key using Electron's safeStorage API
async function loadAPIKey() {
    try {
        const { safeStorage } = require('electron');
        const keyPath = getAPIKeyPath();
        
        if (!fs.existsSync(keyPath)) {
            return '';
        }
        
        if (!safeStorage.isEncryptionAvailable()) {
            logger.log.warn('Encryption is not available on this system');
            return '';
        }
        
        const encryptedData = fs.readFileSync(keyPath);
        const apiKey = safeStorage.decryptString(encryptedData);
        return apiKey || '';
    } catch (err) {
        logger.log.warn('Error loading API key: ' + err.message);
        return '';
    }
}

function openSafeStorageWarning() {
    logger.log.debug('Opening safeStorage warning window');
    
    if (aiSafeStorageWarningWindow && !aiSafeStorageWarningWindow.isDestroyed()) {
        aiSafeStorageWarningWindow.focus();
        return;
    }

    aiSafeStorageWarningWindow = new BrowserWindow({
        width: 600,
        height: 500,
        minWidth: 500,
        minHeight: 400,
        resizable: true,
        parent: mainWindow,
        modal: true,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: getPreloadPath()
        },
        show: false
    });

    aiSafeStorageWarningWindow.setMenuBarVisibility(false);

    const closeHandler = (event) => {
        if (event.sender === aiSafeStorageWarningWindow.webContents) {
            aiSafeStorageWarningWindow.close();
        }
    };
    ipcMain.on('ai-window-close', closeHandler);

    const snapStatusHandler = (event) => {
        if (event.sender === aiSafeStorageWarningWindow.webContents) {
            const isSnap = !!process.env.SNAP || !!process.env.SNAP_NAME;
            const platform = process.platform;
            event.returnValue = { isSnap, platform };
        }
    };
    ipcMain.on('ai-safestorage-get-snap-status', snapStatusHandler);

    aiSafeStorageWarningWindow.once('closed', () => {
        ipcMain.removeListener('ai-window-close', closeHandler);
        ipcMain.removeListener('ai-safestorage-get-snap-status', snapStatusHandler);
        aiSafeStorageWarningWindow = null;
    });

    const isDev = process.env.NODE_ENV === 'development';
    if (isDev) {
        aiSafeStorageWarningWindow.loadURL('http://localhost:8080/ai-safestorage-warning.html');
    } else {
        aiSafeStorageWarningWindow.loadURL('app://./ai-safestorage-warning.html');
    }

    aiSafeStorageWarningWindow.once('ready-to-show', () => {
        aiSafeStorageWarningWindow.show();
    });
}

// Save API key using Electron's safeStorage API
async function saveAPIKey(apiKey) {
    try {
        const { safeStorage } = require('electron');
        const keyPath = getAPIKeyPath();
        
        if (apiKey && apiKey.trim() !== '') {
            if (!safeStorage.isEncryptionAvailable()) {
                logger.log.error('Encryption is not available on this system');
                openSafeStorageWarning();
                return false;
            }
            
            const encryptedData = safeStorage.encryptString(apiKey);
            fs.writeFileSync(keyPath, encryptedData);
            logger.log.debug('API key saved securely');
            return true;
        } else {
            // If API key is empty, delete the encrypted file
            try {
                if (fs.existsSync(keyPath)) {
                    fs.unlinkSync(keyPath);
                    logger.log.debug('API key removed');
                }
            } catch (deleteErr) {
                logger.log.debug('API key file not found (already removed)');
            }
            return true;
        }
    } catch (err) {
        logger.log.error('Error saving API key: ' + err.message);
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
        logLevel: 'INFO',
        timeout: 900
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
                logLevel: fileSettings.logLevel || 'INFO',
                timeout: fileSettings.timeout !== undefined ? fileSettings.timeout : 900
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
        logLevel: settings.logLevel || 'INFO',
        timeout: settings.timeout !== undefined ? settings.timeout : 900
    };
    
    try {
        // Save non-sensitive settings to JSON file
        fs.writeFileSync(settingsPath, JSON.stringify(settingsWithoutApiKey, null, 2), 'utf8');
        logger.log.debug('AI settings saved to: ' + settingsPath);
        
        // Save API key separately to credential manager (async)
        const apiKeySaved = await saveAPIKey(apiKey);
        if (!apiKeySaved && apiKey && apiKey.trim() !== '') {
            logger.log.warn('Failed to save API key to credential manager');
            return { success: true, hasWarning: true };
        }
        
        return { success: true, hasWarning: false };
    } catch (err) {
        logger.log.error('Error saving AI settings: ' + err.message);
        return { success: false, hasWarning: false };
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
        height: 730,
        minWidth: 100,
        minHeight: 100,
        maxWidth: 620,
        maxHeight: 730,
        resizable: true,
        parent: mainWindow,
        modal: true,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: getPreloadPath()
        },
        show: false
    });

    // Preventing the X-button close confirmation when the renderer has already shown the "unsaved changes" confirm
    let allowCloseWithoutPrompt = false;

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
            const result = await saveAISettings(settings);
            if (result.success) {
                if (result.hasWarning) {
                    aiSettingsWindow.webContents.send('ai-settings-saved-with-warning');
                } else {
                    aiSettingsWindow.webContents.send('ai-settings-saved');
                }
            } else {
                aiSettingsWindow.webContents.send('ai-settings-save-error', 'Failed to save settings');
            }
        }
    };
    ipcMain.on('ai-settings-save-request', saveHandler);

    // Check for unsaved changes request
    const checkUnsavedChangesHandler = () => {
        if (aiSettingsWindow && !aiSettingsWindow.isDestroyed()) {
            // Send request to renderer to check for unsaved changes
            aiSettingsWindow.webContents.send('ai-settings-check-changes');
        }
    };
    ipcMain.on('ai-settings-check-changes-request', checkUnsavedChangesHandler);

    // Close window request (will be called after confirmation)
    const closeHandler = (event) => {
        // Verify sender is the settings window
        if (event.sender !== aiSettingsWindow.webContents) {
            return;
        }
        if (aiSettingsWindow && !aiSettingsWindow.isDestroyed()) {
            allowCloseWithoutPrompt = true;
            aiSettingsWindow.close();
        }
    };
    ipcMain.on('ai-settings-window-close', closeHandler);
    
    const closeWindowHandler = (event) => {
        if (event.sender === aiSettingsWindow.webContents) {
            allowCloseWithoutPrompt = true;
            aiSettingsWindow.close();
        }
    };
    ipcMain.on('ai-window-close', closeWindowHandler);

    // Handle window close event to check for unsaved changes (for X button)
    aiSettingsWindow.on('close', (event) => {
        if (allowCloseWithoutPrompt) {
            allowCloseWithoutPrompt = false;
            return;
        }
        // Prevent default close behavior
        event.preventDefault();
        // Check if there are unsaved changes by asking the renderer
        // The renderer will show the same confirm dialog as the Close button
        aiSettingsWindow.webContents.send('ai-settings-close-check');
        
        // Wait for response from renderer about whether to proceed with close
        const closeResponseHandler = (e, shouldClose) => {
            ipcMain.removeListener('ai-settings-should-close', closeResponseHandler);
            if (shouldClose) {
                // User confirmed to close, close window without prompting again
                allowCloseWithoutPrompt = true;
                aiSettingsWindow.close();
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
        ipcMain.removeListener('ai-window-close', closeWindowHandler);
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
