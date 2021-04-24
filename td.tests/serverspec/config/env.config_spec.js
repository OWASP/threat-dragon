var mockery =  require('mockery');

describe('environment configuration tests', function() {
    var mockFs;
    var mockDotEnv = {
        config: function () {}
    };


    beforeEach(function() {
        mockery.enable({ useCleanCache: true });
        mockery.warnOnUnregistered(false);
        mockery.warnOnReplace(false);

        mockery.registerMock('dotenv', mockDotEnv);
        spyOn(mockDotEnv, 'config');
    });
    
    afterEach(function() {
        mockery.disable();
    });

    afterAll(function() {
        mockery.deregisterAll();
    });

    describe('with .env file present', function () {
        beforeEach(() => {
            mockFs = {
                existsSync: function () { return true; }
            };

            mockery.registerMock('fs', mockFs);
            spyOn(mockFs, 'existsSync').and.callThrough();
    
            var envConfig = require('../../../td/config/env.config.js');
            envConfig.tryLoadDotEnv();
        });

        it('checks if ../../.env exists', () => {
            expect(mockFs.existsSync).toHaveBeenCalledTimes(1);
        });

        it('calls dotenv.config', () => {
            expect(mockDotEnv.config).toHaveBeenCalledTimes(1);
        });
    });

    describe('without a .env file present', function () {
        beforeEach(() => {
            mockFs = {
                existsSync: function () { return false; }
            };

            mockery.registerMock('fs', mockFs);
            spyOn(mockFs, 'existsSync').and.callThrough();
    
            var envConfig = require('../../../td/config/env.config.js');
            envConfig.tryLoadDotEnv();
        });

        it('checks if ../../.env exists', () => {
            expect(mockFs.existsSync).toHaveBeenCalledTimes(1);
        });

        it('calls dotenv.config', () => {
            expect(mockDotEnv.config).not.toHaveBeenCalled();
        });
    });
});