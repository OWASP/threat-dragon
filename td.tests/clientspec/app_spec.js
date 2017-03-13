'use strict';

require('angular-mocks');

var $rootScope;
var $httpBackend;
var mockLocation;

describe('app module', function() {
    
    beforeEach(function () {

        mockLocation = { id: 'mock location' };
        angular.mock.module('app');
        angular.mock.module(function ($provide) {
            $provide.value('$location', mockLocation);
        });

        angular.mock.inject(function (_$rootScope_, _$httpBackend_) {
            $rootScope = _$rootScope_;
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET().respond();
        });

        $rootScope.$apply();

    });
    
    it('should set the location on the root scope', function() {
       
       expect($rootScope.location).toEqual(mockLocation);
        
    });
    
});

