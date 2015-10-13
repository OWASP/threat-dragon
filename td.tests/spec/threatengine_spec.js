'use strict';

var threatengine;
var $rootScope;
var $httpBackend;

describe('threatengine service:', function () {

    beforeEach(function () {

        angular.mock.module('app');
        angular.mock.inject(function (_$rootScope_, _$httpBackend_, _threatengine_) {
            threatengine = _threatengine_;
            $rootScope = _$rootScope_;
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET().respond();
        });

        $rootScope.$apply();

    });

    describe('element generation tests:', function () {

        it('process should generate STRIDE', function (done) {

            var element = { attributes: { type: 'tm.Process' } };
            threatengine.generateForElement(element).then(function (threats) {
                expect(threats).toBeDefined();
                expect(threats.length).toEqual(6);
                var threatTypes = getThreatTypes(threats);
                expect(threatTypes.indexOf('Spoofing')).toBeGreaterThan(-1);
                expect(threatTypes.indexOf('Tampering')).toBeGreaterThan(-1);
                expect(threatTypes.indexOf('Repudiation')).toBeGreaterThan(-1);
                expect(threatTypes.indexOf('Information disclosure')).toBeGreaterThan(-1);
                expect(threatTypes.indexOf('Denial of service')).toBeGreaterThan(-1);
                expect(threatTypes.indexOf('Elevation of privilege')).toBeGreaterThan(-1);
                done();
            });

            $rootScope.$apply();
        });

        it('flow should generate TID', function (done) {

            var element = { attributes: { type: 'tm.Flow' } };
            threatengine.generateForElement(element).then(function (threats) {
                expect(threats).toBeDefined();
                expect(threats.length).toEqual(3);
                var threatTypes = getThreatTypes(threats);
                expect(threatTypes.indexOf('Tampering')).toBeGreaterThan(-1);
                expect(threatTypes.indexOf('Information disclosure')).toBeGreaterThan(-1);
                expect(threatTypes.indexOf('Denial of service')).toBeGreaterThan(-1);
                done();
            });

            $rootScope.$apply();

        });

        it('actor should generate SR', function (done) {

            var element = { attributes: { type: 'tm.Actor' } };
            threatengine.generateForElement(element).then(function (threats) {
                expect(threats).toBeDefined();
                expect(threats.length).toEqual(2);
                var threatTypes = getThreatTypes(threats);
                expect(threatTypes.indexOf('Spoofing')).toBeGreaterThan(-1);
                expect(threatTypes.indexOf('Repudiation')).toBeGreaterThan(-1);
                done();
            });

            $rootScope.$apply();

        });

       it('store should generate TRID', function (done) {

            var element = { attributes: { type: 'tm.Store' } };
            threatengine.generateForElement(element).then(function (threats) {
                expect(threats).toBeDefined();
                expect(threats.length).toEqual(4);
                var threatTypes = getThreatTypes(threats);
                expect(threatTypes.indexOf('Tampering')).toBeGreaterThan(-1);
                expect(threatTypes.indexOf('Repudiation')).toBeGreaterThan(-1);
                expect(threatTypes.indexOf('Information disclosure')).toBeGreaterThan(-1);
                expect(threatTypes.indexOf('Denial of service')).toBeGreaterThan(-1);
                done();
            });

            $rootScope.$apply();

        });

    });

    describe('element in context generation tests', function () {

        //placeholder for not implemented feature

        it('should return an empty array', function () {

            var element = {};
            var threats = threatengine.generateForElementInContext(element);
            expect(threats.length).toEqual(0);

        });

    });

    describe('graph generation tests', function () {

        //placeholder for not implemented feature

        it('should return an empty array', function () {

            var graph = {};
            var threats = threatengine.generateForGraph(graph);
            expect(threats.length).toEqual(0);

        });

    });

    function getThreatTypes(threats) {

        var threatTypes = [];

        threats.forEach(function (threat) {

            if (threatTypes.indexOf(threat.type) < 0) {
                threatTypes.push(threat.type);
            }

        });

        return threatTypes;

    }

});