'use strict';

describe('core threatengine service:', function () {

     var _ = require('lodash');

     var threatengine = require('../../../src/app/core/services/threatengine')();

    describe('element generation tests:', function () {

        it('CIA process should generate CIA', function (done) {

            var element = { attributes: { type: 'tm.Process' } };
            threatengine.generatePerElement(element, 'CIA').then(function (threats) {
                expect(threats).toBeDefined();
                expect(threats.length).toEqual(3);
                var threatTypes = _.uniq(_.map(threats, 'type'));
                expect(threatTypes.indexOf('Confidentiality')).toBeGreaterThan(-1);
                expect(threatTypes.indexOf('Integrity')).toBeGreaterThan(-1);
                expect(threatTypes.indexOf('Availability')).toBeGreaterThan(-1);
                done();
            });
        });

        it('CIA flow should generate CIA', function (done) {

            var element = { attributes: { type: 'tm.Flow' } };
            threatengine.generatePerElement(element, 'CIA').then(function (threats) {
                expect(threats).toBeDefined();
                expect(threats.length).toEqual(3);
                var threatTypes = _.uniq(_.map(threats, 'type'));
                expect(threatTypes.indexOf('Confidentiality')).toBeGreaterThan(-1);
                expect(threatTypes.indexOf('Integrity')).toBeGreaterThan(-1);
                expect(threatTypes.indexOf('Availability')).toBeGreaterThan(-1);
                done();
            });

        });

        it('CIA actor should generate CIA', function (done) {

            var element = { attributes: { type: 'tm.Actor' } };
            threatengine.generatePerElement(element, 'CIA').then(function (threats) {
                expect(threats).toBeDefined();
                expect(threats.length).toEqual(3);
                var threatTypes = _.uniq(_.map(threats, 'type'));
                expect(threatTypes.indexOf('Confidentiality')).toBeGreaterThan(-1);
                expect(threatTypes.indexOf('Integrity')).toBeGreaterThan(-1);
                expect(threatTypes.indexOf('Availability')).toBeGreaterThan(-1);
                done();
            });

        });

        it('LINDDUN process should generate LINDDN by element', function (done) {

            var element = { attributes: { type: 'tm.Process' } };
            threatengine.generatePerElement(element, 'LINDDUN').then(function (threats) {
                expect(threats).toBeDefined();
                expect(threats.length).toEqual(6);
                var threatTypes = _.uniq(_.map(threats, 'type'));
                expect(threatTypes.indexOf('Linkability')).toBeGreaterThan(-1);
                expect(threatTypes.indexOf('Identifiability')).toBeGreaterThan(-1);
                expect(threatTypes.indexOf('Non-repudiation')).toBeGreaterThan(-1);
                expect(threatTypes.indexOf('Detectability')).toBeGreaterThan(-1);
                expect(threatTypes.indexOf('Disclosure of information')).toBeGreaterThan(-1);
                expect(threatTypes.indexOf('Non-compliance')).toBeGreaterThan(-1);
                done();
            });
        });

        it('LINDDUN flow should generate LINDDN by element', function (done) {

            var element = { attributes: { type: 'tm.Flow' } };
            threatengine.generatePerElement(element, 'LINDDUN').then(function (threats) {
                expect(threats).toBeDefined();
                expect(threats.length).toEqual(6);
                var threatTypes = _.uniq(_.map(threats, 'type'));
                expect(threatTypes.indexOf('Linkability')).toBeGreaterThan(-1);
                expect(threatTypes.indexOf('Identifiability')).toBeGreaterThan(-1);
                expect(threatTypes.indexOf('Non-repudiation')).toBeGreaterThan(-1);
                expect(threatTypes.indexOf('Detectability')).toBeGreaterThan(-1);
                expect(threatTypes.indexOf('Disclosure of information')).toBeGreaterThan(-1);
                expect(threatTypes.indexOf('Non-compliance')).toBeGreaterThan(-1);
                done();
            });

        });

        it('LINDDUN actor should generate LIU by element', function (done) {

            var element = { attributes: { type: 'tm.Actor' } };
            threatengine.generatePerElement(element, 'LINDDUN').then(function (threats) {
                expect(threats).toBeDefined();
                expect(threats.length).toEqual(3);
                var threatTypes = _.uniq(_.map(threats, 'type'));
                expect(threatTypes.indexOf('Linkability')).toBeGreaterThan(-1);
                expect(threatTypes.indexOf('Identifiability')).toBeGreaterThan(-1);
                expect(threatTypes.indexOf('Unawareness')).toBeGreaterThan(-1);
                done();
            });

        });

        it('LINDDUN store should generate LINDDN by element', function (done) {

            var element = { attributes: { type: 'tm.Store' } };
            threatengine.generatePerElement(element, 'LINDDUN').then(function (threats) {
                expect(threats).toBeDefined();
                expect(threats.length).toEqual(6);
                var threatTypes = _.uniq(_.map(threats, 'type'));
                expect(threatTypes.indexOf('Linkability')).toBeGreaterThan(-1);
                expect(threatTypes.indexOf('Identifiability')).toBeGreaterThan(-1);
                expect(threatTypes.indexOf('Non-repudiation')).toBeGreaterThan(-1);
                expect(threatTypes.indexOf('Detectability')).toBeGreaterThan(-1);
                expect(threatTypes.indexOf('Disclosure of information')).toBeGreaterThan(-1);
                expect(threatTypes.indexOf('Non-compliance')).toBeGreaterThan(-1);
                done();
            });

        });

        it('STRIDE process should generate STRIDE', function (done) {

            var element = { attributes: { type: 'tm.Process' } };
            threatengine.generatePerElement(element, 'STRIDE').then(function (threats) {
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

        it('STRIDE flow should generate TID by element', function (done) {

            var element = { attributes: { type: 'tm.Flow' } };
            threatengine.generatePerElement(element, 'STRIDE').then(function (threats) {
                expect(threats).toBeDefined();
                expect(threats.length).toEqual(3);
                var threatTypes = _.uniq(_.map(threats, 'type'));
                expect(threatTypes.indexOf('Tampering')).toBeGreaterThan(-1);
                expect(threatTypes.indexOf('Information disclosure')).toBeGreaterThan(-1);
                expect(threatTypes.indexOf('Denial of service')).toBeGreaterThan(-1);
                done();
            });

        });

        it('STRIDE actor should generate SR by element', function (done) {

            var element = { attributes: { type: 'tm.Actor' } };
            threatengine.generatePerElement(element, 'STRIDE').then(function (threats) {
                expect(threats).toBeDefined();
                expect(threats.length).toEqual(2);
                var threatTypes = _.uniq(_.map(threats, 'type'));
                expect(threatTypes.indexOf('Spoofing')).toBeGreaterThan(-1);
                expect(threatTypes.indexOf('Repudiation')).toBeGreaterThan(-1);
                done();
            });

        });

        it('STRIDE store should generate TRID by element', function (done) {

            var element = { attributes: { type: 'tm.Store' } };
            threatengine.generatePerElement(element, 'STRIDE').then(function (threats) {
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