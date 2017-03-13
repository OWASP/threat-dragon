'use strict';

require('angular-mocks');
var $ = require('jquery');

describe('dialogs service:', function () {

    var dialogs;
    var $rootScope;
    var $httpBackend;
    var $location;
    var $modal;
    var $timeout;
    var $q;
    var common;
    var mockCommon;
    var mockDatacontext;
    var logError;

    beforeEach(function () {

        logError = jasmine.createSpy('logError');
        mockCommon = {
            logger: {
                getLogFn: function () { return logError; }
            }
        };

        angular.mock.module('app');
        angular.mock.module(function ($provide) {
            $provide.value('datacontext', mockDatacontext);
            $provide.value('common', mockCommon);
        });

        mockDatacontext = {};
        mockDatacontext.repos = function () { return $q.when({ data: ['org/repo'] }); };
        mockDatacontext.branches = function () { return $q.when({ data: ['branch'] }); };
        angular.mock.module('./public/app/layout/structuredExit.html');
        angular.mock.inject(function (_$rootScope_, _$q_, _$httpBackend_, _$location_, _$uibModal_, _$timeout_, _dialogs_, _common_) {
            dialogs = _dialogs_;
            $rootScope = _$rootScope_;
            $location = _$location_;
            $modal = _$uibModal_;
            $timeout = _$timeout_;
            $q = _$q_;
            common = _common_;
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET().respond();
        });

        $rootScope.$apply();
    });

    it('should expose two functions', function () {

        expect(dialogs.confirm instanceof Function).toBe(true);
        expect(dialogs.structuredExit instanceof Function).toBe(true);

    });

    describe('structured exit tests: ', function () {

        var callbacks;
        var event;

        beforeEach(function () {

            callbacks = {};
            callbacks.cancelNavigation = function () { };
            callbacks.continueNavigation = function () { };
            event = document.createEvent('CustomEvent');
            event.initCustomEvent('dummy', false, false, null);
            event.preventDefault = function () { };
            spyOn(event, 'preventDefault');
            spyOn(callbacks, 'cancelNavigation');
            spyOn(callbacks, 'continueNavigation');
            spyOn($location, 'path').and.callThrough();

        });

        afterEach(function () {

            angular.element($('#structuredExitModal')).remove();

        });

        it('should continue navigation', function (done) {

            dialogs.structuredExit(event, callbacks.cancelNavigation, callbacks.continueNavigation).then(function () {

                expect(callbacks.cancelNavigation).not.toHaveBeenCalled();
                expect(callbacks.continueNavigation).toHaveBeenCalled();
                expect(event.preventDefault).toHaveBeenCalled();
                expect($location.path).toHaveBeenCalled();
                expect($location.path.calls.allArgs()).toEqual([[], ['/']]);
                done();

            });

            $rootScope.$apply();
            angular.element($('#buttonOK')).triggerHandler('click');
        });

        it('should cancel navigation', function (done) {

            dialogs.structuredExit(event, callbacks.cancelNavigation, callbacks.continueNavigation).catch(function () {

                expect(callbacks.cancelNavigation).toHaveBeenCalled();
                expect(callbacks.continueNavigation).not.toHaveBeenCalled();
                expect(event.preventDefault).toHaveBeenCalled();
                expect($location.path.calls.allArgs()).toEqual([[]]);
                done();

            });

            $rootScope.$apply();
            angular.element($('#buttonCancel')).triggerHandler('click');
        });
    });

    describe('confirm tests: ', function () {

        var callbacks;

        beforeEach(function () {

            callbacks = {};
            callbacks.cancelPreClose = function () { };
            callbacks.okPreClose = function () { };
            callbacks.getParameter = function () { };
            spyOn(callbacks, 'cancelPreClose');
            spyOn(callbacks, 'okPreClose');
            spyOn(callbacks, 'getParameter');

        });

        afterEach(function () {

            angular.element($('#structuredExitModal')).remove();

        });

        it('should call ok', function (done) {

            dialogs.confirm('./public/app/layout/structuredExit.html', callbacks.okPreClose, callbacks.getParameter, callbacks.cancelPreClose).then(function () {

                expect(callbacks.cancelPreClose).not.toHaveBeenCalled();
                expect(callbacks.okPreClose).toHaveBeenCalled();
                done();

            });

            $rootScope.$apply();
            angular.element($('#buttonOK')).triggerHandler('click');
        });

        it('should assign the requested class to the dialog', function (done) {

            var windowClass = 'windowClass';

            dialogs.confirm('./public/app/layout/structuredExit.html', callbacks.okPreClose, callbacks.getParameter, callbacks.cancelPreClose, windowClass).then(function () {

                var parents = $('#structuredExitModal').parents('.' + windowClass);
                expect(parents.length).toEqual(1);
                done();

            });

            $rootScope.$apply();
            angular.element($('#buttonOK')).triggerHandler('click');
        });

        it('should call cancel', function (done) {

            dialogs.confirm('./public/app/layout/structuredExit.html', callbacks.okPreClose, callbacks.getParameter, callbacks.cancelPreClose).catch(function () {

                expect(callbacks.cancelPreClose).toHaveBeenCalled();
                expect(callbacks.okPreClose).not.toHaveBeenCalled();
                done();

            });

            $rootScope.$apply();
            angular.element($('#buttonCancel')).triggerHandler('click');
        });
    });
});