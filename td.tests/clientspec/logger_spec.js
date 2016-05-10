'use strict';

var logger;
var $rootScope;
var $httpBackend;
var mockLog;

var logMessage = 'message';
var logSource = 'source';
var logData = 'data';

describe('logger service:', function () {

    beforeEach(function () {

        mockLog = {};

        angular.mock.module('app');

        angular.mock.module(function ($provide) {
            $provide.value('$log', mockLog);
        });

        angular.mock.inject(function (_$rootScope_, _$httpBackend_, _logger_) {
            logger = _logger_;
            $rootScope = _$rootScope_;
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET().respond();
        });

        $rootScope.$apply();

        //$log mocks
        mockLog.log = function () { };
        spyOn(mockLog, 'log');
        mockLog.error = function () { };
        spyOn(mockLog, 'error');
    });

    describe('log tests:', function () {

        it('getLogFn should return a log function', function () {

            var logFn = logger.getLogFn();
            expect(logFn).toBeDefined();
            expect(typeof logFn).toEqual('function');
        });

        it('getLogFn with invalid log type should return a log function', function () {

            var logFn = logger.getLogFn('source', 'invalid');
            expect(logFn).toBeDefined();
            expect(typeof logFn).toEqual('function');
        });

        it('getLogFn(success) should return a function', function () {

            var logFn = logger.getLogFn('success');
            expect(logFn).toBeDefined();
            expect(typeof logFn).toEqual('function');
        });

        it('getLogFn(error) should return a function', function () {

            var logFn = logger.getLogFn('error');
            expect(logFn).toBeDefined();
            expect(typeof logFn).toEqual('function');
        });

        it('getLogFn(warn) should return a function', function () {

            var logFn = logger.getLogFn('source', 'warn');
            expect(logFn).toBeDefined();
            expect(typeof logFn).toEqual('function');
        });

        it('getLogFn(warning) should return a function', function () {

            var logFn = logger.getLogFn('source', 'warning');
            expect(logFn).toBeDefined();
            expect(typeof logFn).toEqual('function');
        });

        it('log should log a message', function () {

            var localLogMessage = logMessage + 'log';
            var localLogData = logData + 'log';
            var localLogSource = logSource + 'log';

            logger.log(localLogMessage, localLogData, localLogSource);
            logger.log(localLogMessage, localLogData, localLogSource, true);
            expect(mockLog.log).toHaveBeenCalled();
            expect(mockLog.log.calls.argsFor(0)).toEqual(['[' + localLogSource + '] ', localLogMessage, localLogData]);
            expect(mockLog.log.calls.argsFor(1)).toEqual(['[' + localLogSource + '] ', localLogMessage, localLogData]);

        });

        it('log with no source should log a message', function () {

            var localLogMessage = logMessage + 'log';
            var localLogData = logData + 'log';

            logger.log(localLogMessage, localLogData);
            expect(mockLog.log).toHaveBeenCalled();
            expect(mockLog.log.calls.argsFor(0)).toEqual(['', localLogMessage, localLogData]);

        });

        it('logSuccess should log a success message', function () {

            var localLogMessage = logMessage + 'success';
            var localLogData = logData + 'success';
            var localLogSource = logSource + 'success';

            logger.logSuccess(localLogMessage, localLogData, localLogSource);
            logger.logSuccess(localLogMessage, localLogData, localLogSource, true);
            expect(mockLog.log).toHaveBeenCalled();
            expect(mockLog.log.calls.argsFor(0)).toEqual(['[' + localLogSource + '] ', localLogMessage, localLogData]);
            expect(mockLog.log.calls.argsFor(1)).toEqual(['[' + localLogSource + '] ', localLogMessage, localLogData]);
        });

        it('logWarning should log a  warning message', function () {

            var localLogMessage = logMessage + 'warning';
            var localLogData = logData + 'warning';
            var localLogSource = logSource + 'warning';

            logger.logWarning(localLogMessage, localLogData, localLogSource);
            logger.logWarning(localLogMessage, localLogData, localLogSource, true);
            expect(mockLog.log).toHaveBeenCalled();
            expect(mockLog.log.calls.argsFor(0)).toEqual(['[' + localLogSource + '] ', localLogMessage, localLogData]);
            expect(mockLog.log.calls.argsFor(1)).toEqual(['[' + localLogSource + '] ', localLogMessage, localLogData]);
        });

        it('logError should log an error message', function () {

            var localLogMessage = logMessage + 'error';
            var localLogData = logData + 'error';
            var localLogSource = logSource + 'error';

            logger.logError(localLogMessage, localLogData, localLogSource);
            logger.logError(localLogMessage, localLogData, localLogSource, true);
            expect(mockLog.error).toHaveBeenCalled();
            expect(mockLog.error.calls.argsFor(0)).toEqual(['[' + localLogSource + '] ', localLogMessage, localLogData]);
            expect(mockLog.error.calls.argsFor(1)).toEqual(['[' + localLogSource + '] ', localLogMessage, localLogData]);
        });

    });

});