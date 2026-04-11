'use strict';

import { app, dialog } from 'electron';
import path from 'path';
import logger from './logger.js';

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
import ind from '@/i18n/id.js';
import jpn from '@/i18n/ja.js';
import msa from '@/i18n/ms.js';
import por from '@/i18n/pt.js';
import spa from '@/i18n/es.js';
import zho from '@/i18n/zh.js';


const messages = { ara, deu, ell, eng, fin, fra, hin, ind, jpn, msa, por, spa, zho };
const defaultLanguage = 'eng';
var language = defaultLanguage;

// Constants
const CONFIG_FILE = 'templates-path.txt';
const TEMPLATE_INDEX = 'template_info.json';




// get path to config file
function getConfigPath() {
    return path.join(app.getPath('userData'), CONFIG_FILE);
}

// get templates folder path from config file
async function getTemplatesPath() {
    try {
        const data = await fs.promises.readFile(getConfigPath(), 'utf-8');
        return data.trim();
    } catch {
        return null;
    }
}

// check if folder has write access by attempting a test write
// (fs.access W_OK is unreliable on Windows for NTFS ACL permissions)
async function hasWriteAccess(folderPath) {
    const testFile = path.join(folderPath, `.write_test_${Date.now()}`);
    try {
        await fs.promises.writeFile(testFile, '');
        await fs.promises.unlink(testFile);
        return true;
    } catch (err) {
        logger.log.debug('Write access denied for ' + folderPath + ': ' + err.code);
        return false;
    }
}

// check if folder exists
async function folderExists(folderPath) {
    try {
        const stats = await fs.promises.stat(folderPath);
        return stats.isDirectory();
    } catch {
        return false;
    }
}



// get full path to template index file
function getIndexPath(folderPath) {
    return path.join(folderPath, TEMPLATE_INDEX);
}

// check if template index file exists in folder
async function hasTemplateIndex(folderPath) {
    try {
        const indexPath = getIndexPath(folderPath);
        const stats = await fs.promises.stat(indexPath);
        return stats.isFile();
    } catch {
        return false;
    }
}

// Read template metadata from index file, returns null if not initialized
async function listTemplates(basePath) {
    if (!await hasTemplateIndex(basePath)) {
        return null;
    }

    try {
        const indexFilePath = getIndexPath(basePath);
        const data = await fs.promises.readFile(indexFilePath, 'utf-8');
        const parsed = JSON.parse(data);
        return parsed.templates || [];
    } catch (err) {
        logger.log.warn('Error reading template index: ' + err);
        return [];
    }
}

// Creates template index file in the given folder
async function createTemplateIndex(folderPath) {
    const indexPath = path.join(folderPath, TEMPLATE_INDEX);
    await fs.promises.writeFile(indexPath, '{"templates":[]}', 'utf-8');
    logger.log.debug('Created template index at: ' + folderPath);
}

// IPC-callable: bootstrap templates for configured folder
async function bootstrapTemplates() {
    const templatePath = await getTemplatesPath();
    try {
        await createTemplateIndex(templatePath);
        await getTemplates();
        mainWindow.webContents.send('bootstrap-templates-success', messages[language].template.toast.configureSuccess);
    } catch (err) {
        logger.log.error('Error bootstrapping templates: ' + err);
        mainWindow.webContents.send('bootstrap-templates-error', messages[language].template.errors.initializeFailed);
    }
}


//import template file
async function importTemplate(template) {
    const templatePath = await getTemplatesPath();
    const { templateMetadata, model } = template;

    try {
        // Append metadata to index
        const currentTemplates = await listTemplates(templatePath) || [];
        const duplicate = currentTemplates.find(t => t.name === templateMetadata.name);
        if (duplicate) {
            mainWindow.webContents.send('import-template-error', messages[language].template.errors.duplicate);
            return;
        }

        const newTemplates = [...currentTemplates, templateMetadata];
        const indexPath = getIndexPath(templatePath);
        await fs.promises.writeFile(indexPath, JSON.stringify({ templates: newTemplates }, null, 2), 'utf-8');

        // Save model file
        const modelPath = path.join(templatePath, templateMetadata.modelRef + '.json');
        await fs.promises.writeFile(modelPath, JSON.stringify(model, null, 2), 'utf-8');
        mainWindow.webContents.send('import-template-success', messages[language].template.toast.importSuccess);

        // Refresh template list (sends updated list to frontend)
        await getTemplates();

        logger.log.debug('Template imported: ' + templateMetadata.name);
    } catch (err) {
        logger.log.error('Error importing template: ' + err);
        mainWindow.webContents.send('import-template-error', messages[language].template.errors.importFailed);
    }
}

