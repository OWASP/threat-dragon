'use strict';

//require('angular-mocks');

describe('welcome controller', function () {
    
    var $scope;
    var $controller;
    var $httpBackend;
    var $location;
    
    beforeEach(function () {
        
        angular.mock.module('app');
        
        angular.mock.inject(function ($rootScope, _$controller_, _$location_, _$httpBackend_) {
            $scope = $rootScope.$new();
            $controller = _$controller_;
            $location = _$location_;
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET().respond();
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

    describe('viewmodel tests', function () {

        it('should set the location', function () {
            
            var location = 'threatmodel/mike-goodwin/owasp-threat-dragon-demo/master/Demo Threat Model';
            spyOn($location, 'path');
            $scope.vm.loadDemoModel();

            expect($location.path).toHaveBeenCalled();
            expect($location.path.calls.argsFor(0)).toEqual([location]);

        });
    });
});