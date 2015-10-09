(function () {
    'use strict';

    // Factory name is handy for logging
    var serviceId = 'threatengine';

    // Define the factory on the module.
    // Inject the dependencies. 
    // Point to the factory definition function.
    angular.module('app').factory(serviceId, ['$q', threatengine]);

    function threatengine($q) {

        // Define the functions and properties to reveal.
        var service = {
            generateForElement: generateForElement,
            generateForElementInContext: generateForElementInContext,
            generateForGraph: generateForElement
        };
        
        var Threats = function ()
        {
            this.collection = [];
        }
        
        var Element = function (element)
        {
            this.type = element.attributes.type;
        }

        var flow = initialiseFlow();

        return service;

        function generateForElement(element)
        {         
            //todo: implement proper rule engine, probably rete based
            
            var threats = new Threats();
            var el = new Element(element);
            
            return flow.getSession(threats, el).match().then(function () { return $q.when(threats.collection) });
        }

        function generateForElementInContext(element)
        {
            //todo
            return [];
        }

        function generateForGraph(graph)
        {
            //todo
            return [];
        }

        function initialiseFlow()
        {
            return nools.flow('Element threat generation', function (flow) { 

                flow.rule('Generic Spoofing Threat Rule', [
                    ['or',
                        [Element, 'el', 'el.type == "tm.Process"'],
                        [Element, 'el', 'el.type == "tm.Actor"']
                    ],
                    [Threats, 'threats']
                ], function (facts) {
                    facts.threats.collection.push({ title: 'Generic spoofing threat', type: 'Spoofing', status: 'Open', severity: 'Medium', description: 'A generic spoofing threat' });
                });

                flow.rule('Generic Tampering Threat Rule', [
                    ['or',
                        [Element, 'el', 'el.type == "tm.Process"'],
                        [Element, 'el', 'el.type == "tm.Store"'],
                        [Element, 'el', 'el.type == "tm.Flow"']
                    ],
                    [Threats, 'threats']
                ], function (facts) {
                    facts.threats.collection.push({ title: 'Generic tampering threat', type: 'Tampering', status: 'Open', severity: 'Medium', description: 'A generic tampering threat' });
                });

                flow.rule('Generic Repudiation Threat Rule', [
                    ['or',
                        [Element, 'el', 'el.type == "tm.Process"'],
                        [Element, 'el', 'el.type == "tm.Store"'],
                        [Element, 'el', 'el.type == "tm.Actor"']
                    ],
                    [Threats, 'threats']
                ], function (facts) {
                    facts.threats.collection.push({ title: 'Generic repudiation threat', type: 'Repudiation', status: 'Open', severity: 'Medium', description: 'A generic repudiation threat' });
                });
                
                flow.rule('Generic Information Disclosure Threat Rule', [
                    ['or',
                        [Element, 'el', 'el.type == "tm.Process"'],
                        [Element, 'el', 'el.type == "tm.Store"'],
                        [Element, 'el', 'el.type == "tm.Flow"']
                    ],
                    [Threats, 'threats']
                ], function (facts) {
                    facts.threats.collection.push({ title: 'Generic information disclosure threat', type: 'Information disclosure', status: 'Open', severity: 'Medium', description: 'A generic information disclosure threat' });
                });

                flow.rule('Generic Denial of Service Threat Rule', [
                    ['or',
                        [Element, 'el', 'el.type == "tm.Process"'],
                        [Element, 'el', 'el.type == "tm.Store"'],
                        [Element, 'el', 'el.type == "tm.Flow"']
                    ],
                    [Threats, 'threats']
                ], function (facts) {
                    facts.threats.collection.push({ title: 'Generic DoS threat', type: 'Denial of service', status: 'Open', severity: 'Medium', description: 'A generic DoS threat' });
                });

                flow.rule('Generic Elevation of Privilege Rule', [
                    ['or',
                        [Element, 'el', 'el.type == "tm.Process"']
                    ],
                    [Threats, 'threats']
                ], function (facts) {
                    facts.threats.collection.push({ title: 'Generic elevation threat', type: 'Elevation of privilege', status: 'Open', severity: 'Medium', description: 'A generic elevation threat' });
                });

            });
        }
    }
})();