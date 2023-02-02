import utils from '@/desktop/utils.js';

describe('desktop/utils.js', () => {

    describe('Desktop server utilities', () => {

        it('should provide the log level', () => {
            expect(utils.logLevel).toMatch('debug');
        });

        it('should match on environment state', () => {
            expect(utils.isDevelopment).toBe(true);
        });

        it('should not provide the url', () => {
            expect(utils.electronURL).not.toBeDefined();
        });

    });

});
