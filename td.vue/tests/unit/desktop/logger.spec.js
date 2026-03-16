jest.mock('@/desktop/utils.js', () => require('./helpers/mockUtils').getUtilsMock());
jest.mock('electron-log', () => ({
    info: jest.fn(),
    transports: { file: { level: null }, console: { level: null } },
    functions: {}
}));

import { utils } from './helpers/mockUtils.js';
import logger from '@/desktop/logger.js';

describe('desktop/logger.js', () => {

    describe('Electron server log levels', () => {

        it('should set the default file log level', () => {
            expect(logger.fileLogLevel).toMatch('debug');
        });

        it('should set the error console log level', () => {
            expect(logger.consoleLogLevel).toMatch('error');
        });

    });

    describe('Electron server log transports', () => {

        it('should be defined', () => {
            expect(logger.log.transports).toBeDefined();
        });

    });

    describe('development log path', () => {

        let consoleSpy;

        beforeEach(() => {
            consoleSpy = jest.spyOn(console, 'log').mockImplementation();
        });

        afterEach(() => {
            consoleSpy.mockRestore();
        });

        it('logs macOS path when isDevelopment and isMacOS', () => {
            utils.isDevelopment = true;
            utils.isMacOS = true;
            utils.isWin = false;
            jest.isolateModules(() => {
                require('@/desktop/logger.js');
            });
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Library/Logs'));
        });

        it('logs Windows path when isDevelopment and isWin', () => {
            utils.isDevelopment = true;
            utils.isMacOS = false;
            utils.isWin = true;
            jest.isolateModules(() => {
                require('@/desktop/logger.js');
            });
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('AppData'));
        });

        it('logs default path when isDevelopment and not macOS or Windows', () => {
            utils.isDevelopment = true;
            utils.isMacOS = false;
            utils.isWin = false;
            jest.isolateModules(() => {
                require('@/desktop/logger.js');
            });
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('.config'));
        });

    });

});
