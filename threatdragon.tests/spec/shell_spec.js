'use strict';

describe('shell controller', function () {
    
    var $scope;
    var $controller;
    var $q;
    var $httpBackend;
    
    describe('tests with banner', function () {
        
        beforeEach(function () {
            
            angular.mock.module('app');
             
            angular.mock.inject(function ($rootScope, _$controller_, _$httpBackend_) {
                $scope = $rootScope.$new();
                $controller = _$controller_;
                $httpBackend = _$httpBackend_;
                $httpBackend.expectGET().respond();
            });
            
            $controller('shell as vm', { $scope: $scope });
            $scope.$apply();
        });
        
        it('should be defined', function () {
            expect($scope.vm).toBeDefined();
        });

        it('should have a banner', function () {
            expect($scope.vm.suppressBanner).not.toBe(true);
        });

    });

    describe('tests with no banner', function () {
        
        beforeEach(function () {
            
            angular.mock.module('app')          
            
            angular.mock.inject(function ($rootScope, $location, _$controller_, _$httpBackend_) {
                $scope = $rootScope.$new();
                $location.search('suppressbanner', true)
                $controller = _$controller_;
                $httpBackend = _$httpBackend_;
                $httpBackend.expectGET().respond();
            });
            
            $controller('shell as vm', { $scope: $scope });
            $scope.$apply();
        });
        
        it('should be defined', function () {
            expect($scope.vm).toBeDefined();
        });
        
        it('should not have a banner', function () {
            expect($scope.vm.suppressBanner).toBe(true);
        });

    });
    


});