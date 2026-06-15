jest.mock('is-electron', () => {
    const mockIsElectron = jest.fn();
    return mockIsElectron;
});

const mockIsElectron = require('is-electron');

describe('isDesktopApp()', () => {
    beforeEach(() => {
        mockIsElectron.mockClear();
    });

    afterEach(() => {
        delete global.window?.electronAPI;
        jest.resetModules();
    });

    test('returns true in Electron with electronAPI', () => {
        mockIsElectron.mockReturnValue(true);
        global.window = global.window || {};
        global.window.electronAPI = {};
        const { isDesktopApp } = require('../../../src/service/environment');
        expect(isDesktopApp()).toBe(true);
    });

    test('returns false when electronAPI missing', () => {
        mockIsElectron.mockReturnValue(true);
        const { isDesktopApp } = require('../../../src/service/environment');
        expect(isDesktopApp()).toBe(false);
    });

    test('returns false when not Electron', () => {
        mockIsElectron.mockReturnValue(false);
        global.window.electronAPI = {};
        const { isDesktopApp } = require('../../../src/service/environment');
        expect(isDesktopApp()).toBe(false);
    });
});
