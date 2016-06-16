'use strict';

describe('shell controller', function () {
    
    //logger mocks
    var mockLogSuccess = jasmine.createSpy('mockLogSuccess');

    var mockLogger = {
        getLogFn: function() { return mockLogSuccess; }
    };

    var mockCommon = {
        logger: mockLogger,
        activateController: function() {}
    }

    //config mocks
    var mockConfig = {
        events: {}
    };

    //scope mocks
    var mockRootScope = {
        $on: function() {}
    };
    var mockScope = {
        $on: function() {}
    };

    
    describe('initialisation', function () {
        
        beforeAll(function () {
            spyOn(mockCommon, 'activateController');
            spyOn(mockScope, '$on');
            spyOn(mockRootScope, '$on');
            var shell = require('../../src/layout/shell')(mockRootScope, mockScope, mockCommon, mockConfig);
        });
         
        it('should log success', function () {
            expect(mockLogSuccess).toHaveBeenCalled();
        });

        it('should call common.activateController',function() {
            expect(mockCommon.activateController).toHaveBeenCalled();
        });

        it('should set the appLoadedflag', function() {
            expect(mockScope.$on.calls.argsFor(0)[0]).toEqual('$viewContentLoaded');
            mockScope.$on.calls.argsFor(0)[1]();
            expect(mockRootScope.appLoaded).toBe(true);
        });

        it('should set the route change start event handler', function() {
            expect(mockRootScope.$on.calls.argsFor(0)[0]).toEqual('$routeChangeStart');
            expect(typeof mockRootScope.$on.calls.argsFor(0)[1]).toEqual('function');
        });
    });
});