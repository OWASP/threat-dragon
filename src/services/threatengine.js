'use strict';

var Engine = require('json-rules-engine').Engine;

/* STRIDE per Element
          S | T | R | I | D | E
ACTOR   | X |   | X |   |   |
STORE   |   | X | X | X | X |
PROCESS | X | X | X | X | X | X
FLOW    |   | X |   | X | X |
*/

function threatengine() {

  var service = {
    generatePerElement: generatePerElement,
    generateForElementInContext: generateForElementInContext,
    generateForGraph: generateForGraph
  };

  var Element = function (element) {
    this.element = element;
  };

  var model = 'STRIDE';

  return service;

  function generatePerElement(element, methodology) {
    //implements one of {STRIDE per Element, LINDDUN per element, CIA}
    model = methodology;
    var engine = new Engine();
    initialiseRules(engine);
    engine.addFact('el', new Element(element));
    engine.addFact('model', getModel);

    return engine.run().then(onCompleted);

    function onCompleted(results) {
      //output is like {type: ..., params: { param1: ..., param2: ...}}
      //use params to represent the threat to preserve backward compatibility
      return results.map(function(result) {
        return result.params;
      });
    }
  }

  function getModel() {
    //diagram.model in 'STRIDE', 'LINDDUN', 'CIA'
    if (model == 'STRIDE' || model ==  'LINDDUN' || model == 'CIA') {
      return model;
    } else {
      //if unrecognised then return default of STRIDE
      return 'STRIDE';
    }
  }

  function generateForElementInContext() {
    //todo
    return [];
  }

  function generateForGraph() {
    //todo
    return [];
  }

  function initialiseRules(engine) {

    engine.addRule({
      conditions: {
        all: [
          {
            fact: 'model',
            operator: 'equal',
            value: 'STRIDE'
          },
          {
            any: [
              {
                fact: 'el',
                path: '.element.attributes.type',
                operator: 'equal',
                value: 'tm.Process'
              }, {
                fact: 'el',
                path: '.element.attributes.type',
                operator: 'equal',
                value: 'tm.Actor'
              }
            ]
          }
        ]
      },
      event: {
        type: 'b2a6d40d-d3f8-4750-8e4d-c02cc84b13dc',
        params: {
          ruleId: 'b2a6d40d-d3f8-4750-8e4d-c02cc84b13dc',
          title: 'Generic spoofing threat',
          type: 'Spoofing',
          status: 'Open',
          severity: 'Medium',
          description: 'A generic spoofing threat'
        }
      }
    });

    engine.addRule({
      conditions: {
        all: [
          {
            fact: 'model',
            operator: 'equal',
            value: 'STRIDE'
          },
          {
            any: [
              {
                fact: 'el',
                path: '.element.attributes.type',
                operator: 'equal',
                value: 'tm.Process'
              }, {
                fact: 'el',
                path: '.element.attributes.type',
                operator: 'equal',
                value: 'tm.Store'
              }, {
                fact: 'el',
                path: '.element.attributes.type',
                operator: 'equal',
                value: 'tm.Flow'
              }
            ]
          }
        ]
      },
      event: {
        type: '4adaa48a-0345-4533-a189-64c98c4420dd',
        params: {
          ruleId: '4adaa48a-0345-4533-a189-64c98c4420dd',
          title: 'Generic tampering threat',
          type: 'Tampering',
          status: 'Open',
          severity: 'Medium',
          description: 'A generic tampering threat'
        }
      }
    });

    engine.addRule({
      conditions: {
        all: [
          {
            fact: 'model',
            operator: 'equal',
            value: 'STRIDE'
          },
          {
            any: [
              {
                fact: 'el',
                path: '.element.attributes.type',
                operator: 'equal',
                value: 'tm.Process'
              }, {
                fact: 'el',
                path: '.element.attributes.type',
                operator: 'equal',
                value: 'tm.Store'
              }, {
                fact: 'el',
                path: '.element.attributes.type',
                operator: 'equal',
                value: 'tm.Actor'
              }
            ]
          }
        ]
      },
      event: {
        type: '87bc37e2-798e-4d68-bb96-feb1da26da48',
        params: {
          ruleId: '87bc37e2-798e-4d68-bb96-feb1da26da48',
          title: 'Generic repudiation threat',
          type: 'Repudiation',
          status: 'Open',
          severity: 'Medium',
          description: 'A generic repudiation threat'
        }
      }
    });

    engine.addRule({
      conditions: {
        all: [
          {
            fact: 'model',
            operator: 'equal',
            value: 'STRIDE'
          },
          {
            any: [
              {
                fact: 'el',
                path: '.element.attributes.type',
                operator: 'equal',
                value: 'tm.Process'
              }, {
                fact: 'el',
                path: '.element.attributes.type',
                operator: 'equal',
                value: 'tm.Store'
              }, {
                fact: 'el',
                path: '.element.attributes.type',
                operator: 'equal',
                value: 'tm.Flow'
              }
            ]
          }
        ]
      },
      event: {
        type: '13000296-b17d-4b72-9cc4-f5cc33f80e4c',
        params: {
          ruleId: '13000296-b17d-4b72-9cc4-f5cc33f80e4c',
          title: 'Generic information disclosure threat',
          type: 'Information disclosure',
          status: 'Open',
          severity: 'Medium',
          description: 'A generic information disclosure threat'
        }
      }
    });

    engine.addRule({
      conditions: {
        all: [
          {
            fact: 'model',
            operator: 'equal',
            value: 'STRIDE'
          },
          {
            any: [
              {
                fact: 'el',
                path: '.element.attributes.type',
                operator: 'equal',
                value: 'tm.Process'
              }, {
                fact: 'el',
                path: '.element.attributes.type',
                operator: 'equal',
                value: 'tm.Store'
              }, {
                fact: 'el',
                path: '.element.attributes.type',
                operator: 'equal',
                value: 'tm.Flow'
              }
            ]
          }
        ]
      },
      event: {
        type: 'edb05d76-a695-455f-947b-7d67b78bc31d',
        params: {
          ruleId: 'edb05d76-a695-455f-947b-7d67b78bc31d',
          title: 'Generic DoS threat',
          type: 'Denial of service',
          status: 'Open',
          severity: 'Medium',
          description: 'A generic DoS threat'
        }
      }
    });

    engine.addRule({
      conditions: {
        all: [
          {
            fact: 'model',
            operator: 'equal',
            value: 'STRIDE'
          },
          {
            fact: 'el',
            path: '.element.attributes.type',
            operator: 'equal',
            value: 'tm.Process'
          }
        ]
      },
      event: {
        type: 'c1377855-ea20-4c97-8861-f95c364fb8d2',
        params: {
          ruleId: 'c1377855-ea20-4c97-8861-f95c364fb8d2',
          title: 'Generic elevation threat',
          type: 'Elevation of privilege',
          status: 'Open',
          severity: 'Medium',
          description: 'A generic elevation threat'
        }
      }
    });

    engine.addRule({
      conditions: {
        all: [
          {
            fact: 'model',
            operator: 'equal',
            value: 'STRIDE'
          },
          {
            fact: 'el',
            path: '.element.attributes.type',
            operator: 'equal',
            value: 'tm.Flow'
          } , {
            fact: 'el',
            path: '.element.isPublicNetwork',
            operator: 'equal',
            value: true
          } , {
            any: [
              {
                fact: 'el',
                path: '.element.isEncrypted',
                operator: 'equal',
                value: false
              }, {
                fact: 'el',
                path: '.element.isEncrypted',
                operator: 'equal',
                value: undefined
              }
            ]
          }
        ]
      },
      event: {
        type: 'c1cae982-3e92-4bb2-b50b-ea51137fc3a7',
        params: {
          ruleId: 'c1cae982-3e92-4bb2-b50b-ea51137fc3a7',
          title: 'Use encryption',
          type: 'Information disclosure',
          status: 'Open',
          severity: 'High',
          description: 'Unencrypted data sent over a public network may be intercepted and read by an attacker.',
          mitigation: 'Data sent over a public network should be encrypted either at the message or transport level.'
        }
      }
    });
  }
}

module.exports = threatengine;
