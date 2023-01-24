import {consoleLogLevel, fileLogLevel, log} from '@/desktop/logger.js';

describe('desktop/logger.js', () => {

    describe('Electron server log levels', () => {

        it('should set the file log level', () => {
            expect(fileLogLevel).toMatch(process.env.LOG_LEVEL);
        });

        it('should set the console log level', () => {
            expect(consoleLogLevel).toMatch('error');
        });

    });

    describe('Electron server log transports', () => {

        it('should be defined', () => {
            expect(log.transports).toBeDefined();
        });

    });

});
