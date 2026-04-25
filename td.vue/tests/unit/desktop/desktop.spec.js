import { utils, getUtilsMock } from './helpers/mockUtils.js';
import mockLogger from './helpers/mockLogger.js';
import mockMenu from './helpers/mockMenu.js';
import { registerDesktop } from '@/desktop/desktop.js';

let appHandlers;
let ipcHandlers;
let mockDeps;

jest.mock('@/desktop/utils.js', () => require('./helpers/mockUtils').getUtilsMock());
jest.mock('@/desktop/menu.js', () => require('./helpers/mockMenu'));
jest.mock('@/desktop/logger.js', () => require('./helpers/mockLogger'));
jest.mock('electron', () => require('./helpers/mockElectron').getElectronMock());
jest.mock('vue-cli-plugin-electron-builder/lib', () => ({ createProtocol: jest.fn() }));
jest.mock('electron-devtools-installer', () => ({
    __esModule: true,
    default: jest.fn(),
    VUEJS_DEVTOOLS: 'VUEJS_DEVTOOLS'
}));
jest.mock('electron-updater', () => ({ autoUpdater: { checkForUpdatesAndNotify: jest.fn() } }));
jest.mock('wdio-electron-service/main', () => ({}));

function buildMockDeps () {
    appHandlers = {};
    ipcHandlers = {};
    const loadURL = jest.fn(() => Promise.resolve());
    const webContents = { on: jest.fn(), send: jest.fn(), openDevTools: jest.fn() };
    const mainWindow = {
        webContents,
        on: jest.fn(),
        show: jest.fn(),
        focus: jest.fn(),
        loadURL
    };
    const BrowserWindow = jest.fn(() => mainWindow);
    BrowserWindow.getAllWindows = jest.fn(() => []);

    return {
        app: {
            on: jest.fn((ev, cb) => { appHandlers[ev] = cb; }),
            quit: jest.fn()
        },
        protocol: { registerSchemesAsPrivileged: jest.fn() },
        BrowserWindow,
        Menu: { setApplicationMenu: jest.fn(), buildFromTemplate: jest.fn(t => t) },
        ipcMain: { on: jest.fn((ch, cb) => { ipcHandlers[ch] = cb; }) },
        menu: mockMenu,
        logger: mockLogger,
        utils: getUtilsMock(),
        createProtocol: jest.fn(),
        installExtension: jest.fn(() => Promise.resolve()),
        VUEJS_DEVTOOLS: 'VUEJS_DEVTOOLS',
        autoUpdater: { checkForUpdatesAndNotify: jest.fn() },
        path: { join: jest.fn((...a) => a.join('/')) }
    };
}

function resetUtils () {
    utils.electronURL = null;
    utils.isDevelopment = false;
    utils.isTest = true;
    utils.isMacOS = false;
    utils.isWin = false;
}

