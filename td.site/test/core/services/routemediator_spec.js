'use strict';

describe('routemediator service:', function () {

    var mockLogger;
    var mockConfig;
    var mockRootScope;
    var mockLocation;
    var routeMediator;
    var current;

    beforeAll(function () {

        //logger mocks
        mockLogger = {};
        mockLogger.logWarning = function () { };
        spyOn(mockLogger, 'logWarning');

        //config mocks
        mockConfig = {};
        mockConfig.docTitle = 'docTitle';

        //mock $rootScope
        mockRootScope = {};
        mockRootScope.$on = function (event, cb) {
            cb(null, current, null, null);
        };

        //mock $location
        mockLocation = {};
        mockLocation.path = function () { };

        routeMediator = require('/td.site/src/app/core/services/routemediator')(mockRootScope, mockLocation, mockConfig, mockLogger);

        current = { name: 'testName', title: 'testTitle' };

    });

    describe('tests:', function () {

        it('route error should log warning and set location.path to /', function () {

            var errorMessage = 'Error routing: ' + current.name;
            spyOn(mockLocation, 'path');
            routeMediator.setRoutingHandlers();
            expect(mockLogger.logWarning).toHaveBeenCalled();
            expect(mockLogger.logWarning.calls.argsFor(0)).toEqual([errorMessage, current, 'routemediator', true]);
            expect(mockLocation.path.calls.argsFor(0)).toEqual(['/']);

        });

        it('route change success should set document title', function () {

            var docTitle = 'docTitle ' + current.title;
            routeMediator.setRoutingHandlers();
            expect(mockRootScope.title).toEqual(docTitle);

        });
    });
});