async function fetchModelById(templateId) {
    const templatePath = await getTemplatesPath();
    try {
        const templates = await listTemplates(templatePath);
        const template = templates.find(t => t.id === templateId);
        const modelPath = path.join(templatePath, template.modelRef + '.json');
        const modelData = await fs.promises.readFile(modelPath, 'utf-8');
        mainWindow.webContents.send('fetch-model-by-id-result', {
            model: JSON.parse(modelData)
        });
    } catch (err) {
        logger.log.error('Error fetching model by ID: ' + err);
    }
}

async function exportTemplate(data, filename) {
    const dialogOptions = {
        title: messages[language].template.exportTemplate,
        defaultPath: filename,
        filters: [{ name: 'Template', extensions: ['json'] }]
    };

    try {
        const result = await dialog.showSaveDialog(mainWindow, dialogOptions);
        if (result.canceled) {
            logger.log.debug('Export template canceled');
            return;
        }

        await fs.promises.writeFile(result.filePath, JSON.stringify(data, null, 2), 'utf-8');
        mainWindow.webContents.send('export-template-success', messages[language].template.toast.exportSuccess);
        logger.log.debug('Template exported: ' + result.filePath);
    } catch (err) {
        logger.log.error('Error exporting template: ' + err);
        mainWindow.webContents.send('export-template-error', messages[language].template.errors.exportFailed);
    }
}





// Helper: save path to config and bootstrap if needed
async function savePathToConfig(folderPath) {
    await fs.promises.writeFile(getConfigPath(), folderPath, 'utf-8');
    logger.log.debug('Template folder path saved: ' + folderPath);
}

// Helper: validate folder, save path, and bootstrap if needed
async function saveAndBootstrap(folderPath) {
    try {
        // Check write access
        const canWrite = await hasWriteAccess(folderPath);
        if (!canWrite) {
            mainWindow.webContents.send('set-template-folder-error', messages[language].template.errors.noWriteAccess);
            return;
        }

        // Save path to config
        await savePathToConfig(folderPath);

        // Create template index if it doesn't exist
        if (!await hasTemplateIndex(folderPath)) {
            await createTemplateIndex(folderPath);
        }

        // Refresh template list
        await getTemplates();

        mainWindow.webContents.send('set-template-folder-success', messages[language].template.toast.configureSuccess);
    } catch (err) {
        logger.log.error('Error setting up template folder: ' + err);
        mainWindow.webContents.send('set-template-folder-error', messages[language].template.errors.setupFailed);
    }
}

// Set template folder to default location (userData/templates)
async function setTemplateFolderDefault() {
    logger.log.debug('Setting template folder to default location');
    const defaultPath = path.join(app.getPath('userData'), 'templates');
    await fs.promises.mkdir(defaultPath, { recursive: true });
    await saveAndBootstrap(defaultPath);
}

// Set template folder to custom location (user picks folder)
async function setTemplateFolderCustom() {
    logger.log.debug('Setting template folder to custom location');
    try {
        const result = await dialog.showOpenDialog(mainWindow, {
            title: messages[language].template.actions.selectFolder,
            properties: ['openDirectory'],
            defaultPath: app.getPath('documents')
        });

        if (result.canceled) {
            logger.log.debug('Custom folder selection canceled');
            return;
        }

        await saveAndBootstrap(result.filePaths[0]);
    } catch (err) {
        logger.log.error('Error selecting custom folder: ' + err);
        mainWindow.webContents.send('set-template-folder-error', messages[language].template.errors.setupFailed);
    }
}