describe('desktop/desktop.js', () => {

    beforeAll(() => {
        global.__static = '';
    });

    beforeEach(() => {
        resetUtils();
        mockDeps = buildMockDeps();
        registerDesktop(mockDeps);
    });

    describe('protocol registration', () => {
        it('registers app scheme as privileged', () => {
            expect(mockDeps.protocol.registerSchemesAsPrivileged).toHaveBeenCalledWith([
                { scheme: 'app', privileges: { secure: true, standard: true } }
            ]);
        });
    });

    describe('createWindow', () => {
        describe('after ready', () => {
            beforeEach(async () => {
                await appHandlers.ready();
            });

            it('constructs BrowserWindow with expected width and height', () => {
                expect(mockDeps.BrowserWindow).toHaveBeenCalledWith(expect.objectContaining({
                    width: 1400,
                    height: 1000
                }));
            });

            it('constructs BrowserWindow with show false', () => {
                expect(mockDeps.BrowserWindow).toHaveBeenCalledWith(expect.objectContaining({ show: false }));
            });

            it('constructs BrowserWindow with contextIsolation true', () => {
                expect(mockDeps.BrowserWindow).toHaveBeenCalledWith(expect.objectContaining({
                    webPreferences: expect.objectContaining({ contextIsolation: true })
                }));
            });

            it('calls path.join for preload script', () => {
                expect(mockDeps.path.join).toHaveBeenCalledWith('', 'preload.js');
            });

            it('registers did-finish-load on webContents', () => {
                const win = mockDeps.BrowserWindow();
                expect(win.webContents.on).toHaveBeenCalledWith('did-finish-load', expect.any(Function));
            });

            it('shows window when did-finish-load fires', () => {
                const win = mockDeps.BrowserWindow();
                const cb = win.webContents.on.mock.calls.find(c => c[0] === 'did-finish-load')[1];
                cb();
                expect(win.show).toHaveBeenCalled();
            });

            it('focuses window when did-finish-load fires', () => {
                const win = mockDeps.BrowserWindow();
                const cb = win.webContents.on.mock.calls.find(c => c[0] === 'did-finish-load')[1];
                cb();
                expect(win.focus).toHaveBeenCalled();
            });

            it('calls menu.setMainWindow when did-finish-load fires', () => {
                const win = mockDeps.BrowserWindow();
                const cb = win.webContents.on.mock.calls.find(c => c[0] === 'did-finish-load')[1];
                cb();
                expect(mockMenu.setMainWindow).toHaveBeenCalledWith(win);
            });

            it('registers close handler on main window', () => {
                const win = mockDeps.BrowserWindow();
                expect(win.on).toHaveBeenCalledWith('close', expect.any(Function));
            });

            it('prevents close and sends close-app-request when runApp is true', () => {
                const win = mockDeps.BrowserWindow();
                const closeCb = win.on.mock.calls.find(c => c[0] === 'close')[1];
                const event = { preventDefault: jest.fn() };
                closeCb(event);
                expect(event.preventDefault).toHaveBeenCalled();
            });

            it('sends close-app-request on close when runApp is true', () => {
                const win = mockDeps.BrowserWindow();
                const closeCb = win.on.mock.calls.find(c => c[0] === 'close')[1];
                closeCb({ preventDefault: jest.fn() });
                expect(win.webContents.send).toHaveBeenCalledWith('close-app-request');
            });

            it('does not preventDefault when runApp is false', () => {
                ipcHandlers['close-app']();
                const win = mockDeps.BrowserWindow();
                const closeCb = win.on.mock.calls.find(c => c[0] === 'close')[1];
                const event = { preventDefault: jest.fn() };
                closeCb(event);
                expect(event.preventDefault).not.toHaveBeenCalled();
            });

            it('does not send close-app-request when runApp is false', () => {
                ipcHandlers['close-app']();
                const win = mockDeps.BrowserWindow();
                const closeCb = win.on.mock.calls.find(c => c[0] === 'close')[1];
                win.webContents.send.mockClear();
                closeCb({ preventDefault: jest.fn() });
                expect(win.webContents.send).not.toHaveBeenCalled();
            });

            it('calls createProtocol when electronURL is falsy', () => {
                expect(mockDeps.createProtocol).toHaveBeenCalledWith('app');
            });

            it('loads app://./index.html when electronURL is falsy', () => {
                const win = mockDeps.BrowserWindow();
                expect(win.loadURL).toHaveBeenCalledWith('app://./index.html');
            });
        });

        describe('when electronURL is set', () => {
            beforeEach(async () => {
                utils.electronURL = 'http://localhost:8080';
                mockDeps = buildMockDeps();
                registerDesktop(mockDeps);
                await appHandlers.ready();
            });

            it('logs when electronURL is set', () => {
                expect(mockLogger.log.info).toHaveBeenCalledWith(expect.stringContaining('http://localhost:8080'));
            });

            it('calls loadURL with electronURL when set', () => {
                const win = mockDeps.BrowserWindow();
                expect(win.loadURL).toHaveBeenCalledWith('http://localhost:8080');
            });
        });

        describe('dev tools', () => {
            it('does not open dev tools when isTest is true and electronURL is set', async () => {
                utils.electronURL = 'http://localhost:8080';
                utils.isTest = true;
                mockDeps = buildMockDeps();
                registerDesktop(mockDeps);
                await appHandlers.ready();
                const win = mockDeps.BrowserWindow();
                expect(win.webContents.openDevTools).not.toHaveBeenCalled();
            });

            it('opens dev tools when isTest is false and electronURL is set', async () => {
                utils.electronURL = 'http://localhost:8080';
                utils.isTest = false;
                mockDeps = buildMockDeps();
                registerDesktop(mockDeps);
                await appHandlers.ready();
                const win = mockDeps.BrowserWindow();
                expect(win.webContents.openDevTools).toHaveBeenCalled();
            });
        });
    });

    describe('window-all-closed handler', () => {
        describe('when not macOS', () => {
            beforeEach(() => {
                utils.isMacOS = false;
                mockDeps = buildMockDeps();
                registerDesktop(mockDeps);
                appHandlers['window-all-closed']();
            });

            it('calls logger', () => {
                expect(mockLogger.log.debug).toHaveBeenCalledWith('Quit application');
            });

            it('calls app.quit', () => {
                expect(mockDeps.app.quit).toHaveBeenCalled();
            });
        });

        describe('when macOS', () => {
            beforeEach(() => {
                utils.isMacOS = true;
                mockDeps = buildMockDeps();
                registerDesktop(mockDeps);
                appHandlers['window-all-closed']();
            });

            it('logs ignoring window-all-closed', () => {
                expect(mockLogger.log.debug).toHaveBeenCalledWith('Ignoring window-all-closed for MacOS');
            });

            it('does not call app.quit', () => {
                expect(mockDeps.app.quit).not.toHaveBeenCalled();
            });
        });
    });

    describe('activate handler', () => {
        it('logs activate application', () => {
            appHandlers.activate();
            expect(mockLogger.log.debug).toHaveBeenCalledWith('Activate application');
        });

        it('calls createWindow when no windows exist', () => {
            mockDeps.BrowserWindow.getAllWindows.mockReturnValue([]);
            mockDeps.BrowserWindow.mockClear();
            appHandlers.activate();
            expect(mockDeps.BrowserWindow).toHaveBeenCalled();
        });

        it('does not call createWindow when windows exist', () => {
            mockDeps.BrowserWindow.getAllWindows.mockReturnValue([{}]);
            mockDeps.BrowserWindow.mockClear();
            appHandlers.activate();
            expect(mockDeps.BrowserWindow).not.toHaveBeenCalled();
        });
    });

    describe('ready handler', () => {
        describe('after ready', () => {
            beforeEach(async () => {
                await appHandlers.ready();
            });

            it('logs building menu for default language', () => {
                expect(mockLogger.log.debug).toHaveBeenCalledWith('Building the menu system for the default language');
            });

            it('calls menu.getMenuTemplate', () => {
                expect(mockMenu.getMenuTemplate).toHaveBeenCalled();
            });

            it('calls Menu.setApplicationMenu with built template', () => {
                expect(mockDeps.Menu.buildFromTemplate).toHaveBeenCalledWith(mockMenu.getMenuTemplate());
            });

            it('calls Menu.setApplicationMenu', () => {
                expect(mockDeps.Menu.setApplicationMenu).toHaveBeenCalled();
            });

            it('registers close-app IPC handler', () => {
                expect(ipcHandlers['close-app']).toBeDefined();
            });

            it('registers model-closed IPC handler', () => {
                expect(ipcHandlers['model-closed']).toBeDefined();
            });

            it('registers model-open-confirmed IPC handler', () => {
                expect(ipcHandlers['model-open-confirmed']).toBeDefined();
            });

            it('registers model-opened IPC handler', () => {
                expect(ipcHandlers['model-opened']).toBeDefined();
            });

            it('registers model-print IPC handler', () => {
                expect(ipcHandlers['model-print']).toBeDefined();
            });

            it('registers model-save IPC handler', () => {
                expect(ipcHandlers['model-save']).toBeDefined();
            });

            it('registers update-menu IPC handler', () => {
                expect(ipcHandlers['update-menu']).toBeDefined();
            });

            it('calls autoUpdater.checkForUpdatesAndNotify', () => {
                expect(mockDeps.autoUpdater.checkForUpdatesAndNotify).toHaveBeenCalled();
            });

            it('does not install devtools when isDevelopment is false', () => {
                expect(mockDeps.installExtension).not.toHaveBeenCalled();
            });
        });

        describe('devtools installation', () => {
            it('does not install devtools when isTest is true', async () => {
                utils.isDevelopment = true;
                utils.isTest = true;
                mockDeps = buildMockDeps();
                registerDesktop(mockDeps);
                await appHandlers.ready();
                expect(mockDeps.installExtension).not.toHaveBeenCalled();
            });

            it('calls installExtension when isDevelopment true and isTest false', async () => {
                utils.isDevelopment = true;
                utils.isTest = false;
                mockDeps = buildMockDeps();
                registerDesktop(mockDeps);
                await appHandlers.ready();
                expect(mockDeps.installExtension).toHaveBeenCalledWith('VUEJS_DEVTOOLS');
            });

            it('logs error when installExtension throws', async () => {
                utils.isDevelopment = true;
                utils.isTest = false;
                mockDeps = buildMockDeps();
                mockDeps.installExtension.mockRejectedValueOnce(new Error('install failed'));
                registerDesktop(mockDeps);
                await appHandlers.ready();
                expect(mockLogger.log.error).toHaveBeenCalledWith('Vue Devtools failed to install:', expect.any(String));
            });
        });
    });

    describe('open-file handler', () => {
        it('calls event.preventDefault', () => {
            const event = { preventDefault: jest.fn() };
            appHandlers['open-file'](event, '/some/path');
            expect(event.preventDefault).toHaveBeenCalled();
        });

        it('logs open file request with path', () => {
            appHandlers['open-file']({ preventDefault: jest.fn() }, '/some/path');
            expect(mockLogger.log.debug).toHaveBeenCalledWith(expect.stringContaining('/some/path'));
        });

        it('calls menu.openModelRequest with path', () => {
            appHandlers['open-file']({ preventDefault: jest.fn() }, '/some/path');
            expect(mockMenu.openModelRequest).toHaveBeenCalledWith('/some/path');
        });
    });

    describe('IPC handlers', () => {
        beforeEach(async () => {
            await appHandlers.ready();
        });

        describe('handleCloseApp', () => {
            it('logs close application request', () => {
                ipcHandlers['close-app']();
                expect(mockLogger.log.debug).toHaveBeenCalledWith('Close application request from renderer ');
            });

            it('calls app.quit', () => {
                ipcHandlers['close-app']();
                expect(mockDeps.app.quit).toHaveBeenCalled();
            });
        });

        describe('handleModelClosed', () => {
            it('logs close model notification with file name', () => {
                ipcHandlers['model-closed'](null, 'myfile.json');
                expect(mockLogger.log.debug).toHaveBeenCalledWith(expect.stringContaining('myfile.json'));
            });

            it('calls menu.modelClosed', () => {
                ipcHandlers['model-closed'](null, 'myfile.json');
                expect(mockMenu.modelClosed).toHaveBeenCalled();
            });
        });

        describe('handleModelOpenConfirmed', () => {
            it('logs open model confirmation with file name', () => {
                ipcHandlers['model-open-confirmed'](null, 'myfile.json');
                expect(mockLogger.log.debug).toHaveBeenCalledWith(expect.stringContaining('myfile.json'));
            });

            it('calls menu.openModel with file name', () => {
                ipcHandlers['model-open-confirmed'](null, 'myfile.json');
                expect(mockMenu.openModel).toHaveBeenCalledWith('myfile.json');
            });
        });

        describe('handleModelOpened', () => {
            it('logs open model notification with file name', () => {
                ipcHandlers['model-opened'](null, 'myfile.json');
                expect(mockLogger.log.debug).toHaveBeenCalledWith(expect.stringContaining('myfile.json'));
            });

            it('calls menu.modelOpened', () => {
                ipcHandlers['model-opened'](null, 'myfile.json');
                expect(mockMenu.modelOpened).toHaveBeenCalled();
            });
        });

        describe('handleModelPrint', () => {
            it('logs model print request with format', () => {
                ipcHandlers['model-print'](null, 'PDF');
                expect(mockLogger.log.debug).toHaveBeenCalledWith(expect.stringContaining('PDF'));
            });

            it('calls menu.modelPrint with format', () => {
                ipcHandlers['model-print'](null, 'PDF');
                expect(mockMenu.modelPrint).toHaveBeenCalledWith('PDF');
            });
        });

        describe('handleModelSave', () => {
            it('logs model save request with file name', () => {
                ipcHandlers['model-save'](null, {}, 'savefile.json');
                expect(mockLogger.log.debug).toHaveBeenCalledWith(expect.stringContaining('savefile.json'));
            });

            it('calls menu.modelSave with modelData and fileName', () => {
                const data = { title: 'Test' };
                ipcHandlers['model-save'](null, data, 'savefile.json');
                expect(mockMenu.modelSave).toHaveBeenCalledWith(data, 'savefile.json');
            });
        });

        describe('handleUpdateMenu', () => {
            it('logs re-labeling menu for locale', () => {
                ipcHandlers['update-menu'](null, 'fr');
                expect(mockLogger.log.debug).toHaveBeenCalledWith(expect.stringContaining('fr'));
            });

            it('calls menu.setLocale with locale', () => {
                ipcHandlers['update-menu'](null, 'fr');
                expect(mockMenu.setLocale).toHaveBeenCalledWith('fr');
            });

            it('calls menu.getMenuTemplate after setLocale', () => {
                mockMenu.getMenuTemplate.mockClear();
                ipcHandlers['update-menu'](null, 'fr');
                expect(mockMenu.getMenuTemplate).toHaveBeenCalled();
            });

            it('calls Menu.setApplicationMenu when update-menu is triggered', () => {
                mockDeps.Menu.setApplicationMenu.mockClear();
                ipcHandlers['update-menu'](null, 'fr');
                expect(mockDeps.Menu.setApplicationMenu).toHaveBeenCalled();
            });
        });
    });

    describe('graceful exit in development (Windows)', () => {
        beforeEach(() => {
            utils.isDevelopment = true;
            utils.isWin = true;
            mockDeps = buildMockDeps();
            registerDesktop(mockDeps);
        });

        afterEach(() => {
            const listener = process.listeners('message').pop();
            if (listener) process.removeListener('message', listener);
        });

        it('registers process message handler', () => {
            expect(process.listeners('message').length).toBeGreaterThan(0);
        });

        it('calls app.quit when message is graceful-exit', () => {
            const messageCb = process.listeners('message').pop();
            process.removeListener('message', messageCb);
            messageCb('graceful-exit');
            expect(mockDeps.app.quit).toHaveBeenCalled();
        });

        it('does not call app.quit when message is not graceful-exit', () => {
            const messageCb = process.listeners('message').pop();
            process.removeListener('message', messageCb);
            messageCb('other');
            expect(mockDeps.app.quit).not.toHaveBeenCalled();
        });
    });

    describe('graceful exit in development (non-Windows)', () => {
        let sigtermListener;

        beforeEach(() => {
            utils.isDevelopment = true;
            utils.isWin = false;
            mockDeps = buildMockDeps();
            registerDesktop(mockDeps);
            sigtermListener = process.listeners('SIGTERM').pop();
            process.removeAllListeners('SIGTERM');
            process.on('SIGTERM', sigtermListener);
        });

        afterEach(() => {
            process.removeListener('SIGTERM', sigtermListener);
        });

        it('registers SIGTERM handler', () => {
            expect(sigtermListener).toBeDefined();
        });

        it('calls app.quit when SIGTERM fires', () => {
            sigtermListener();
            expect(mockDeps.app.quit).toHaveBeenCalled();
        });
    });
});
