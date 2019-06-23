'use strict';

var $ = require('jquery');
require('jasmine-jquery');

describe('threat model report directive: ', function () {

    var $rootScope;
    var $scope;
    var $compile;
    var $httpBackend;
    var elem;

    beforeEach(function () {

        angular.mock.module('owasp-threat-dragon-core');
        angular.mock.inject(function (_$rootScope_, _$compile_, _$httpBackend_) {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            $compile = _$compile_;
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET().respond();
        });

        $rootScope.$apply();

        $scope.loaded = function() { };
        spyOn($scope, 'loaded').and.callThrough();

    });

    it('should call loaded on the scope', function () {

        setFixtures('<tmt-threat-model-report loaded="loaded()">');
        elem = angular.element($('tmt-threat-model-report'));
        $compile(elem)($scope);
        $scope.$digest();
        expect($scope.loaded).toHaveBeenCalled();

    });
});