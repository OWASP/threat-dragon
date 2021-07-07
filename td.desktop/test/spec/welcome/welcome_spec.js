'use strict';

describe('welcome controller', function () {
    
    var $scope;
    var $controller;
    var $httpBackend;
    var $location;
    var $route;
    var fs = require('fs');
    var mockElectron = {};
    var mockDatacontext = {};
    
    beforeEach(function () {
        
        mockElectron = {
            dialog: {
                open: function() {},
                save: function() {}
            },
            log: {
                error: function() {},
                debug: function() {},
                info: function() {},
                warn: function() {}
            },
            logLevel: 'debug'
        };

        angular.mock.module('app');

        angular.mock.module(function ($provide) {
            $provide.value('electron', mockElectron);
            $provide.value('datacontext', mockDatacontext);
        });
        
        angular.mock.inject(function ($rootScope, _$controller_, _$location_, _$httpBackend_, _$route_) {
            $scope = $rootScope.$new();
            $controller = _$controller_;
            $location = _$location_;
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET().respond();
            $route = _$route_;
        });

        $controller('welcome as vm', { $scope: $scope });
        $scope.$apply();
    });
    
    describe('initialisation tests', function () {

        it('should be defined', function () {
            expect($scope.vm).toBeDefined();
        });
        
        it('should have "Welcome" for its title', function () {
            expect($scope.vm.title).toEqual('Welcome');
        });

        
    });
    
    describe('newmodel tests', function () {

        it('should create a new model file', function() {
            var testFileName = 'test file name';
            var testFilenames = [testFileName];
            mockElectron.dialog.save = function(onSave) {
                onSave(testFilenames);
            }
            
            fs.writeFileSync = function() {};
            spyOn(fs, 'writeFileSync').and.callThrough();
            spyOn($scope, '$apply').and.callThrough();
            spyOn($location, 'path').and.callThrough();
            $scope.vm.openNewModel();

            expect($location.path.calls.count()).toEqual(1);
            expect($location.path()).toEqual('/threatmodel/' + testFileName);
            expect(fs.writeFileSync).toHaveBeenCalled();
            expect($scope.$apply).toHaveBeenCalled();
        });

        it('should not create a new model file - cancel', function() {
            mockElectron.dialog.save = function(onSave, onNoSave) {
                onNoSave();
            }
            
            fs.writeFileSync = function() {};
            spyOn(fs, 'writeFileSync').and.callThrough();
            spyOn($scope, '$apply').and.callThrough();
            spyOn($location, 'path').and.callThrough();
            $scope.vm.openNewModel();

            expect($location.path.calls.count()).toEqual(0);
            expect(fs.writeFileSync).not.toHaveBeenCalled();
            expect($scope.$apply).not.toHaveBeenCalled();
        });

        it('should handle a create file error', function() {
            var testFileName = 'test file name';
            var testFilenames = [testFileName];
            var testError = 'test error';
            mockElectron.dialog.save = function(onSave) {
                onSave(testFilenames);
            }
            
            fs.writeFileSync = function(file, data, options, callback) {
                callback(testError);
            };
            spyOn(fs, 'writeFileSync').and.callThrough();
            spyOn($scope, '$apply').and.callThrough();
            spyOn($location, 'path').and.callThrough();
            $scope.vm.openNewModel();

            expect($location.path.calls.count()).toEqual(0);
            expect(fs.writeFileSync).toHaveBeenCalled();
            expect($scope.$apply).not.toHaveBeenCalled();
        });
    });
    
    describe('viewmodel tests', function () {

        it('should open a model file', function() {
            var testFileName = 'test file name';
            var testFilenames = [testFileName];
            mockElectron.dialog.open = function(f) {
                f(testFilenames);
            }
            
            spyOn($scope, '$apply').and.callThrough();
            spyOn($location, 'path').and.callThrough();
            $scope.vm.openModel();

            expect($location.path.calls.count()).toEqual(2);
            expect($location.path()).toEqual('/threatmodel/' + testFileName);
            expect($scope.$apply).toHaveBeenCalled();
        });

        it('should not open a model file - cancel', function() {
            var testFileName = 'test file name';
            var testFilenames = [testFileName];
            mockElectron.dialog.open = function(f, g) {
                g();
            }
            
            spyOn($scope, '$apply').and.callThrough();
            spyOn($location, 'path').and.callThrough();
            $scope.vm.openModel();

            expect($location.path.calls.count()).toEqual(0);
            expect($scope.$apply).not.toHaveBeenCalled();
        });

        it('should not open a model - reload', function() {
            var testFileName = 'test file name';
            var testFilenames = [testFileName];
            mockElectron.dialog.open = function(f) {
                f(testFilenames);
            }
        
            spyOn($scope, '$apply').and.callThrough();
            spyOn($location, 'path').and.returnValue('/threatmodel/' + testFileName);
            spyOn($route, 'reload').and.callThrough();
            $scope.vm.openModel();
            expect($location.path.calls.count()).toEqual(1);
            expect($scope.$apply).toHaveBeenCalled();
            expect($route.reload).toHaveBeenCalled();
        });
    });
    
    it('should not open a model - test location', function() {
        var testFileName = 'test file name';
        var testFilenames = [testFileName];
        var testLocation = 'test location';
        mockDatacontext.threatModelLocation = testLocation;
        mockElectron.dialog.open = function(f, g) {
            g(testFilenames);
        }
    
        spyOn($scope, '$apply').and.callThrough();
        spyOn($location, 'path').and.returnValue('/threatmodel/file');
        $scope.vm.openModel;
        expect($location.path).not.toHaveBeenCalled();
        expect($scope.$apply).not.toHaveBeenCalled();
        expect(mockDatacontext.threatModelLocation).toEqual(testLocation);
    });
});

