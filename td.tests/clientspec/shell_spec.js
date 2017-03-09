'use strict';

require('angular-mocks');

describe('shell controller', function () {

    var $scope;
    var $controller;
    var $q;
    var $httpBackend;

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