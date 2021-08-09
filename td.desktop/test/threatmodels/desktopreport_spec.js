'use strict';

describe('desktopreport controller', function () {
    
    var $scope;
    var $controller;
    var $httpBackend;
    var $location;
    var $q;
    var common;
    var fsp = require('promise-fs');
    var mockElectron = {
        currentWindow: {
            webContents: {
                print: function() {},
                printToPDF: function() {},
                reload: function() {}
            }
        },
        dialog: {
            printPDF: function() {},
            saveAsPDF: function() {}
        },
        log: {
            error: function() {},
            debug: function() {},
            info: function() {},
            warn: function() {}
        },
        logLevel: 'debug'
    };
    var mockDatacontext = {
        load: function() { return $q.when(null);}
    }
    var mockThreatModelLocator = {
        getModelLocation: function() {}
    }
    
    beforeEach(function () {

        angular.mock.module('app');

        angular.mock.module(function ($provide) {
            $provide.value('electron', mockElectron);
            $provide.value('datacontext', mockDatacontext);
            $provide.value('threatmodellocator', mockThreatModelLocator);
        });
        
        angular.mock.inject(function ($rootScope, _$q_, _$controller_, _$location_, _$httpBackend_, _common_) {
            $scope = $rootScope.$new();
            $q = _$q_;
            $controller = _$controller_;
            $location = _$location_;
            $httpBackend = _$httpBackend_;
            common = _common_;
            $httpBackend.expectGET().respond();
        });
    });
    
    describe('initialisation tests', function () {

        beforeEach(function() {
            $controller('desktopreport as vm', { $scope: $scope });
            $scope.$apply();
        });

        it('should be defined', function () {
            expect($scope.vm).toBeDefined();
        });
        
        it('should have "Threat Model Report" for its title', function () {
            expect($scope.vm.title).toEqual('Threat Model Report');
        });

    });

    describe('viewmodel tests', function () {

        it('should set the loaded flag', function () {
            
            $controller('desktopreport as vm', { $scope: $scope });
            $scope.$apply();
            $scope.vm.loaded = false;
            $scope.vm.onLoaded();
            expect($scope.vm.loaded).toEqual(true);

        });

        it('should load from the datacontext', function() {

            var testModel = 'test model';
            var testLocation = 'test location';
            spyOn(mockDatacontext, 'load').and.returnValue($q.when(testModel));
            spyOn(mockThreatModelLocator, 'getModelLocation').and.returnValue(testLocation);
            $controller('desktopreport as vm', { $scope: $scope });
            $scope.$apply();
            expect(mockDatacontext.load.calls.argsFor(0)[0]).toEqual(testLocation);
            expect($scope.vm.threatModel).toEqual(testModel);
        });

        it('should log an error', function() {

            var testError = new Error('test error');
            var testErrorMessage = 'message';
            testError.data = { message: testErrorMessage };
            var errorLogger = jasmine.createSpy('errorLogger');
            var loggerSpy = spyOn(common.logger, 'getLogFn').and.returnValue(errorLogger);
            $controller('desktopreport as vm', { $scope: $scope });
            $scope.$apply();

            $scope.vm.error = null;
            loggerSpy.calls.reset();
            $scope.vm.onError(testError);
            expect($scope.vm.error).toEqual(testError);
            expect(errorLogger).toHaveBeenCalled();
            expect(errorLogger.calls.argsFor(1)).toEqual([testErrorMessage]);
        });

        describe('PDF tests', function() {

            xit('should log an error', function() {

                var testError = new Error('test error');
                var testErrorMessage = 'message';
                testError.data = { message: testErrorMessage };
                var errorLogger = jasmine.createSpy('errorLogger');
                var loggerSpy = spyOn(common.logger, 'getLogFn').and.returnValue(errorLogger);

                mockElectron.currentWindow.webContents.printToPDF = function(settings, callback) {
                    callback(testError, null);
                };

                var done = jasmine.createSpy('done');
                
                $controller('desktopreport as vm', { $scope: $scope });
                $scope.$apply();
                loggerSpy.calls.reset();
                $scope.vm.savePDF(done);

                expect(done).toHaveBeenCalled();
                expect($scope.vm.error).toEqual(testError);
                expect(errorLogger).toHaveBeenCalled();
                expect(errorLogger.calls.argsFor(1)).toEqual([testErrorMessage]);

            });

            xit('should save the PDF file with default file name', function() {

                var testData = 'data';
                mockElectron.currentWindow.webContents.printToPDF = function(settings, callback) {
                    callback(null, testData);
                };
                var file = 'test';
                mockDatacontext.threatModelLocation = file + '.json';
                var done = jasmine.createSpy('done');
                mockElectron.dialog.saveAsPDF = function(defaultPath, onSave, onCancel) {
                    onSave();
                }
                spyOn(mockElectron.dialog, 'saveAsPDF').and.callThrough();
                spyOn(fsp, 'writeFile').and.returnValue($q.when(null));
                $controller('desktopreport as vm', { $scope: $scope });
                $scope.$apply();
                $scope.vm.savePDF(done);
                $scope.$apply(); //needed to resolve fsp.writefile promise

                expect(done).toHaveBeenCalled();
                expect(fsp.writeFile).toHaveBeenCalled();
                expect(mockElectron.dialog.saveAsPDF).toHaveBeenCalled();
                expect(mockElectron.dialog.saveAsPDF.calls.argsFor(0)[0]).toEqual(file + '.pdf');

            });

            xit('should save the PDF file with no default file name', function() {

                var testData = 'data';
                mockElectron.currentWindow.webContents.printToPDF = function(settings, callback) {
                    callback(null, testData);
                };
                var done = jasmine.createSpy('done');
                mockElectron.dialog.saveAsPDF = function(defaultPath, onSave, onCancel) {
                    onSave();
                }
                if (mockDatacontext.threatModelLocation) {
                    delete mockDatacontext.threatModelLocation;
                }
                spyOn(mockElectron.dialog, 'saveAsPDF').and.callThrough();
                spyOn(fsp, 'writeFile').and.returnValue($q.when(null));
                $controller('desktopreport as vm', { $scope: $scope });
                $scope.$apply();
                $scope.vm.savePDF(done);
                $scope.$apply(); //needed to resolve fsp.writefile promise

                expect(done).toHaveBeenCalled();
                expect(fsp.writeFile).toHaveBeenCalled();
                expect(mockElectron.dialog.saveAsPDF).toHaveBeenCalled();
                expect(mockElectron.dialog.saveAsPDF.calls.argsFor(0)[0]).toBeNull();

            });

            xit('should set the PDF options', function() {

                spyOn(mockElectron.currentWindow.webContents, 'printToPDF');
                $controller('desktopreport as vm', { $scope: $scope });
                $scope.$apply();
                $scope.vm.savePDF();

                expect(mockElectron.currentWindow.webContents.printToPDF).toHaveBeenCalled();
                var optionsFn = mockElectron.currentWindow.webContents.printToPDF.calls.argsFor(0)[0];
                var options = optionsFn();
                expect(options.landscape).toEqual(false);
                expect(options.marginsType).toEqual(0);
                expect(options.printBackground).toEqual(false);
                expect(options.printSelectionOnly).toEqual(false);
                expect(options.pageSize).toEqual('A4');
            });

            xit('should not save the PDF file on cancel', function() {

                var testData = 'data';
                mockElectron.currentWindow.webContents.printToPDF = function(settings, callback) {
                    callback(null, testData);
                };
                var done = jasmine.createSpy('done');
                mockElectron.dialog.saveAsPDF = function(defaultPath, onSave, onCancel) {
                    onCancel();
                }
                $controller('desktopreport as vm', { $scope: $scope });
                $scope.$apply();
                $scope.vm.savePDF(done);

                expect(done).toHaveBeenCalled();
            });

            xit('should not save the PDF file on null path', function() {

                var testData = 'data';
                var nullPath;
                mockElectron.currentWindow.webContents.printToPDF = function(settings, callback) {
                    callback(null, testData);
                };
                var done = jasmine.createSpy('done');
                mockElectron.dialog.saveAsPDF = function(nullPath, onSave, onCancel) {
                    onCancel();
                }
                $controller('desktopreport as vm', { $scope: $scope });
                $scope.$apply();
                $scope.vm.savePDF(done);

                expect(done).toHaveBeenCalled();
            });

            it('should print the PDF file', function() {

                var logSuccess = spyOn(common.logger, 'logSuccess');
                var logError = spyOn(common.logger, 'logError');
                mockElectron.currentWindow.webContents.print = function(settings, callback) {
                    callback(true);
                };
                var done = jasmine.createSpy('done');
                $controller('desktopreport as vm', { $scope: $scope });
                $scope.vm.printPDF(done);

                expect(logSuccess).toHaveBeenCalled();
                expect(logError).not.toHaveBeenCalled();
                expect(done).toHaveBeenCalled();
            });

            it('should handle a print PDF error', function() {

                var logSuccess = spyOn(common.logger, 'logSuccess');
                var logError = spyOn(common.logger, 'logError');
                mockElectron.currentWindow.webContents.print = function(settings, callback) {
                    callback(false);
                };
                var done = jasmine.createSpy('done');
                $controller('desktopreport as vm', { $scope: $scope });
                $scope.vm.printPDF(done);

                expect(logSuccess).not.toHaveBeenCalled();
                expect(logError).toHaveBeenCalled();
                expect(done).toHaveBeenCalled();
            });
        });
    });
});
