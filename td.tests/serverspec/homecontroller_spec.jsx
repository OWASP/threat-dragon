'use strict';

require('jasmine');
var path = require('path');
var mockery = require('mockery');
var moduleUnderTest = '../../td/controllers/homecontroller';
mockery.registerAllowable(moduleUnderTest);
mockery.registerAllowable('path');
var homeController = require(moduleUnderTest);

//request/response mocks
var mockRequest = {};
var mockResponse = {};
mockResponse.sendFile = function() {}

describe('homecontroller tests', function() {

    
    beforeEach(function() {
        
        mockery.enable({useCleanCache: true});
        
        spyOn(mockResponse,'sendFile');
        
    });
    
    afterEach(function() {
    
        mockery.disable();
    
    });
    
    it('should send the home page file', function() {
        
        homeController.index(mockRequest,mockResponse);
        expect(mockResponse.sendFile).toHaveBeenCalled();
        expect(mockResponse.sendFile.calls.argsFor(0)[0]).toEqual(path.join(__dirname, '../../td/index.html'));
        
    });
    
});