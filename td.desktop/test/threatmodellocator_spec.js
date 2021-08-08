'use strict';

require('angular-mocks');

describe('threatmodellocator service:', function () {

    var threatmodellocator;
    var $rootScope;

    beforeEach(function () {

        angular.mock.module('app');

        angular.mock.inject(function (_$rootScope_, _threatmodellocator_) {
            $rootScope = _$rootScope_;
            threatmodellocator = _threatmodellocator_;
        });

        $rootScope.$apply();
    });

    it('should return the new model location', function () {
        expect(threatmodellocator.newModelLocation).toEqual('/threatmodel/new');
    });

    it('should return a file name from an encoded one', function () {

        var file = 'c:\\dir\\file name.json';
        var encoded = btoa(file);

        var params = {
            location: encoded
        };

        var location = threatmodellocator.getModelLocation(params);
        expect(location).toEqual(file);
    });

    it('should return a file name', function () {

        var file = 'c:\\dir\\file name.json';

        var params = {
            location: file
        };

        var location = threatmodellocator.getModelLocation(params);
        expect(location).toEqual(file);
    });

    it('should return encoded values unchanged', function () {

        var file = 'c:\\dir\\file name.json';
        var encoded = btoa(file);

        expect(threatmodellocator.getModelPath(encoded)).toEqual(encoded);
    });

    it('should encoded values that look unencoded', function () {

        var file = 'c:\\dir\\file name.json';
        var encoded = btoa(file);

        expect(threatmodellocator.getModelPath(file)).toEqual(encoded);
    });

    it('should return encoded route params location unchanged', function () {

        var file = 'c:\dir\file name.json';
        var encoded = encodeURI(file);

        var params = {
            location: encoded
        };

        expect(threatmodellocator.getModelPathFromRouteParams(params)).toEqual(encoded);
    });

    it('should encoded unencoded route params location', function () {

        var file = 'c:\\dir\\file name.json';
        var encoded = btoa(file);

        var params = {
            location: file
        };

        expect(threatmodellocator.getModelPathFromRouteParams(params)).toEqual(encoded);
    });

    it('should not move the threat model', function() {

        expect(threatmodellocator.willMoveModel()).toBeFalsy();

    });
});
