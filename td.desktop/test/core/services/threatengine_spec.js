'use strict';

describe('core threatengine service:', function () {

    var _ = require('lodash');
    var threatengine = require('../../../core/services/threatengine')();

    describe('element generation tests:', function () {
        describe('CIA', function () {

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

            it('CIA store should generate CIA', function (done) {
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

        });

        describe('STRIDE', function () {

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
        });

        describe('generation by context', function () {
            it('STRIDE should suggest using encryption over unencrypted public networks', function (done) {
                var element = { attributes: { type: 'tm.Flow' }, isPublicNetwork: true, isEncrypted: false };
                threatengine.generatePerElement(element, 'STRIDE').then(function (threats) {
                    expect(threats).toBeDefined();
                    expect(threats.length).toEqual(4);
                    var ruleIds = _.uniq(_.map(threats, 'ruleId'));
                    expect(ruleIds.indexOf('c1cae982-3e92-4bb2-b50b-ea51137fc3a7')).toBeGreaterThan(-1);
                    done();
                })
            });

            it('STRIDE should suggest using encryption over public networks with undefined encryption', function (done) {
                var element = { attributes: { type: 'tm.Flow' }, isPublicNetwork: true };
                threatengine.generatePerElement(element, 'STRIDE').then(function (threats) {
                    expect(threats).toBeDefined();
                    expect(threats.length).toEqual(4);
                    var ruleIds = _.uniq(_.map(threats, 'ruleId'));
                    expect(ruleIds.indexOf('c1cae982-3e92-4bb2-b50b-ea51137fc3a7')).toBeGreaterThan(-1);
                    done();
                })
            });

            it('STRIDE should not suggest using encryption over private networks', function (done) {
                var element = { attributes: { type: 'tm.Flow' }, isPublicNetwork: false, isEncrypted: true };
                threatengine.generatePerElement(element, 'STRIDE').then(function (threats) {
                    expect(threats).toBeDefined();
                    expect(threats.length).toEqual(3);
                    var ruleIds = _.uniq(_.map(threats, 'ruleId'));
                    expect(ruleIds.indexOf('c1cae982-3e92-4bb2-b50b-ea51137fc3a7')).toEqual(-1);
                    expect(ruleIds.indexOf('38c51fb4-2370-4ac1-a24a-4ba171078ef1')).toEqual(-1);
                    expect(ruleIds.indexOf('021ab22d-8d51-4501-9bb8-6dabf9c27f0d')).toEqual(-1);
                    done();
                })
            });

            it('STRIDE should not suggest using encryption over already encrypted public networks', function (done) {
                var element = { attributes: { type: 'tm.Flow' }, isPublicNetwork: true, isEncrypted: true };
                threatengine.generatePerElement(element, 'STRIDE').then(function (threats) {
                    expect(threats).toBeDefined();
                    expect(threats.length).toEqual(3);
                    var ruleIds = _.uniq(_.map(threats, 'ruleId'));
                    expect(ruleIds.indexOf('c1cae982-3e92-4bb2-b50b-ea51137fc3a7')).toEqual(-1);
                    expect(ruleIds.indexOf('38c51fb4-2370-4ac1-a24a-4ba171078ef1')).toEqual(-1);
                    expect(ruleIds.indexOf('021ab22d-8d51-4501-9bb8-6dabf9c27f0d')).toEqual(-1);
                    done();
                })
            });

            it('CIA should suggest using encryption over unencrypted public networks', function (done) {
                var element = { attributes: { type: 'tm.Flow' }, isPublicNetwork: true, isEncrypted: false };
                threatengine.generatePerElement(element, 'CIA').then(function (threats) {
                    expect(threats).toBeDefined();
                    expect(threats.length).toEqual(4);
                    var ruleIds = _.uniq(_.map(threats, 'ruleId'));
                    expect(ruleIds.indexOf('38c51fb4-2370-4ac1-a24a-4ba171078ef1')).toBeGreaterThan(-1);
                    done();
                })
            });

            it('CIA should suggest using encryption over public networks with undefined encryption', function (done) {
                var element = { attributes: { type: 'tm.Flow' }, isPublicNetwork: true };
                threatengine.generatePerElement(element, 'CIA').then(function (threats) {
                    expect(threats).toBeDefined();
                    expect(threats.length).toEqual(4);
                    var ruleIds = _.uniq(_.map(threats, 'ruleId'));
                    expect(ruleIds.indexOf('38c51fb4-2370-4ac1-a24a-4ba171078ef1')).toBeGreaterThan(-1);
                    done();
                })
            });

            it('CIA should not suggest using encryption over private networks', function (done) {
                var element = { attributes: { type: 'tm.Flow' }, isPublicNetwork: false, isEncrypted: true };
                threatengine.generatePerElement(element, 'CIA').then(function (threats) {
                    expect(threats).toBeDefined();
                    expect(threats.length).toEqual(3);
                    var ruleIds = _.uniq(_.map(threats, 'ruleId'));
                    expect(ruleIds.indexOf('38c51fb4-2370-4ac1-a24a-4ba171078ef1')).toEqual(-1);
                    expect(ruleIds.indexOf('c1cae982-3e92-4bb2-b50b-ea51137fc3a7')).toEqual(-1);
                    expect(ruleIds.indexOf('021ab22d-8d51-4501-9bb8-6dabf9c27f0d')).toEqual(-1);
                    done();
                })
            });

            it('CIA should not suggest using encryption over already encrypted public networks', function (done) {
                var element = { attributes: { type: 'tm.Flow' }, isPublicNetwork: true, isEncrypted: true };
                threatengine.generatePerElement(element, 'CIA').then(function (threats) {
                    expect(threats).toBeDefined();
                    expect(threats.length).toEqual(3);
                    var ruleIds = _.uniq(_.map(threats, 'ruleId'));
                    expect(ruleIds.indexOf('38c51fb4-2370-4ac1-a24a-4ba171078ef1')).toEqual(-1);
                    expect(ruleIds.indexOf('c1cae982-3e92-4bb2-b50b-ea51137fc3a7')).toEqual(-1);
                    expect(ruleIds.indexOf('021ab22d-8d51-4501-9bb8-6dabf9c27f0d')).toEqual(-1);
                    done();
                })
            });
            it('LINDDUN should suggest using encryption over unencrypted public networks', function (done) {
                var element = { attributes: { type: 'tm.Flow' }, isPublicNetwork: true, isEncrypted: false };
                threatengine.generatePerElement(element, 'LINDDUN').then(function (threats) {
                    expect(threats).toBeDefined();
                    expect(threats.length).toEqual(7);
                    var ruleIds = _.uniq(_.map(threats, 'ruleId'));
                    expect(ruleIds.indexOf('021ab22d-8d51-4501-9bb8-6dabf9c27f0d')).toBeGreaterThan(-1);
                    done();
                })
            });

            it('LINDDUN should suggest using encryption over public networks with undefined encryption', function (done) {
                var element = { attributes: { type: 'tm.Flow' }, isPublicNetwork: true };
                threatengine.generatePerElement(element, 'LINDDUN').then(function (threats) {
                    expect(threats).toBeDefined();
                    expect(threats.length).toEqual(7);
                    var ruleIds = _.uniq(_.map(threats, 'ruleId'));
                    expect(ruleIds.indexOf('021ab22d-8d51-4501-9bb8-6dabf9c27f0d')).toBeGreaterThan(-1);
                    done();
                })
            });

            it('LINDDUN should not suggest using encryption over private networks', function (done) {
                var element = { attributes: { type: 'tm.Flow' }, isPublicNetwork: false, isEncrypted: true };
                threatengine.generatePerElement(element, 'LINDDUN').then(function (threats) {
                    expect(threats).toBeDefined();
                    expect(threats.length).toEqual(6);
                    var ruleIds = _.uniq(_.map(threats, 'ruleId'));
                    expect(ruleIds.indexOf('021ab22d-8d51-4501-9bb8-6dabf9c27f0d')).toEqual(-1);
                    expect(ruleIds.indexOf('38c51fb4-2370-4ac1-a24a-4ba171078ef1')).toEqual(-1);
                    expect(ruleIds.indexOf('c1cae982-3e92-4bb2-b50b-ea51137fc3a7')).toEqual(-1);
                    done();
                })
            });

            it('LINDDUN should not suggest using encryption over already encrypted public networks', function (done) {
                var element = { attributes: { type: 'tm.Flow' }, isPublicNetwork: true, isEncrypted: true };
                threatengine.generatePerElement(element, 'LINDDUN').then(function (threats) {
                    expect(threats).toBeDefined();
                    expect(threats.length).toEqual(6);
                    var ruleIds = _.uniq(_.map(threats, 'ruleId'));
                    expect(ruleIds.indexOf('021ab22d-8d51-4501-9bb8-6dabf9c27f0d')).toEqual(-1);
                    expect(ruleIds.indexOf('38c51fb4-2370-4ac1-a24a-4ba171078ef1')).toEqual(-1);
                    expect(ruleIds.indexOf('c1cae982-3e92-4bb2-b50b-ea51137fc3a7')).toEqual(-1);
                    done();
                })
            });

        });
    });

    describe('element in context generation tests', function () {

        //placeholder for not implemented feature
        it('should return an empty array', function () {

            var element = {};
            var threats = threatengine.generateByContext(element);
            expect(threats.length).toEqual(0);
        });
    });

});
