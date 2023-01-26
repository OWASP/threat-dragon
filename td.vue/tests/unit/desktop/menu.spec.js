import menu, { model } from '@/desktop/menu.js';
import deu from '@/i18n/de.js';
import ell from '@/i18n/el.js';
import eng from '@/i18n/en.js';
import fra from '@/i18n/fr.js';
import hin from '@/i18n/hi.js';
import por from '@/i18n/pt.js';
import rus from '@/i18n/ru.js';
import spa from '@/i18n/es.js';
import ukr from '@/i18n/uk.js';
import zho from '@/i18n/zh.js';

describe('desktop/menu.js', () => {

    describe('Desktop menu', () => {

        const menuItems = menu.getMenuTemplate();

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
            const closeRole = {'role': 'close'};
            expect(fileItems.submenu).toContainEqual(closeRole);
        });

        it('contains open model', () => {
            const openModelItem = fileItems.submenu.find((item) => item.label === 'Open Model');
            expect(openModelItem).toBeDefined();
        });

        it('contains recent items', () => {
            const recentItems = {'role': 'recentdocuments', 'submenu': [{'role': 'clearrecentdocuments'}]};
            expect(fileItems.submenu).toContainEqual(recentItems);
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

    });

    describe('Desktop menu functions', () => {

        const mockData = { 'title': 'test title' };
        var mockFilename = 'test name';


        describe('Server actions', () => {

            beforeEach(() => {
                model.fileDirectory = 'test directory';
                model.filePath = 'test path';
                model.isOpen = undefined;
            });

            it('openModel() should send open-model to renderer with file path', () => {
                // TODO: click on the server menu item for openModel()
                expect(model).toEqual( expect.objectContaining({fileDirectory: 'test directory', filePath: 'test path'}) );
                expect(model.isOpen).not.toBeDefined();
            });

            it('saveModel() should send save-model to renderer with a file path', () => {
                // TODO: click on the server menu item for saveModel()
                expect(model).toEqual( expect.objectContaining({fileDirectory: 'test directory', filePath: 'test path'}) );
                expect(model.isOpen).not.toBeDefined();
            });

            it('saveModelAs() should send save-model to renderer without a file path', () => {
                // TODO: click on the server menu item for saveModelAs()
                // expect(model).toEqual( expect.objectContaining({fileDirectory: 'test directory', filePath: ''}) );
                expect(model.isOpen).not.toBeDefined();
            });

            it('newModel() should send new-model to renderer with file name', () => {
                // TODO: click on the server menu item for newModel()
                expect(model).toEqual( expect.objectContaining({fileDirectory: 'test directory', filePath: 'test path'}) );
                expect(model.isOpen).not.toBeDefined();
            });

            it('closeModel() should send close-model to renderer with name from file path', () => {
                // TODO: click on the server menu item for closeModel()
                expect(model).toEqual( expect.objectContaining({fileDirectory: 'test directory', filePath: 'test path'}) );
                expect(model.isOpen).not.toBeDefined();
            });

        });


        describe('Renderer actions', () => {

            beforeEach(() => {
                model.fileDirectory = 'test directory';
                model.filePath = 'test path';
                model.isOpen = undefined;
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

            it('modelSaved() should save an open model with a file path', () => {
                model.isOpen = true;
                // TODO: mock the fs
                // menu.modelSaved(mockData, mockFilename);
                expect(model).toEqual( expect.objectContaining({fileDirectory: 'test directory', filePath: 'test path'}) );
                expect(model.isOpen).toBe(true);
            });

            it('modelSaved()should not save a closed model with a file path', () => {
                model.isOpen = false;
                menu.modelSaved(mockData, mockFilename);
                expect(model).toEqual( expect.objectContaining({fileDirectory: 'test directory', filePath: 'test path'}) );
                expect(model.isOpen).toBe(false);
            });

            it('modelSaved() should saveAs a model with a file name and without a file path', () => {
                model.filePath = '';
                // TODO: mock the fs
                // menu.modelSaved(mockData, mockFilename);
                expect(model).toEqual( expect.objectContaining({fileDirectory: 'test directory', filePath: ''}) );
                expect(true).toBe(true);
            });

            it('modelSaved() should saveAs a model without a file name and without a file path', () => {
                model.filePath = '';
                mockFilename = '';
                // TODO: mock the fs
                // menu.modelSaved(mockData, mockFilename);
                expect(model).toEqual( expect.objectContaining({fileDirectory: 'test directory', filePath: ''}) );
                expect(true).toBe(true);
            });

            it('modelSaved() should saveAs a model with an undefined file path', () => {
                model.filePath = undefined;
                // TODO: mock the fs
                // menu.modelSaved(mockData, mockFilename);
                expect(model).toEqual( expect.objectContaining({fileDirectory: 'test directory', filePath: undefined}) );
                expect(true).toBe(true);
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

            it('should provide translation for deu', () => {
                menu.setLocale('deu');
                const helpItems = menu.getMenuTemplate().find((item) => item.label === deu.desktop.help.heading);
                expect(helpItems).toBeDefined();
            });

            it('should provide translation for ell', () => {
                menu.setLocale('ell');
                const helpItems = menu.getMenuTemplate().find((item) => item.label === ell.desktop.help.heading);
                expect(helpItems).toBeDefined();
            });

            it('should provide translation for eng', () => {
                menu.setLocale('eng');
                const helpItems = menu.getMenuTemplate().find((item) => item.label === eng.desktop.help.heading);
                expect(helpItems).toBeDefined();
            });

            it('should provide translation for fra', () => {
                menu.setLocale('fra');
                const helpItems = menu.getMenuTemplate().find((item) => item.label === fra.desktop.help.heading);
                expect(helpItems).toBeDefined();
            });

            it('should provide translation for hin', () => {
                menu.setLocale('hin');
                const helpItems = menu.getMenuTemplate().find((item) => item.label === hin.desktop.help.heading);
                expect(helpItems).toBeDefined();
            });

            it('should provide translation for por', () => {
                menu.setLocale('por');
                const helpItems = menu.getMenuTemplate().find((item) => item.label === por.desktop.help.heading);
                expect(helpItems).toBeDefined();
            });

            it('should provide translation for rus', () => {
                menu.setLocale('rus');
                const helpItems = menu.getMenuTemplate().find((item) => item.label === rus.desktop.help.heading);
                expect(helpItems).toBeDefined();
            });

            it('should provide translation for spa', () => {
                menu.setLocale('spa');
                const helpItems = menu.getMenuTemplate().find((item) => item.label === spa.desktop.help.heading);
                expect(helpItems).toBeDefined();
            });

            it('should provide translation for ukr', () => {
                menu.setLocale('ukr');
                const helpItems = menu.getMenuTemplate().find((item) => item.label === ukr.desktop.help.heading);
                expect(helpItems).toBeDefined();
            });

            it('should provide translation for zho', () => {
                menu.setLocale('zho');
                const helpItems = menu.getMenuTemplate().find((item) => item.label === zho.desktop.help.heading);
                expect(helpItems).toBeDefined();
            });

        });

    });

});
