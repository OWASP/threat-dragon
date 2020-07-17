'use strict';

describe('threatengine service:', function () {
    
    var _ = require('lodash');
    var threatengine = require('../../src/services/threatengine')();

    describe('element generation tests:', function () {

        it('process should generate STRIDE', function (done) {

            var element = { attributes: { type: 'tm.Process' } };
            threatengine.generatePerElement(element).then(function (threats) {
                expect(threats).toBeDefined();
                expect(threats.length).toEqual(6);
                var threatTypes = _.uniq(_.map(threats, 'type'));
                expect(threatTypes.indexOf('Spoofing')).toBeGreaterThan(-1);
                expect(threatTypes.indexOf('Tampering')).toBeGreaterThan(-1);
                expect(threatTypes.indexOf('Repudiation')).toBeGreaterThan(-1);
                expect(threatTypes.indexOf('Information disclosure')).toBeGreaterThan(-1);
                expect(threatTypes.indexOf('Denial of service')).toBeGreaterThan(-1);
                expect(threatTypes.indexOf('Elevation of privilege')).toBeGreaterThan(-1);
                done();
            });
        });

        it('flow should generate TID', function (done) {

            var element = { attributes: { type: 'tm.Flow' } };
            threatengine.generatePerElement(element).then(function (threats) {
                expect(threats).toBeDefined();
                expect(threats.length).toEqual(3);
                var threatTypes = _.uniq(_.map(threats, 'type'));
                expect(threatTypes.indexOf('Tampering')).toBeGreaterThan(-1);
                expect(threatTypes.indexOf('Information disclosure')).toBeGreaterThan(-1);
                expect(threatTypes.indexOf('Denial of service')).toBeGreaterThan(-1);
                done();
            });

        });

        it('actor should generate SR', function (done) {

            var element = { attributes: { type: 'tm.Actor' } };
            threatengine.generatePerElement(element).then(function (threats) {
                expect(threats).toBeDefined();
                expect(threats.length).toEqual(2);
                var threatTypes = _.uniq(_.map(threats, 'type'));
                expect(threatTypes.indexOf('Spoofing')).toBeGreaterThan(-1);
                expect(threatTypes.indexOf('Repudiation')).toBeGreaterThan(-1);
                done();
            });

        });

        it('store should generate TRID', function (done) {

            var element = { attributes: { type: 'tm.Store' } };
            threatengine.generatePerElement(element).then(function (threats) {
                expect(threats).toBeDefined();
                expect(threats.length).toEqual(4);
                var threatTypes = _.uniq(_.map(threats, 'type'));
                expect(threatTypes.indexOf('Tampering')).toBeGreaterThan(-1);
                expect(threatTypes.indexOf('Repudiation')).toBeGreaterThan(-1);
                expect(threatTypes.indexOf('Information disclosure')).toBeGreaterThan(-1);
                expect(threatTypes.indexOf('Denial of service')).toBeGreaterThan(-1);
                done();
            });

        });

        //give a description for the rule
        it('should suggest using encryption over public networks', function (done) {

            //set up the properties of the element
            var subject = { attributes: { type: 'tm.Flow' }, isPublicNetwork: true, isEncrypted: false };

            //generate the threats
            threatengine.generatePerElement(subject).then(function (threats) {

                expect(threats).toBeDefined();
                var ruleIds = _.uniq(_.map(threats, 'ruleId'));
                //grab a new UUID for your rule from https://www.guidgenerator.com/ and expect it to 
                //be in the generated threats
                expect(ruleIds.indexOf('c1cae982-3e92-4bb2-b50b-ea51137fc3a7')).toBeGreaterThan(-1);
                done();
            })

        });

        //give a description for the rule
        it('should suggest using encryption over public networks (undefined encryption)', function (done) {

            //set up the properties of the element
            var subject = { attributes: { type: 'tm.Flow' }, isPublicNetwork: true };

            //generate the threats
            threatengine.generatePerElement(subject).then(function (threats) {

                expect(threats).toBeDefined();
                var ruleIds = _.uniq(_.map(threats, 'ruleId'));
                //grab a new UUID for your rule from https://www.guidgenerator.com/ and expect it to 
                //be in the generated threats
                expect(ruleIds.indexOf('c1cae982-3e92-4bb2-b50b-ea51137fc3a7')).toBeGreaterThan(-1);
                done();
            })

        });

        //give a description for the rule
        it('should not suggest using encryption over public networks (not public)', function (done) {

            //set up the properties of the element
            var subject = { attributes: { type: 'tm.Flow' }, isPublicNetwork: false, isEncrypted: true };

            //generate the threats
            threatengine.generatePerElement(subject).then(function (threats) {

                expect(threats).toBeDefined();
                var ruleIds = _.uniq(_.map(threats, 'ruleId'));
                //grab a new UUID for your rule from https://www.guidgenerator.com/ and expect it to 
                //be in the generated threats
                expect(ruleIds.indexOf('c1cae982-3e92-4bb2-b50b-ea51137fc3a7')).toEqual(-1);
                done();
            })

        });

        //give a description for the rule
        it('should not suggest using encryption over public networks (already encrypted)', function (done) {

            //set up the properties of the element
            var subject = { attributes: { type: 'tm.Flow' }, isPublicNetwork: true, isEncrypted: true };

            //generate the threats
            threatengine.generatePerElement(subject).then(function (threats) {

                expect(threats).toBeDefined();
                var ruleIds = _.uniq(_.map(threats, 'ruleId'));
                //grab a new UUID for your rule from https://www.guidgenerator.com/ and expect it to 
                //be in the generated threats
                expect(ruleIds.indexOf('c1cae982-3e92-4bb2-b50b-ea51137fc3a7')).toEqual(-1);
                done();
            })

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
});