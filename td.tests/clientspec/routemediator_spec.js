'use strict';

var routemediator;
var $rootScope;
var $httpBackend;
var $location;
var mockLogger;
var mockConfig;

describe('routemediator service:', function () {

    beforeEach(function () {

        mockLogger = {};
        mockConfig = {};

        angular.mock.module('app');

        angular.mock.module(function ($provide) {
            $provide.value('logger', mockLogger);
            $provide.value('config', mockConfig);
        });

        angular.mock.inject(function (_$rootScope_, _$httpBackend_, _$location_, _routemediator_) {
            routemediator = _routemediator_;
            $rootScope = _$rootScope_;
            $location = _$location_;
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET().respond();
        });

        $rootScope.$apply();

        //logger mocks
        mockLogger.logWarning = function () { };
        spyOn(mockLogger, 'logWarning');

        //config mocks
        mockConfig.docTitle = 'docTitle';

    });

    describe('tests:', function () {

        it('route error should log warning and set location.path to /', function () {

            var current = {name: 'name'};
            var errorMessage = 'Error routing: ' + current.name;
            spyOn($location, 'path');
            $rootScope.$emit('$routeChangeError', current);

            expect(mockLogger.logWarning).toHaveBeenCalled();
            expect(mockLogger.logWarning.calls.argsFor(0)).toEqual([errorMessage, current, 'routemediator', true]);
            expect($location.path.calls.argsFor(0)).toEqual(['/']);

        });

        it('route change success should set document title', function () {

            $rootScope.$emit('$routeChangeSuccess', { title: 'title' });
            expect($rootScope.title).toEqual('docTitle title');

        });

    });

});