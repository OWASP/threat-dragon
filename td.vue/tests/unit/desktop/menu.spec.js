jest.mock('electron', () => require('./helpers/mockElectron').getElectronMock());
jest.mock('@/desktop/logger.js', () => require('./helpers/mockLogger'));
jest.mock('@/desktop/utils.js', () => require('./helpers/mockUtils').getUtilsMock());
jest.mock('fs', () => require('./helpers/mockFs'));

import { utils } from './helpers/mockUtils.js';
import menu, { model } from '@/desktop/menu.js';
import ara from '@/i18n/ar.js';
import deu from '@/i18n/de.js';
import ell from '@/i18n/el.js';
import eng from '@/i18n/en.js';
import fin from '@/i18n/fi.js';
import fra from '@/i18n/fr.js';
import hin from '@/i18n/hi.js';
import ind from '@/i18n/id.js';
import msa from '@/i18n/ms.js';
import por from '@/i18n/pt.js';
import bra from '@/i18n/pt-br.js';
import rus from '@/i18n/ru.js';
import spa from '@/i18n/es.js';
import ukr from '@/i18n/uk.js';
import zho from '@/i18n/zh.js';

describe('desktop/menu.js', () => {

    beforeEach(() => {
        utils.isMacOS = false;
    });

    describe('Desktop menu', () => {

        const menuItems = menu.getMenuTemplate();

        describe('when isMacOS', () => {

            beforeEach(() => {
                utils.isMacOS = true;
            });

            it('includes recent documents in File menu', () => {
                const template = menu.getMenuTemplate();
                const fileMenu = template.find((item) => item.label === 'File');
                const recentItem = fileMenu.submenu.find((item) => item.role === 'recentdocuments');
                expect(recentItem).toBeDefined();
            });
        });

        it('returns a dropdown menu', () => {
            // the actual length of the menu system is platform dependent
            expect(menuItems.length).toBeGreaterThanOrEqual(5);
        });

        it('contains the Edit menu', () => {
            const editMenu = {'role': 'editMenu'};
            expect(menuItems).toContainEqual(editMenu);
        });

        it('contains the View menu', () => {
            const viewMenu = {'role': 'viewMenu'};
            expect(menuItems).toContainEqual(viewMenu);
        });

        it('contains the Window menu', () => {
            const windowMenu = {'role': 'windowMenu'};
            expect(menuItems).toContainEqual(windowMenu);
        });

    });

    describe('Desktop File menu', () => {

        const fileItems = menu.getMenuTemplate().find((item) => item.label === 'File');

        it('contains the Close role', () => {
            const closeRole = {'label': 'Close Window', 'role': 'close'};
            expect(fileItems.submenu).toContainEqual(closeRole);
        });

        it('contains open model', () => {
            const openModelItem = fileItems.submenu.find((item) => item.label === 'Open Model');
            expect(openModelItem).toBeDefined();
        });

        it('contains save model', () => {
            const saveModelItem = fileItems.submenu.find((item) => item.label === 'Save Model');
            expect(saveModelItem).toBeDefined();
        });

        it('contains save model as', () => {
            const saveModelAsItem = fileItems.submenu.find((item) => item.label === 'Save Model As');
            expect(saveModelAsItem).toBeDefined();
        });

        it('contains new model', () => {
            const newModelItem = fileItems.submenu.find((item) => item.label === 'New Model');
            expect(newModelItem).toBeDefined();
        });

        it('contains close model', () => {
            const closeModelItem = fileItems.submenu.find((item) => item.label === 'Close Model');
            expect(closeModelItem).toBeDefined();
        });

    });

    describe('Desktop Help menu', () => {

        const helpItems = menu.getMenuTemplate().find((item) => item.label === 'Help');

        it('contains Documentation', () => {
            const helpItem = helpItems.submenu.find((item) => item.label === 'Documentation');
            expect(helpItem).toBeDefined();
        });

        it('contains Visit OWASP', () => {
            const helpItem = helpItems.submenu.find((item) => item.label === 'Visit us at OWASP');
            expect(helpItem).toBeDefined();
        });

        it('contains Cheat Sheets', () => {
            const helpItem = helpItems.submenu.find((item) => item.label === 'OWASP Cheat Sheets');
            expect(helpItem).toBeDefined();
        });

        it('contains Visit GitHub', () => {
            const helpItem = helpItems.submenu.find((item) => item.label === 'Visit us on GitHub');
            expect(helpItem).toBeDefined();
        });

        it('contains Submit Issue', () => {
            const helpItem = helpItems.submenu.find((item) => item.label === 'Submit an Issue');
            expect(helpItem).toBeDefined();
        });

        it('contains Check Updates', () => {
            const helpItem = helpItems.submenu.find((item) => item.label === 'Check for updates ...');
            expect(helpItem).toBeDefined();
        });

        it('contains About', () => {
            const helpItem = helpItems.submenu.find((item) => item.label === 'About');
            expect(helpItem).toBeDefined();
        });
    });

    describe('showAboutBox', () => {

        const electron = require('electron');

        beforeEach(() => {
            electron.dialog.showMessageBoxSync.mockClear();
        });

        it('calls showMessageBoxSync when About is clicked', () => {
            const helpItems = menu.getMenuTemplate().find((item) => item.label === 'Help');
            const aboutItem = helpItems.submenu.find((item) => item.label === 'About');
            aboutItem.click();
            expect(electron.dialog.showMessageBoxSync).toHaveBeenCalled();
        });
    });

    describe('Help menu external links', () => {

        const electron = require('electron');

        beforeEach(() => {
            electron.shell.openExternal.mockClear();
        });

        it('Documentation click opens docs URL', async () => {
            electron.shell.openExternal.mockResolvedValue();
            const helpItems = menu.getMenuTemplate().find((item) => item.label === 'Help');
            const docsItem = helpItems.submenu.find((item) => item.label === 'Documentation');
            await docsItem.click();
            expect(electron.shell.openExternal).toHaveBeenCalledWith('https://www.threatdragon.com/docs/');
        });

        it('Visit OWASP click opens OWASP URL', async () => {
            electron.shell.openExternal.mockResolvedValue();
            const helpItems = menu.getMenuTemplate().find((item) => item.label === 'Help');
            const visitItem = helpItems.submenu.find((item) => item.label === 'Visit us at OWASP');
            await visitItem.click();
            expect(electron.shell.openExternal).toHaveBeenCalledWith('https://owasp.org/www-project-threat-dragon/');
        });
    });

    describe('openModelRequest', () => {

        const mockWindow = { webContents: { send: jest.fn() } };

        beforeEach(() => {
            menu.setMainWindow(mockWindow);
            mockWindow.webContents.send.mockClear();
        });

        it('sends open-model-request with filename', () => {
            menu.openModelRequest('/path/to/model.json');
            expect(mockWindow.webContents.send).toHaveBeenCalledWith('open-model-request', '/path/to/model.json');
        });
    });

    describe('openModel', () => {

        const electron = require('electron');
        const fs = require('fs');
        const mockWindow = { webContents: { send: jest.fn() } };

        beforeEach(() => {
            menu.setMainWindow(mockWindow);
            mockWindow.webContents.send.mockClear();
            electron.dialog.showOpenDialog.mockReset();
            fs.readFile.mockReset();
        });

        it('calls showOpenDialog when filename is empty', () => {
            electron.dialog.showOpenDialog.mockResolvedValue({ canceled: true });
            menu.openModel('');
            expect(electron.dialog.showOpenDialog).toHaveBeenCalled();
        });

        it('calls openModelFile when filename is non-empty', () => {
            fs.readFile.mockImplementation((path, cb) => cb(null, '{"title":"x"}'));
            menu.openModel('/some/model.json');
            expect(fs.readFile).toHaveBeenCalledWith('/some/model.json', expect.any(Function));
        });

        it('sends open-model with data when readFile succeeds', () => {
            model.filePath = '';
            fs.readFile.mockImplementation((path, cb) => cb(null, '{"title":"x"}'));
            menu.openModel('/some/model.json');
            expect(mockWindow.webContents.send).toHaveBeenCalledWith('open-model', 'model.json', expect.objectContaining({ title: 'x' }));
        });

        it('sends open-model with modelError when file is not json', () => {
            menu.openModel('/some/model.txt');
            expect(mockWindow.webContents.send).toHaveBeenCalledWith('open-model', 'model.txt', { modelError: 'onlyJsonAllowed' });
        });

        it('sends open-model with modelError when readFile returns invalid json', () => {
            fs.readFile.mockImplementation((path, cb) => cb(null, 'not json'));
            menu.openModel('/some/model.json');
            expect(mockWindow.webContents.send).toHaveBeenCalledWith('open-model', 'model.json', { modelError: 'invalidJson' });
        });

        it('sends open-model with modelError when readFile errors', () => {
            fs.readFile.mockImplementation((path, cb) => cb(new Error('read failed'), null));
            menu.openModel('/some/model.json');
            expect(mockWindow.webContents.send).toHaveBeenCalledWith('open-model', 'model.json', { modelError: 'open' });
        });

        it('calls openModelFile when user selects file from dialog', async () => {
            electron.dialog.showOpenDialog.mockResolvedValue({ canceled: false, filePaths: ['/picked/model.json'] });
            fs.readFile.mockImplementation((path, cb) => cb(null, '{"title":"picked"}'));
            menu.openModel('');
            await Promise.resolve();
            expect(mockWindow.webContents.send).toHaveBeenCalledWith('open-model', 'model.json', expect.objectContaining({ title: 'picked' }));
        });

        it('logs when user cancels open dialog', async () => {
            const mockLogger = require('./helpers/mockLogger');
            mockLogger.log.debug.mockClear();
            electron.dialog.showOpenDialog.mockResolvedValue({ canceled: true });
            menu.openModel('');
            await Promise.resolve();
            expect(mockLogger.log.debug).toHaveBeenCalledWith(expect.stringContaining('canceled'));
        });

        it('sets model.isOpen false and logs when showOpenDialog rejects', async () => {
            const mockLogger = require('./helpers/mockLogger');
            mockLogger.log.warn.mockClear();
            electron.dialog.showOpenDialog.mockRejectedValue(new Error('dialog failed'));
            menu.openModel('');
            await new Promise((r) => setTimeout(r, 0));
            expect(model.isOpen).toBe(false);
            expect(mockLogger.log.warn).toHaveBeenCalled();
        });
    });

    describe('Desktop menu functions', () => {

        const mockData = { title: 'test title' };
        let mockFilename = 'test name';
        const mockWindow = { webContents: { send: jest.fn() } };

        function getFileMenu () {
            return menu.getMenuTemplate().find((item) => item.label === 'File');
        }

        function getSaveClick () {
            return getFileMenu().submenu.find((item) => item.label === 'Save Model').click;
        }

        function getSaveAsClick () {
            return getFileMenu().submenu.find((item) => item.label === 'Save Model As').click;
        }

        function getNewModelClick () {
            return getFileMenu().submenu.find((item) => item.label === 'New Model').click;
        }

        function getExportHtmlClick () {
            const exportItem = getFileMenu().submenu.find((item) => item.label === 'Export Model As');
            return exportItem.submenu.find((item) => item.label === 'HTML Report').click;
        }

        function getCloseModelClick () {
            return getFileMenu().submenu.find((item) => item.label === 'Close Model').click;
        }

        describe('Electron server actions', () => {

            beforeEach(() => {
                model.fileDirectory = 'test directory';
                model.filePath = 'test path';
                model.isOpen = undefined;
                menu.setMainWindow(mockWindow);
                mockWindow.webContents.send.mockClear();
            });

            it('openModel() should send open-model to renderer with file path', () => {
                const openItem = getFileMenu().submenu.find((item) => item.label === 'Open Model');
                openItem.click();
                expect(mockWindow.webContents.send).toHaveBeenCalledWith('open-model-request', '');
            });

            it('saveModel() should send save-model-failed when no model open', () => {
                model.isOpen = false;
                getSaveClick()();
                expect(mockWindow.webContents.send).toHaveBeenCalledWith('save-model-failed', '', expect.any(String));
            });

            it('saveModel() should send save-model-request when model open', () => {
                model.isOpen = true;
                getSaveClick()();
                expect(mockWindow.webContents.send).toHaveBeenCalledWith('save-model-request', 'test path');
            });

            it('saveModel() should send save-model-request with basename when model open', () => {
                model.isOpen = true;
                getSaveClick()();
                expect(mockWindow.webContents.send).toHaveBeenCalledWith('save-model-request', 'test path');
            });

            it('saveModelAs() should send save-model-failed when no model open', () => {
                model.isOpen = false;
                getSaveAsClick()();
                expect(mockWindow.webContents.send).toHaveBeenCalledWith('save-model-failed', '', expect.any(String));
            });

            it('saveModelAs() should send save-model-request when model open', () => {
                model.isOpen = true;
                getSaveAsClick()();
                expect(mockWindow.webContents.send).toHaveBeenCalledWith('save-model-request', '');
            });

            it('newModel() should send new-model-request to renderer with file name', () => {
                getNewModelClick()();
                expect(mockWindow.webContents.send).toHaveBeenCalledWith('new-model-request', 'new-model.json');
            });

            it('printModel() should send save-model-failed when no model open', () => {
                model.isOpen = false;
                getExportHtmlClick()();
                expect(mockWindow.webContents.send).toHaveBeenCalledWith('save-model-failed', '', expect.any(String));
            });

            it('printModel() should send print-model-request when model open', () => {
                model.isOpen = true;
                getExportHtmlClick()();
                expect(mockWindow.webContents.send).toHaveBeenCalledWith('print-model-request', 'HTML');
            });

            it('closeModel() should send close-model-request to renderer with name from file path', () => {
                getCloseModelClick()();
                expect(mockWindow.webContents.send).toHaveBeenCalledWith('close-model-request', 'test path');
            });

        });

        describe('Renderer actions', () => {

            beforeEach(() => {
                model.fileDirectory = 'test directory';
                model.filePath = 'test path';
                model.isOpen = undefined;
                model.isModified = false;
                menu.setMainWindow(mockWindow);
                mockWindow.webContents.send.mockClear();
            });

            it('modelClosed() should close the model', () => {
                menu.modelClosed();
                expect(model.fileDirectory).toMatch('test directory');
                expect(model.filePath).toMatch('');
                expect(model.isOpen).toBeDefined();
                expect(model.isOpen).toBeFalsy();
            });

            it('modelOpened() should open a model', () => {
                menu.modelOpened();
                expect(model).toEqual( expect.objectContaining({fileDirectory: 'test directory', filePath: ''}) );
                expect(model.isOpen).toBeTruthy();
            });

            it('modelSave() should save an open model with a file path', () => {
                model.isOpen = true;
                const fs = require('fs');
                fs.writeFile.mockImplementation((path, data, cb) => cb());
                menu.modelSave(mockData, mockFilename);
                expect(mockWindow.webContents.send).toHaveBeenCalledWith('save-model-confirmed', 'test path');
            });

            it('modelSave() should not save a closed model with a file path', () => {
                model.isOpen = false;
                menu.modelSave(mockData, mockFilename);
                expect(model).toEqual( expect.objectContaining({fileDirectory: 'test directory', filePath: 'test path'}) );
                expect(model.isOpen).toBe(false);
            });

            it('modelSave() should saveAs a model with a file name and without a file path', async () => {
                model.filePath = '';
                const electron = require('electron');
                const fs = require('fs');
                electron.dialog.showSaveDialog.mockResolvedValue({ canceled: false, filePath: '/saved.json' });
                fs.writeFile.mockImplementation((path, data, cb) => cb());
                menu.modelSave(mockData, 'custom.json');
                await Promise.resolve();
                expect(mockWindow.webContents.send).toHaveBeenCalledWith('save-model-confirmed', '/saved.json');
            });

            it('modelSave() should saveAs a model without a file name and without a file path', async () => {
                model.filePath = '';
                mockFilename = '';
                const electron = require('electron');
                const fs = require('fs');
                electron.dialog.showSaveDialog.mockResolvedValue({ canceled: false, filePath: '/new-model.json' });
                fs.writeFile.mockImplementation((path, data, cb) => cb());
                menu.modelSave(mockData, '');
                await Promise.resolve();
                expect(mockWindow.webContents.send).toHaveBeenCalledWith('save-model-confirmed', '/new-model.json');
            });

            it('modelSave() should saveAs a model with an undefined file path', async () => {
                model.filePath = undefined;
                const electron = require('electron');
                const fs = require('fs');
                electron.dialog.showSaveDialog.mockResolvedValue({ canceled: false, filePath: '/saved.json' });
                fs.writeFile.mockImplementation((path, data, cb) => cb());
                menu.modelSave(mockData, 'custom.json');
                await Promise.resolve();
                expect(mockWindow.webContents.send).toHaveBeenCalledWith('save-model-confirmed', '/saved.json');
            });

            it('modelSave() saveModelDataAs logs when user cancels save dialog', async () => {
                model.filePath = '';
                const mockLogger = require('./helpers/mockLogger');
                mockLogger.log.debug.mockClear();
                const electron = require('electron');
                electron.dialog.showSaveDialog.mockResolvedValue({ canceled: true });
                menu.modelSave(mockData, 'custom.json');
                await Promise.resolve();
                expect(mockLogger.log.debug).toHaveBeenCalledWith(expect.stringContaining('canceled'));
            });

            it('modelSave() saveModelDataAs sends save-model-failed when dialog rejects', async () => {
                model.filePath = '';
                const electron = require('electron');
                electron.dialog.showSaveDialog.mockRejectedValue(new Error('dialog error'));
                menu.modelSave(mockData, 'name.json');
                await new Promise((r) => setTimeout(r, 0));
                expect(mockWindow.webContents.send).toHaveBeenCalledWith('save-model-failed', 'name.json', expect.any(String));
            });

            it('modelSave() saveModelData sends save-model-failed when writeFile errors', () => {
                model.isOpen = true;
                model.filePath = '/path/file.json';
                const fs = require('fs');
                fs.writeFile.mockImplementation((path, data, cb) => cb(new Error('write failed')));
                menu.modelSave(mockData);
                expect(mockWindow.webContents.send).toHaveBeenCalledWith('save-model-failed', '/path/file.json', expect.any(String));
            });

        });

        describe('modelPrint', () => {

            const electron = require('electron');
            const fs = require('fs');
            const mockWindow = { webContents: { send: jest.fn(), savePage: jest.fn(), printToPDF: jest.fn() } };

            beforeEach(() => {
                menu.setMainWindow(mockWindow);
                model.fileDirectory = '/dir';
                model.filePath = '/dir/model.json';
                mockWindow.webContents.send.mockClear();
                electron.dialog.showSaveDialog.mockReset();
            });

            it('calls savePDFReport when format is PDF', () => {
                electron.dialog.showSaveDialog.mockResolvedValue({ canceled: true });
                menu.modelPrint('PDF');
                expect(electron.dialog.showSaveDialog).toHaveBeenCalled();
            });

            it('calls saveHTMLReport when format is HTML', () => {
                electron.dialog.showSaveDialog.mockResolvedValue({ canceled: true });
                menu.modelPrint('HTML');
                expect(electron.dialog.showSaveDialog).toHaveBeenCalled();
            });

            it('logs warn when format is not recognised', () => {
                const mockLogger = require('./helpers/mockLogger');
                mockLogger.log.warn.mockClear();
                menu.modelPrint('UNKNOWN');
                expect(mockLogger.log.warn).toHaveBeenCalledWith(expect.stringContaining('UNKNOWN'));
            });

            it('saveHTMLReport sends print-model-confirmed when savePage succeeds', async () => {
                mockWindow.webContents.savePage.mockResolvedValue();
                electron.dialog.showSaveDialog.mockResolvedValue({ canceled: false, filePath: '/out/report.html' });
                menu.modelPrint('HTML');
                await new Promise((r) => setTimeout(r, 0));
                expect(mockWindow.webContents.send).toHaveBeenCalledWith('print-model-confirmed', '/out/report.html');
            });

            it('saveHTMLReport sends save-model-failed when savePage rejects', async () => {
                mockWindow.webContents.savePage.mockRejectedValue(new Error('save failed'));
                electron.dialog.showSaveDialog.mockResolvedValue({ canceled: false, filePath: '/out/report.html' });
                menu.modelPrint('HTML');
                await new Promise((r) => setTimeout(r, 0));
                expect(mockWindow.webContents.send).toHaveBeenCalledWith('save-model-failed', '/out/report.html', expect.any(String));
            });

            it('savePDFReport sends print-model-confirmed when printToPDF and writeFile succeed', async () => {
                mockWindow.webContents.printToPDF.mockResolvedValue(Buffer.from('pdf'));
                fs.writeFile.mockImplementation((path, data, cb) => cb());
                electron.dialog.showSaveDialog.mockResolvedValue({ canceled: false, filePath: '/out/report.pdf' });
                menu.modelPrint('PDF');
                await new Promise((r) => setTimeout(r, 0));
                expect(mockWindow.webContents.send).toHaveBeenCalledWith('print-model-confirmed', '/out/report.pdf');
            });

            it('savePDFReport sends save-model-failed when printToPDF rejects', async () => {
                mockWindow.webContents.printToPDF.mockRejectedValue(new Error('pdf failed'));
                electron.dialog.showSaveDialog.mockResolvedValue({ canceled: false, filePath: '/out/report.pdf' });
                menu.modelPrint('PDF');
                await new Promise((r) => setTimeout(r, 0));
                expect(mockWindow.webContents.send).toHaveBeenCalledWith('save-model-failed', '/out/report.pdf', expect.any(String));
            });

            it('savePDFReport logs when user cancels dialog', async () => {
                const mockLogger = require('./helpers/mockLogger');
                mockLogger.log.debug.mockClear();
                electron.dialog.showSaveDialog.mockResolvedValue({ canceled: true });
                menu.modelPrint('PDF');
                await Promise.resolve();
                expect(mockLogger.log.debug).toHaveBeenCalledWith(expect.stringContaining('canceled'));
            });

            it('calls saveHTMLReport with new_model path when model.filePath is empty', () => {
                model.filePath = '';
                electron.dialog.showSaveDialog.mockResolvedValue({ canceled: true });
                menu.modelPrint('HTML');
                expect(electron.dialog.showSaveDialog).toHaveBeenCalled();
            });
        });

        describe('setMainWindow', () => {

            it('stores window for later use', () => {
                const w = { webContents: { send: jest.fn() } };
                menu.setMainWindow(w);
                menu.openModelRequest('x');
                expect(w.webContents.send).toHaveBeenCalledWith('open-model-request', 'x');
            });
        });

        describe('Server utilities', () => {

            beforeEach(() => {
                model.fileDirectory = 'test directory';
                model.filePath = 'test path';
                model.isOpen = true;
                model.isModified = true;
                menu.setMainWindow(mockWindow);
                mockWindow.webContents.send.mockClear();
            });

            it('openModel() sends open-model to renderer with file path and data', () => {
                const fs = require('fs');
                fs.readFile.mockImplementation((path, cb) => cb(null, '{"title":"opened"}'));
                menu.openModel('another/file/path.json');
                expect(mockWindow.webContents.send).toHaveBeenCalledWith('open-model', 'path.json', expect.objectContaining({ title: 'opened' }));
            });

        });

        describe('Locale selection', () => {

            afterAll(() => {
                menu.setLocale('default');
            });

            it('should provide default translation', () => {
                const helpItems = menu.getMenuTemplate().find((item) => item.label === 'Help');
                expect(helpItems).toBeDefined();
            });

            it('should provide default translation for unrecognised locale', () => {
                menu.setLocale('unrecognised');
                const helpItems = menu.getMenuTemplate().find((item) => item.label === eng.desktop.help.heading);
                expect(helpItems).toBeDefined();
            });

            it('should provide translation for Arabic', () => {
                menu.setLocale('ara');
                const helpItems = menu.getMenuTemplate().find((item) => item.label === ara.desktop.help.heading);
                expect(helpItems).toBeDefined();
            });

            it('should provide translation for German', () => {
                menu.setLocale('deu');
                const helpItems = menu.getMenuTemplate().find((item) => item.label === deu.desktop.help.heading);
                expect(helpItems).toBeDefined();
            });

            it('should provide translation for Greek (Modern)', () => {
                menu.setLocale('ell');
                const helpItems = menu.getMenuTemplate().find((item) => item.label === ell.desktop.help.heading);
                expect(helpItems).toBeDefined();
            });

            it('should provide translation for English', () => {
                menu.setLocale('eng');
                const helpItems = menu.getMenuTemplate().find((item) => item.label === eng.desktop.help.heading);
                expect(helpItems).toBeDefined();
            });

            it('should provide translation for Bahasa Indonesia', () => {
                menu.setLocale('ind');
                const helpItems = menu.getMenuTemplate().find((item) => item.label === ind.desktop.help.heading);
                expect(helpItems).toBeDefined();
            });

            it('should provide translation for Malay', () => {
                menu.setLocale('msa');
                const helpItems = menu.getMenuTemplate().find((item) => item.label === msa.desktop.help.heading);
                expect(helpItems).toBeDefined();
            });

            it('should provide translation for Finnish', () => {
                menu.setLocale('fin');
                const helpItems = menu.getMenuTemplate().find((item) => item.label === fin.desktop.help.heading);
                expect(helpItems).toBeDefined();
            });

            it('should provide translation for French', () => {
                menu.setLocale('fra');
                const helpItems = menu.getMenuTemplate().find((item) => item.label === fra.desktop.help.heading);
                expect(helpItems).toBeDefined();
            });

            it('should provide translation for Hindi', () => {
                menu.setLocale('hin');
                const helpItems = menu.getMenuTemplate().find((item) => item.label === hin.desktop.help.heading);
                expect(helpItems).toBeDefined();
            });

            it('should provide translation for Portuguese', () => {
                menu.setLocale('por');
                const helpItems = menu.getMenuTemplate().find((item) => item.label === por.desktop.help.heading);
                expect(helpItems).toBeDefined();
            });

            it('should provide translation for Brazilian Portuguese', () => {
                menu.setLocale('bra');
                const helpItems = menu.getMenuTemplate().find((item) => item.label === bra.desktop.help.heading);
                expect(helpItems).toBeDefined();
            });

            it('should provide translation for Russian', () => {
                menu.setLocale('rus');
                const helpItems = menu.getMenuTemplate().find((item) => item.label === rus.desktop.help.heading);
                expect(helpItems).toBeDefined();
            });

            it('should provide translation for Spanish (Castilian)', () => {
                menu.setLocale('spa');
                const helpItems = menu.getMenuTemplate().find((item) => item.label === spa.desktop.help.heading);
                expect(helpItems).toBeDefined();
            });

            it('should provide translation for Ukrainian', () => {
                menu.setLocale('ukr');
                const helpItems = menu.getMenuTemplate().find((item) => item.label === ukr.desktop.help.heading);
                expect(helpItems).toBeDefined();
            });

            it('should provide translation for Chinese', () => {
                menu.setLocale('zho');
                const helpItems = menu.getMenuTemplate().find((item) => item.label === zho.desktop.help.heading);
                expect(helpItems).toBeDefined();
            });

        });

    });

});
