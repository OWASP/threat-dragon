'use strict';

require('jasmine');
var path = require('path');
var mockery = require('mockery');
var moduleUnderTest = '../../../td.server/controllers/homecontroller';
mockery.registerAllowable(moduleUnderTest);
mockery.registerAllowable('path');
var homeController = require(moduleUnderTest);

describe('homecontroller tests', function() {
    
    var mockRequest;
    var mockResponse;
    var testUser = 'test user';

    beforeEach(function() {
        
        mockery.enable({useCleanCache: true});
        mockery.warnOnUnregistered(false);
        //request/response mocks
        mockRequest = {};
        mockRequest.log = {info: function() {}};
        mockRequest.csrfToken = function() { };
        mockRequest.logOut = function() { };
        mockRequest.user = {profile: {username: testUser}};
        mockRequest.session = {
            destroy: function() { }
        };
        
        mockResponse = {};
        mockResponse.sendFile = function() {};
        mockResponse.cookie = function() {};
        mockResponse.clearCookie = function() {};
        mockResponse.render = function() {};
        mockResponse.redirect = function() {};
    });
    
    afterEach(function() {
    
        mockery.disable();
    
    });
    
    afterAll(function() {
        mockery.deregisterAll();
    });
    
    it('should send the home page file', function() {
        
        spyOn(mockResponse,'sendFile');
        homeController.index(mockRequest,mockResponse);
        expect(mockResponse.sendFile).toHaveBeenCalled();
        expect(mockResponse.sendFile.calls.argsFor(0)[0]).toEqual(path.join(__dirname, '../../../td.site/index.html')); 
    });
    
    it('should set the csrf cookie', function() {
        
        var testToken = 'test token'
        spyOn(mockResponse, 'cookie');
        spyOn(mockRequest, 'csrfToken').and.returnValue(testToken);
        homeController.index(mockRequest, mockResponse);
        expect(mockResponse.cookie.calls.argsFor(0)).toEqual(['XSRF-TOKEN', testToken, { httpOnly: false }])
    });
    
    it('should log the insecure csrf cookie', function() {
        
        var testToken = 'test token'
        spyOn(mockRequest, 'csrfToken').and.returnValue(testToken);
        var logger = require('../../../td.server/config/loggers.config').logger;
        spyOn(logger, 'error');
        homeController.index(mockRequest, mockResponse);
        expect(logger.error.calls.argsFor(0)[0].security).toBe(true);
    });
    
    it('should pass the csrf token to the login page', function() {
        
        var testToken = 'test token'
        spyOn(mockResponse, 'render');
        spyOn(mockRequest, 'csrfToken').and.returnValue(testToken);
        homeController.login(mockRequest, mockResponse);
        expect(mockResponse.render.calls.argsFor(0)[0]).toEqual('login');
        expect(mockResponse.render.calls.argsFor(0)[1].csrfToken).toEqual(testToken);
    });
    
    it('should pass the csrf token and username to the logout form', function() {
        
        var testToken = 'test token'
        spyOn(mockResponse, 'render');
        spyOn(mockRequest, 'csrfToken').and.returnValue(testToken);
        var testUser = 'test user';
        mockRequest.user = {profile: {username: testUser}};
        homeController.logoutform(mockRequest, mockResponse);
        expect(mockResponse.render.calls.argsFor(0)[0]).toEqual('logoutform');
        expect(mockResponse.render.calls.argsFor(0)[1].csrfToken).toEqual(testToken);
        expect(mockResponse.render.calls.argsFor(0)[1].username).toEqual(testUser);
    });
    
    it('should clear the csrf and session cookies', function() {
      
      spyOn(mockResponse, 'clearCookie');
      homeController.logout(mockRequest, mockResponse);
      expect(mockResponse.clearCookie.calls.argsFor(0)).toEqual(['connect.sid']);
      expect(mockResponse.clearCookie.calls.argsFor(1)).toEqual(['XSRF-TOKEN']);
    });
    
    it('should destroy the session', function() {
      
      spyOn(mockRequest.session, 'destroy');
      homeController.logout(mockRequest, mockResponse);
      expect(mockRequest.session.destroy).toHaveBeenCalled();
    });  
     
    it('should write the logout to the log and redirect', function() {
      
      mockRequest.session.destroy = function(cb) {
          cb();
      };
      
      spyOn(mockResponse, 'redirect');
      spyOn(mockRequest.log, 'info');
      homeController.logout(mockRequest, mockResponse);
      expect(mockResponse.redirect.calls.argsFor(0)).toEqual(['/']);
      expect(mockRequest.log.info.calls.argsFor(0)[0].security).toBe(true);
      expect(mockRequest.log.info.calls.argsFor(0)[0].userName).toEqual(testUser);
    });
    
    describe('simulated production environment tests', function() {
        
        beforeAll(function() {
            process.env.NODE_ENV = 'simulated_production' 
        });
        
        afterAll(function() {
            process.env.NODE_ENV = 'development'
        });
        
        it('should set the secure flag on the XSRF cookie', function() {
     
            var testToken = 'test token'
            spyOn(mockResponse, 'cookie');
            spyOn(mockRequest, 'csrfToken').and.returnValue(testToken);
            homeController.index(mockRequest, mockResponse);
            expect(mockResponse.cookie.calls.argsFor(0)).toEqual(['XSRF-TOKEN', testToken, { httpOnly: false, secure: true }])
            
        });
        
    });
    
});