'use strict';

require('jasmine');
var path = require('path');
var mockery = require('mockery');
var moduleUnderTest = '../../td/controllers/homecontroller';
mockery.registerAllowable(moduleUnderTest);
mockery.registerAllowable('path');
var homeController = require(moduleUnderTest);


describe('homecontroller tests', function() {
    
    var mockRequest;
    var mockResponse;

    beforeEach(function() {
        
        mockery.enable({useCleanCache: true});
        //request/response mocks
        mockRequest = {};
        mockRequest.csrfToken = function() { };
        mockResponse = {};
        mockResponse.sendFile = function() {};
        mockResponse.cookie = function() {};
    });
    
    afterEach(function() {
    
        mockery.disable();
    
    });
    
    it('should send the home page file', function() {
        
        spyOn(mockResponse,'sendFile');
        homeController.index(mockRequest,mockResponse);
        expect(mockResponse.sendFile).toHaveBeenCalled();
        expect(mockResponse.sendFile.calls.argsFor(0)[0]).toEqual(path.join(__dirname, '../../td/index.html'));
        
    });
    
    it('should set the csrf cookie', function() {
        
        var testToken = 'test token'
        spyOn(mockResponse, 'cookie');
        spyOn(mockRequest, 'csrfToken').and.returnValue(testToken);
        homeController.index(mockRequest, mockResponse);
        expect(mockResponse.cookie.calls.argsFor(0)).toEqual(['XSRF-TOKEN', testToken, { httpOnly: false }])
    });
    
});