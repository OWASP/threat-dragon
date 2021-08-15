'use strict';

describe('core threatengine service:', function () {

    var _ = require('lodash');
    var jsonRulesEngine = require('json-rules-engine');
    var sinon = require('sinon');

    var engineFactory = require('../../../core/services/threatengine.js');
    var threatengine;

    var stubEngine = {
        addFact: function () { },
        addRule: function () { },
        run: function () { }
    };

    beforeEach(function () {
        sinon.stub(jsonRulesEngine, 'Engine').returns(stubEngine);
        threatengine = engineFactory();
    });

    afterEach(function () {
        sinon.restore();
    });

    var threatengine = require('../../../core/services/threatengine')();

    describe('element generation tests:', function () {
        describe('CIA', function () {
            var ciaResp = [
                { params: { type: 'Confidentiality' } },
                { params: { type: 'Integrity' } },
                { params: { type: 'Availability' } }
            ];

            beforeEach(function () {
                sinon.stub(stubEngine, 'run').resolves(ciaResp);
            });

            xit('CIA process should generate CIA', function (done) {
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

            xit('CIA flow should generate CIA', function (done) {
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

            xit('CIA actor should generate CIA', function (done) {
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

            xit('CIA store should generate CIA', function (done) {
                var element = { attributes: { type: 'tm.Store' } };
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
        });

        describe('LINDDN', function () {
            var linddnResp = [
                { params: { type: 'Linkability' } },
                { params: { type: 'Identifiability' } },
                { params: { type: 'Non-repudiation' } },
                { params: { type: 'Detectability' } },
                { params: { type: 'Disclosure of information' } },
                { params: { type: 'Non-compliance' } }
            ];

            beforeEach(function () {
                sinon.stub(stubEngine, 'run').resolves(linddnResp);
            });

            xit('LINDDUN process should generate LINDDN by element', function (done) {
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

            xit('LINDDUN flow should generate LINDDN by element', function (done) {
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

            xit('LINDDUN store should generate LINDDN by element', function (done) {
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
        });


        xit('LINDDUN actor should generate LIU by element', function (done) {
            var linddnResp = [
                { params: { type: 'Linkability' } },
                { params: { type: 'Identifiability' } },
                { params: { type: 'Unawareness' } }
            ];
            sinon.stub(stubEngine, 'run').resolves(linddnResp);
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

        describe('STRIDE', function () {
            xit('STRIDE process should generate STRIDE', function (done) {
                var strideResp = [
                    { params: { type: 'Spoofing' } },
                    { params: { type: 'Tampering' } },
                    { params: { type: 'Repudiation' } },
                    { params: { type: 'Information disclosure' } },
                    { params: { type: 'Denial of service' } },
                    { params: { type: 'Elevation of privilege' } }
                ];
                sinon.stub(stubEngine, 'run').resolves(strideResp);
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

            xit('STRIDE flow should generate TID by element', function (done) {
                var strideResp = [
                    { params: { type: 'Tampering' } },
                    { params: { type: 'Information disclosure' } },
                    { params: { type: 'Denial of service' } }
                ];
                sinon.stub(stubEngine, 'run').resolves(strideResp);
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

            xit('STRIDE actor should generate SR by element', function (done) {
                var strideResp = [
                    { params: { type: 'Spoofing' } },
                    { params: { type: 'Repudiation' } }
                ];
                sinon.stub(stubEngine, 'run').resolves(strideResp);
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

            xit('STRIDE store should generate TRID by element', function (done) {
                var strideResp = [
                    { params: { type: 'Tampering' } },
                    { params: { type: 'Repudiation' } },
                    { params: { type: 'Information disclosure' } },
                    { params: { type: 'Denial of service' } }
                ];
                sinon.stub(stubEngine, 'run').resolves(strideResp);
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
        });

        describe('encryption', function () {
            beforeEach(function () {
                var runResp = [
                    { params: { ruleId: 'c1cae982-3e92-4bb2-b50b-ea51137fc3a7' } }
                ];
                sinon.stub(stubEngine, 'run').resolves(runResp);
            });

            xit('should suggest using encryption over public networks', function (done) {
    
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
    
            xit('should suggest using encryption over public networks (undefined encryption)', function (done) {
    
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
        });
    
        xit('should not suggest using encryption over public networks (not public)', function (done) {

            //set up the properties of the element
            var subject = { attributes: { type: 'tm.Flow' }, isPublicNetwork: false, isEncrypted: true };

            sinon.stub(stubEngine, 'run').resolves([]);
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

        xit('should not suggest using encryption over public networks (already encrypted)', function (done) {

            //set up the properties of the element
            var subject = { attributes: { type: 'tm.Flow' }, isPublicNetwork: true, isEncrypted: true };

            sinon.stub(stubEngine, 'run').resolves([]);
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
