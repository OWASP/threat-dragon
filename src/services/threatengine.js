'use strict';

var nools = require('nools');

function threatengine() {

    var flowName = 'threat generation';

    var service = {
        generateForElement: generateForElement,
        generateForElementInContext: generateForElementInContext,
        generateForGraph: generateForGraph
    };

    var Threats = function () {
        this.collection = [];
    };

    var Element = function (element) {
        this.element = element;
    };

    return service;

    function generateForElement(element) {
        //todo: implement proper rule set

        var flow = initialiseFlow(flowName);
        var threats = new Threats();
        var el = new Element(element);
        var session = flow.getSession(threats, el);
        return session.match().then(function () {
            session.dispose();
            nools.deleteFlow(flowName);
            return threats.collection;
        });
    }

    function generateForElementInContext() {
        //todo
        return [];
    }

    function generateForGraph() {
        //todo
        return [];
    }

    function initialiseFlow(flowName) {
        return nools.flow(flowName, function (flow) {

            flow.rule('Generic Spoofing Threat Rule', [
                ['or',
                    [Element, 'el', 'el.element.attributes.type == "tm.Process"'],
                    [Element, 'el', 'el.element.attributes.type == "tm.Actor"']
                ],
                [Threats, 'threats']
            ], function (facts) {
                facts.threats.collection.push({ ruleId: 'b2a6d40d-d3f8-4750-8e4d-c02cc84b13dc', title: 'Generic spoofing threat', type: 'Spoofing', status: 'Open', severity: 'Medium', description: 'A generic spoofing threat' });
            });

            flow.rule('Generic Tampering Threat Rule', [
                ['or',
                    [Element, 'el', 'el.element.attributes.type == "tm.Process"'],
                    [Element, 'el', 'el.element.attributes.type == "tm.Store"'],
                    [Element, 'el', 'el.element.attributes.type == "tm.Flow"']
                ],
                [Threats, 'threats']
            ], function (facts) {
                facts.threats.collection.push({ ruleId: '4adaa48a-0345-4533-a189-64c98c4420dd', title: 'Generic tampering threat', type: 'Tampering', status: 'Open', severity: 'Medium', description: 'A generic tampering threat' });
            });

            flow.rule('Generic Repudiation Threat Rule', [
                ['or',
                    [Element, 'el', 'el.element.attributes.type == "tm.Process"'],
                    [Element, 'el', 'el.element.attributes.type == "tm.Store"'],
                    [Element, 'el', 'el.element.attributes.type == "tm.Actor"']
                ],
                [Threats, 'threats']
            ], function (facts) {
                facts.threats.collection.push({ ruleId: '87bc37e2-798e-4d68-bb96-feb1da26da48', title: 'Generic repudiation threat', type: 'Repudiation', status: 'Open', severity: 'Medium', description: 'A generic repudiation threat' });
            });

            flow.rule('Generic Information Disclosure Threat Rule', [
                ['or',
                    [Element, 'el', 'el.element.attributes.type == "tm.Process"'],
                    [Element, 'el', 'el.element.attributes.type == "tm.Store"'],
                    [Element, 'el', 'el.element.attributes.type == "tm.Flow"']
                ],
                [Threats, 'threats']
            ], function (facts) {
                facts.threats.collection.push({ ruleId: '13000296-b17d-4b72-9cc4-f5cc33f80e4c', title: 'Generic information disclosure threat', type: 'Information disclosure', status: 'Open', severity: 'Medium', description: 'A generic information disclosure threat' });
            });

            flow.rule('Generic Denial of Service Threat Rule', [
                ['or',
                    [Element, 'el', 'el.element.attributes.type == "tm.Process"'],
                    [Element, 'el', 'el.element.attributes.type == "tm.Store"'],
                    [Element, 'el', 'el.element.attributes.type == "tm.Flow"']
                ],
                [Threats, 'threats']
            ], function (facts) {
                facts.threats.collection.push({ ruleId: 'edb05d76-a695-455f-947b-7d67b78bc31d', title: 'Generic DoS threat', type: 'Denial of service', status: 'Open', severity: 'Medium', description: 'A generic DoS threat' });
            });

            flow.rule('Generic Elevation of Privilege Rule', [
                ['or',
                    [Element, 'el', 'el.element.attributes.type == "tm.Process"']
                ],
                [Threats, 'threats']
            ], function (facts) {
                facts.threats.collection.push({ ruleId: 'c1377855-ea20-4c97-8861-f95c364fb8d2', title: 'Generic elevation threat', type: 'Elevation of privilege', status: 'Open', severity: 'Medium', description: 'A generic elevation threat' });
            });

            flow.rule('Should encrypt on public network', [
                [Element, 'el', 'el.element.attributes.type == "tm.Flow" && isTrue(el.element.isPublicNetwork) && ( isFalse(el.element.isEncrypted) || isUndefined(el.element.isEncrypted) )'],
                [Threats, 'threats']
            ], function (facts) {
                facts.threats.collection.push({
                    ruleId: 'c1cae982-3e92-4bb2-b50b-ea51137fc3a7',
                    title: 'Use encryption',
                    type: 'Information disclosure',
                    status: 'Open',
                    severity: 'High',
                    description: 'Unencrypted data sent over a public network may be intercepted and read by an attacker.',
                    mitigation: 'Data sent over a public network should be encrypted either at the message or transport level.'
                });
            });
        });
    }
}

module.exports = threatengine;