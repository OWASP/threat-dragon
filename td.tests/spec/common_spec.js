'use strict';

describe('common service', function () {
    
    var common;
    var mockCommonConfig;
    var mockLogger;

    beforeEach(function () {

        mockCommonConfig = {};
        mockLogger = {};

        angular.mock.module('app')

        angular.mock.module(function ($provide) {
            $provide.value('commonConfig', mockCommonConfig);
            $provide.value('logger', mockLogger);
        });

        module('common');

        angular.mock.inject(function ($q, $rootScope, _common_) {
            common = _common_;
        });

        //logger mocks
        mockLogger.getLogFn = function () { };
    });

    describe('utils tests', function () {

        it('string to function should throw for invalid input', function () {

            expect(function () { common.utils.stringToFunction('hello') }).toThrowError(Error);

        });

        it('string to function should return a function for valid input', function () {

            var result = common.utils.stringToFunction('joint.shapes.tm.Process');
            expect(result).toBeDefined();
            expect(typeof result).toEqual('function');

        });

    });

});