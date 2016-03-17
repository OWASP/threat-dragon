'use strict';
var Jasmine = require('jasmine');
var mockery = require('mockery');
var moduleUnderTest = '../../td/routes/index';
mockery.registerAllowable(moduleUnderTest);
mockery.registerAllowable('path');
var router;

//express mockery

var mockRouter = {};
mockRouter.get = function() {};

var mockExpress = {};
mockExpress.Router = function() { return mockRouter; };

mockery.registerMock('express', mockExpress);

describe('routing tests', function() {
    
    beforeEach(function() {
        
        mockery.enable({useCleanCache: true});
        spyOn(mockRouter, 'get');
        router = require(moduleUnderTest);
        
    });
    
    afterEach(function() {
    
        mockery.disable();
    
    });
    
    it('should set the default get route', function() {
        
        expect(mockRouter.get).toHaveBeenCalled();
        expect(mockRouter.get.calls.argsFor(0)[0]).toEqual('/');
        
    });
    
});