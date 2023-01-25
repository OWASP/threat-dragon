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

});
