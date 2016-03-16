'use strict';

describe('shell controller', function () {
    
    var $scope;
    var $controller;
    var $q;
    var $httpBackend;
    var $cookies;
    
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
    
    describe('sign in cookie tests', function() {
        
        beforeEach(function () {
            
            angular.mock.module('app')          
            
            angular.mock.inject(function ($rootScope, $location, _$controller_, _$httpBackend_, _$cookies_) {
                $scope = $rootScope.$new();
                $location.search('suppressbanner', true)
                $controller = _$controller_;
                $httpBackend = _$httpBackend_;
                $httpBackend.expectGET().respond();
                $cookies = _$cookies_;
            });
            
        });
        
        it('should be not logged in (wrong cookie value)', function() {
            
            $cookies.get = function() { return 'not github'; }
            spyOn($cookies, 'get').and.callThrough();
            $controller('shell as vm', { $scope: $scope });
            $scope.$apply();
            
            expect($cookies.get).toHaveBeenCalled();
            expect($cookies.get.calls.argsFor(0)).toEqual(['idp']);
            expect($scope.vm.isLoggedIn).toBe(false);  
            
        })

        it('should be not logged in (null cookie)', function() {
            
            $cookies.get = function() { return null; }
            spyOn($cookies, 'get').and.callThrough();
            $controller('shell as vm', { $scope: $scope });
            $scope.$apply();
            
            expect($cookies.get).toHaveBeenCalled();
            expect($cookies.get.calls.argsFor(0)).toEqual(['idp']);
            expect($scope.vm.isLoggedIn).toBe(false);  
            
        })
        
        it('should be not logged in (undefined cookie)', function() {
            
            $cookies.get = function() { }
            spyOn($cookies, 'get').and.callThrough();
            $controller('shell as vm', { $scope: $scope });
            $scope.$apply();
            
            expect($cookies.get).toHaveBeenCalled();
            expect($cookies.get.calls.argsFor(0)).toEqual(['idp']);
            expect($scope.vm.isLoggedIn).toBe(false);  
            
        })
        
        it('should be logged in', function() {
            
            $cookies.get = function() { return 'github'; }
            spyOn($cookies, 'get').and.callThrough();
            $controller('shell as vm', { $scope: $scope });
            $scope.$apply();
            
            expect($cookies.get).toHaveBeenCalled();
            expect($cookies.get.calls.argsFor(0)).toEqual(['idp']);
            expect($scope.vm.isLoggedIn).toBe(true);  
            
        })
        
    });

});