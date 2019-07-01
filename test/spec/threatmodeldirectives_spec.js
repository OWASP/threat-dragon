'use strict';

var $ = require('jquery');
require('jasmine-jquery');

describe('threat model report directive: ', function () {

    var $rootScope;
    var $scope;
    var $compile;
    var $httpBackend;
    var $routeParams;
    var $location;
    var mockThreatModelLocator = {};
    var elem;

    beforeEach(function () {

        angular.mock.module('owasp-threat-dragon-core');
        angular.mock.module(function ($provide) {
            $provide.value('threatmodellocator', mockThreatModelLocator);
        });
        angular.mock.inject(function (_$rootScope_, _$compile_, _$httpBackend_, _$routeParams_, _$location_) {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            $compile = _$compile_;
            $location = _$location_;
            $routeParams = _$routeParams_;
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET().respond();
        });

        $rootScope.$apply();

        $scope.loaded = function() { };
        spyOn($scope, 'loaded').and.callThrough();

        $scope.save = function() {};
        spyOn($scope, 'save').and.callThrough();    
        
        $scope.print = function() {};
        spyOn($scope, 'print').and.callThrough();  
    });

    it('should call loaded on the scope', function () {

        setFixtures('<tmt-threat-model-report loaded="loaded()">');
        elem = angular.element($('tmt-threat-model-report'));
        $compile(elem)($scope);
        $scope.$digest();
        expect($scope.loaded).toHaveBeenCalled();

    });

    it('should set the model', function() {

        var testModelTitle = 'test model title';
        var testModel = {
            summary: {
                title: testModelTitle
            }
        };
        $scope.testModel = testModel;
        setFixtures('<tmt-threat-model-report loaded="loaded()" model="testModel">');
        elem = angular.element($('tmt-threat-model-report'));
        $compile(elem)($scope);
        $scope.$digest();

        var titleElement = $(elem).find('#titleText');
        expect(titleElement.text().search(testModelTitle)).toBeGreaterThan(-1);

    });
    
    it('should save the report', function() {

        var testModelTitle = 'test model title';
        var testModel = {
            summary: {
                title: testModelTitle
            }
        };
        $scope.testModel = testModel;
        setFixtures('<tmt-threat-model-report loaded="loaded()" model="testModel" save="save(done)">');
        elem = angular.element($('tmt-threat-model-report'));
        $compile(elem)($scope);
        $scope.$digest();

        angular.element($('#savePDFButton')).triggerHandler('click');
        expect($scope.save).toHaveBeenCalled();
        //hide the buttons for saving
        expect($(elem).find('#savePDFButton').length).toEqual(0);
        //reshow the buttons once saved
        $scope.save.calls.argsFor(0)[0]();
        expect($(elem).find('#savePDFButton').length).toEqual(1);

    })

    it('should print the report', function() {

        var testModelTitle = 'test model title';
        var testModel = {
            summary: {
                title: testModelTitle
            }
        };
        $scope.testModel = testModel;
        setFixtures('<tmt-threat-model-report loaded="loaded()" model="testModel" print="print(done)">');
        elem = angular.element($('tmt-threat-model-report'));
        $compile(elem)($scope);
        $scope.$digest();

        angular.element($('#printButton')).triggerHandler('click');
        expect($scope.print).toHaveBeenCalled();
        //hide the buttons for printing
        expect($(elem).find('#printButton').length).toEqual(0);
        //reshow the buttons once printed
        $scope.print.calls.argsFor(0)[0]();
        expect($(elem).find('#printButton').length).toEqual(1);

    })

    it('should cancel the report and return to the model detail page', function() {

        var testModelTitle = 'test model title';
        var testModel = {
            summary: {
                title: testModelTitle
            }
        };
        $scope.testModel = testModel;
        setFixtures('<tmt-threat-model-report loaded="loaded()" model="testModel">');
        elem = angular.element($('tmt-threat-model-report'));
        $compile(elem)($scope);
        $scope.$digest();
        var testPath = 'test path';
        mockThreatModelLocator.getModelPathFromRouteParams = function() {
            return testPath;
        }
        spyOn($location, 'path');
        angular.element($('#cancelButton')).triggerHandler('click');
        expect($location.path.calls.argsFor(0)).toEqual(['/threatmodel/' + testPath])

    })

    it('should cancel the report and return to the welcome', function() {

        var testModelOwner = 'test owner';
        var testModel = {
            summary: {
                owner: testModelOwner
            }
        };
        $scope.testModel = testModel;
        setFixtures('<tmt-threat-model-report loaded="loaded()" model="testModel">');
        elem = angular.element($('tmt-threat-model-report'));
        $compile(elem)($scope);
        $scope.$digest();
        var testPath = 'test path';
        mockThreatModelLocator.getModelPathFromRouteParams = function() {
            return testPath;
        }
        spyOn($location, 'path');
        angular.element($('#cancelButton')).triggerHandler('click');
        expect($location.path.calls.argsFor(0)).toEqual(['/'])

    })

});