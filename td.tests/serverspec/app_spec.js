'use strict';


describe('app tests', function() {
    
    var mockery = require('mockery');
    var request = require('supertest');
    var finish_test = require('./supertest-jasmine');

    //bunyan mockery
    var mockLogger = {
        info: function() {},
        error: function() {}
    };

    var mockBunyan = {
        createLogger: function() { 
            return mockLogger;
        }
    };
    
    //skip session config and passport config here since it need LOADS of mocking
    var mockSessionConfig = function() { };
    var mockPassportConfig = function() { };
    var mockEnvConfig = {
        tryLoadDotEnv: function () {}
    };
    
    beforeEach(function() {
        mockery.enable({ useCleanCache: true });
        mockery.warnOnUnregistered(false);
        mockery.warnOnReplace(false);
        mockery.registerMock('bunyan', mockBunyan);
        mockery.registerMock('./config/session.config', mockSessionConfig);
        mockery.registerMock('./config/passport.config', mockPassportConfig);
        mockery.registerMock('./config/env.config', mockEnvConfig);
    });
    
    afterEach(function() {
        mockery.disable();
    });
    
    it('should not throw', function() {
        expect(function() { require('../../td.server/app')}).not.toThrow();  
    });
    
    it('should log a startup message', function() {
        
        spyOn(mockBunyan, 'createLogger').and.callThrough();
        spyOn(mockLogger, 'info');
        spyOn(mockLogger, 'error');
        require('../../td.server/app');
        expect(mockBunyan.createLogger.calls.argsFor(0)).toEqual([{name: 'threatdragon', level: 'info'}]);
        expect(mockLogger.info).toHaveBeenCalled();
        expect(mockLogger.error).not.toHaveBeenCalled();
    });
    
    it('should log an error on startup message', function() {
        
        spyOn(mockBunyan, 'createLogger').and.callThrough();
        spyOn(mockLogger, 'info').and.throwError('error');
        spyOn(mockLogger, 'error');
        require('../../td.server/app');
        expect(mockLogger.error.calls.argsFor(1)).toEqual(['error']);
    });
    
    it('should fetch the favicon',function(done) {
        
        var app = require('../../td.server/app');
        request(app)
        .get('/favicon.ico')
        .expect(200)
        .end(finish_test(done));
        
    });

    it('should attempt to load configuration from .env', function () {
        spyOn(mockEnvConfig, 'tryLoadDotEnv');
        require('../../td.server/app');
        expect(mockEnvConfig.tryLoadDotEnv).toHaveBeenCalledTimes(1);
    });
});



