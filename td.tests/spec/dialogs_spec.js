'use strict';

var dialogs;
var $rootScope;
var $httpBackend;
var $location;
var $modal;

describe('dialogs service:', function () {

    beforeEach(function () {

        angular.mock.module('app');
        angular.mock.inject(function (_$rootScope_, _$httpBackend_, _$location_, _$modal_, _dialogs_) {
            dialogs = _dialogs_;
            $rootScope = _$rootScope_;
            $location = _$location_;
            $modal = _$modal_;
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET().respond();
        });

        $rootScope.$apply();
    });

    it('should expose two functions', function () {

        expect(dialogs.confirm instanceof Function).toBe(true);
        expect(dialogs.stucturedExit instanceof Function).toBe(true);

    });
});