// Set template folder to existing location (must have template_info.json)
async function setTemplateFolderExisting() {
    logger.log.debug('Selecting existing template folder');
    try {
        const result = await dialog.showOpenDialog(mainWindow, {
            title: messages[language].template.actions.selectFolder,
            properties: ['openDirectory'],
            defaultPath: app.getPath('documents')
        });

        if (result.canceled) {
            logger.log.debug('Existing folder selection canceled');
            return;
        }

        const selectedPath = result.filePaths[0];

        // Validate folder has template_info.json
        if (await hasTemplateIndex(selectedPath)) {
            await savePathToConfig(selectedPath);
            await getTemplates();
            mainWindow.webContents.send('set-template-folder-success', messages[language].template.toast.configureSuccess);
        } else {
            mainWindow.webContents.send('set-template-folder-error', messages[language].template.errors.folderInvalid);
        }
    } catch (err) {
        logger.log.error('Error selecting existing folder: ' + err);
        mainWindow.webContents.send('set-template-folder-error', messages[language].template.errors.setupFailed);
    }
}


// pipeline function to get templates and send state to renderer
async function getTemplates() {
    // check if there is a templates path configured
    const templatePath = await getTemplatesPath();
    if (!templatePath) {
        mainWindow.webContents.send('templates-result', {
            status: 'NOT_CONFIGURED',
            templates: []
        });
        return;
    }

    // check if that folder exists
    const exists = await folderExists(templatePath);
    if (!exists) {
        mainWindow.webContents.send('templates-result', {
            status: 'NOT_FOUND',
            templates: []
        });
        return;
    }

    // check if folder has write access
    const canWrite = await hasWriteAccess(templatePath);
    logger.log.debug('getTemplates - canWrite result:', canWrite, 'for path:', templatePath);

    // Read template metadata from index file
    const templates = await listTemplates(templatePath);
    if (templates === null) {
        mainWindow.webContents.send('templates-result', {
            status: 'NOT_INITIALIZED',
            canWrite: canWrite,
            templates: []
        });
        return;
    }


    mainWindow.webContents.send('templates-result', {
        canWrite: canWrite,
        templates: templates
    });
}

async function deleteTemplate(templateId) {
    const templatePath = await getTemplatesPath();
    try {
        const templates = await listTemplates(templatePath);
        const newTemplates = templates.filter(t => t.id !== templateId);
        const indexPath = getIndexPath(templatePath);
        await fs.promises.writeFile(indexPath, JSON.stringify({ templates: newTemplates }, null, 2), 'utf-8');
        // Also delete the model file
        const modelPath = path.join(templatePath, templates.find(t => t.id === templateId).modelRef + '.json');
        await fs.promises.unlink(modelPath);
        mainWindow.webContents.send('delete-template-success', messages[language].template.toast.deleteSuccess);
        // Refresh template list (sends updated list to frontend)
        await getTemplates();
        logger.log.debug('Template deleted: ' + templateId);
    } catch (err) {
        logger.log.error('Error deleting template: ' + err);
        mainWindow.webContents.send('delete-template-error', messages[language].template.errors.deleteFailed);
    }
}

async function updateTemplate(templateMetadata) {
    const templatePath = await getTemplatesPath();
    try {
        const templates = await listTemplates(templatePath);
        const templateIndex = templates.findIndex(t => t.id === templateMetadata.id);
        if (templateIndex === -1) {
            throw new Error('Template not found');
        }
        // Update metadata in index
        templates[templateIndex] = {
            ...templates[templateIndex],
            name: templateMetadata.name,
            description: templateMetadata.description,
            tags: templateMetadata.tags
        };
        const indexPath = getIndexPath(templatePath);
        await fs.promises.writeFile(indexPath, JSON.stringify({ templates }, null, 2), 'utf-8');
        mainWindow.webContents.send('update-template-success', messages[language].template.toast.updateSuccess);
        // Refresh template list
        await getTemplates();
        logger.log.debug('Template updated: ' + templateMetadata.id);
    } catch (err) {
        logger.log.error('Error updating template: ' + err);
        mainWindow.webContents.send('update-template-error', messages[language].template.errors.updateFailed);
    }
}

const setMainWindow = (window) => {
    mainWindow = window;
};

const setLocale = (locale) => {
    const languages = ['ara', 'deu', 'ell', 'eng', 'fin', 'fra', 'hin', 'ind', 'jpn', 'msa', 'por', 'spa', 'zho'];
    language = languages.includes(locale) ? locale : defaultLanguage;
};

export default {
    setMainWindow,
    setLocale,
    setTemplateFolderDefault,
    setTemplateFolderCustom,
    setTemplateFolderExisting,
    getTemplates,
    bootstrapTemplates,
    importTemplate,
    fetchModelById,
    exportTemplate,
    deleteTemplate,
    updateTemplate
};
