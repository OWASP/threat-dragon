'use strict';

var jsonRulesEngine = require('json-rules-engine');

function threatengine() {

  var service = {
    generatePerElement: generatePerElement,
    generateByContext: generateByContext
  };

  return service;

  function generatePerElement(element, type) {
    //implements one of {STRIDE per element, LINDDUN per element, CIA}
    var engine = new jsonRulesEngine.Engine();
    initialiseRulesPerElement(engine);
    addFacts(element, type, engine);
    return engine.run().then(onCompleted);
  }

  function generateByContext(element, type) {
    var engine = new jsonRulesEngine.Engine();
    initialiseRulesByContext(engine);
    addFacts(element, type, engine);
    return engine.run().then(onCompleted);
  }

  function onCompleted(results) {
    //output is like {type: ..., params: { param1: ..., param2: ...}}
    //use params to represent the threat to preserve backward compatibility
    return results.events.map(function(result) {
      return result.params;
    });
  }

  function addFacts(element, type, engine) {
    engine.addFact('elementType', element.attributes.type);
    engine.addFact('diagramType', getModel(type));
    engine.addFact('elementIsPublicNetwork', element.isPublicNetwork);
    engine.addFact('elementIsEncrypted', element.isEncrypted);
    engine.addFact('providesAuthentication', element.providesAuthentication);
  }

  function getModel(type) {
    //diagram.diagramType in 'STRIDE', 'LINDDUN', 'CIA'
    if (type == 'STRIDE' || type ==  'LINDDUN' || type == 'CIA') {
      return type;
    } else {
      //if unrecognised then return default of STRIDE
      return 'STRIDE';
    }
  }

  function initialiseRulesPerElement(engine) {

    /* STRIDE per element
              S | T | R | I | D | E
    ACTOR   | X |   | X |   |   |
    STORE   |   | X | X | X | X |
    PROCESS | X | X | X | X | X | X
    FLOW    |   | X |   | X | X |
    */
    engine.addRule({
      conditions: {
        all: [
          {
            fact: 'diagramType',
            operator: 'equal',
            value: 'STRIDE'
          }, {
            fact: 'elementType',
            operator: 'notEqual',
            value: 'tm.Store'
          }, {
            fact: 'elementType',
            operator: 'notEqual',
            value: 'tm.Flow'
          }
        ]
      },
      event: {
        type: 'b2a6d40d-d3f8-4750-8e4d-c02cc84b13dc',
        params: {
          ruleId: 'b2a6d40d-d3f8-4750-8e4d-c02cc84b13dc',
          title: 'Generic spoofing threat',
          type: 'Spoofing',
          modelType: 'STRIDE',
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
            fact: 'diagramType',
            operator: 'equal',
            value: 'STRIDE'
          }, {
            fact: 'elementType',
            operator: 'notEqual',
            value: 'tm.Actor'
          }
        ]
      },
      event: {
        type: '4adaa48a-0345-4533-a189-64c98c4420dd',
        params: {
          ruleId: '4adaa48a-0345-4533-a189-64c98c4420dd',
          title: 'Generic tampering threat',
          type: 'Tampering',
          modelType: 'STRIDE',
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
            fact: 'diagramType',
            operator: 'equal',
            value: 'STRIDE'
          }, {
            fact: 'elementType',
            operator: 'notEqual',
            value: 'tm.Flow'
          }
        ]
      },
      event: {
        type: '87bc37e2-798e-4d68-bb96-feb1da26da48',
        params: {
          ruleId: '87bc37e2-798e-4d68-bb96-feb1da26da48',
          title: 'Generic repudiation threat',
          type: 'Repudiation',
          modelType: 'STRIDE',
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
            fact: 'diagramType',
            operator: 'equal',
            value: 'STRIDE'
          }, {
            fact: 'elementType',
            operator: 'notEqual',
            value: 'tm.Actor'
          }
        ]
      },
      event: {
        type: '13000296-b17d-4b72-9cc4-f5cc33f80e4c',
        params: {
          ruleId: '13000296-b17d-4b72-9cc4-f5cc33f80e4c',
          title: 'Generic information disclosure threat',
          type: 'Information disclosure',
          modelType: 'STRIDE',
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
            fact: 'diagramType',
            operator: 'equal',
            value: 'STRIDE'
          }, {
            fact: 'elementType',
            operator: 'notEqual',
            value: 'tm.Actor'
          }
        ]
      },
      event: {
        type: 'edb05d76-a695-455f-947b-7d67b78bc31d',
        params: {
          ruleId: 'edb05d76-a695-455f-947b-7d67b78bc31d',
          title: 'Generic DoS threat',
          type: 'Denial of service',
          modelType: 'STRIDE',
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
            fact: 'diagramType',
            operator: 'equal',
            value: 'STRIDE'
          },
          {
            fact: 'elementType',
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
          modelType: 'STRIDE',
          status: 'Open',
          severity: 'Medium',
          description: 'A generic elevation threat'
        }
      }
    });

    /* CIA per element is all three for all elements except boundary */
    engine.addRule({
      conditions: {
        all: [
          {
            fact: 'diagramType',
            operator: 'equal',
            value: 'CIA'
          }
        ]
      },
      event: {
        type: '0f20e64c-5d03-42ac-b0ae-ed105a38ee1f',
        params: {
          ruleId: '0f20e64c-5d03-42ac-b0ae-ed105a38ee1f',
          title: 'Generic threat to Confidentiality',
          type: 'Confidentiality',
          modelType: 'CIA',
          status: 'Open',
          severity: 'Medium',
          description: 'A generic threat to confidentiality'
        }
      }
    });

    engine.addRule({
      conditions: {
        all: [
          {
            fact: 'diagramType',
            operator: 'equal',
            value: 'CIA'
          }
        ]
      },
      event: {
        type: '42511938-37d9-4bb6-866c-947a7c776e7e',
        params: {
          ruleId: '42511938-37d9-4bb6-866c-947a7c776e7e',
          title: 'Generic threat to Integrity',
          type: 'Integrity',
          modelType: 'CIA',
          status: 'Open',
          severity: 'Medium',
          description: 'A generic threat to integrity'
        }
      }
    });

    engine.addRule({
      conditions: {
        all: [
          {
            fact: 'diagramType',
            operator: 'equal',
            value: 'CIA'
          }
        ]
      },
      event: {
        type: '52453492-f49f-411e-a59d-5fc2dd98664b',
        params: {
          ruleId: '52453492-f49f-411e-a59d-5fc2dd98664b',
          title: 'Generic threat to Availability',
          type: 'Availability',
          modelType: 'CIA',
          status: 'Open',
          severity: 'Medium',
          description: 'A generic threat to availability'
        }
      }
    });

    /* LINDDUN per element
              L | I | N | D | D | U | N
    ACTOR   | X | X |   |   |   | X |
    STORE   | X | X | X | X | X |   | X
    FLOW    | X | X | X | X | X |   | X
    PROCESS | X | X | X | X | X |   | X
    */
    engine.addRule({
      conditions: {
        all: [
          {
            fact: 'diagramType',
            operator: 'equal',
            value: 'LINDDUN'
          }
        ]
      },
      event: {
        type: '896abdef-0e7e-46ec-aeaa-b8e70c233d57',
        params: {
          ruleId: '896abdef-0e7e-46ec-aeaa-b8e70c233d57',
          title: 'Generic threat to Linkability',
          type: 'Linkability',
          modelType: 'LINDDUN',
          status: 'Open',
          severity: 'Medium',
          description: 'A generic threat to linkability'
        }
      }
    });

    engine.addRule({
      conditions: {
        all: [
          {
            fact: 'diagramType',
            operator: 'equal',
            value: 'LINDDUN'
          }
        ]
      },
      event: {
        type: '9128c587-bc76-41d0-a02d-5de3b539ecc0',
        params: {
          ruleId: '9128c587-bc76-41d0-a02d-5de3b539ecc0',
          title: 'Generic threat to Identifiability',
          type: 'Identifiability',
          modelType: 'LINDDUN',
          status: 'Open',
          severity: 'Medium',
          description: 'A generic threat to identifiability'
        }
      }
    });

    engine.addRule({
      conditions: {
        all: [
          {
            fact: 'diagramType',
            operator: 'equal',
            value: 'LINDDUN'
          }, {
            fact: 'elementType',
            operator: 'notEqual',
            value: 'tm.Actor'
          }
        ]
      },
      event: {
        type: '74834f24-8f89-40bb-b0c6-d1fdd8b8accc',
        params: {
          ruleId: '74834f24-8f89-40bb-b0c6-d1fdd8b8accc',
          title: 'Generic threat to Non-repudiation',
          type: 'Non-repudiation',
          modelType: 'LINDDUN',
          status: 'Open',
          severity: 'Medium',
          description: 'A generic threat to non-repudiation'
        }
      }
    });

    engine.addRule({
      conditions: {
        all: [
          {
            fact: 'diagramType',
            operator: 'equal',
            value: 'LINDDUN'
          }, {
            fact: 'elementType',
            operator: 'notEqual',
            value: 'tm.Actor'
          }
        ]
      },
      event: {
        type: 'df43b091-9ffb-44e3-9eb9-471b9ee56d39',
        params: {
          ruleId: 'df43b091-9ffb-44e3-9eb9-471b9ee56d39',
          title: 'Generic threat to Detectability',
          type: 'Detectability',
          modelType: 'LINDDUN',
          status: 'Open',
          severity: 'Medium',
          description: 'A generic threat to detectability'
        }
      }
    });

    engine.addRule({
      conditions: {
        all: [
          {
            fact: 'diagramType',
            operator: 'equal',
            value: 'LINDDUN'
          }, {
            fact: 'elementType',
            operator: 'notEqual',
            value: 'tm.Actor'
          }
        ]
      },
      event: {
        type: '9d576610-5c53-4f84-90c5-ec70751a339d',
        params: {
          ruleId: '9d576610-5c53-4f84-90c5-ec70751a339d',
          title: 'Generic threat to Disclosure of information',
          type: 'Disclosure of information',
          modelType: 'LINDDUN',
          status: 'Open',
          severity: 'Medium',
          description: 'A generic threat to disclosure of information'
        }
      }
    });

    engine.addRule({
      conditions: {
        all: [
          {
            fact: 'diagramType',
            operator: 'equal',
            value: 'LINDDUN'
          },
          {
            fact: 'elementType',
            operator: 'equal',
            value: 'tm.Actor'
          }
        ]
      },
      event: {
        type: '8d0993c0-9d92-4c51-99f5-6772270a7d88',
        params: {
          ruleId: '8d0993c0-9d92-4c51-99f5-6772270a7d88',
          title: 'Generic threat to Unawareness',
          type: 'Unawareness',
          modelType: 'LINDDUN',
          status: 'Open',
          severity: 'Medium',
          description: 'A generic threat to unawareness'
        }
      }
    });

    engine.addRule({
      conditions: {
        all: [
          {
            fact: 'diagramType',
            operator: 'equal',
            value: 'LINDDUN'
          }, {
            fact: 'elementType',
            operator: 'notEqual',
            value: 'tm.Actor'
          }
        ]
      },
      event: {
        type: '6e80d2fc-747a-4ae8-a435-acce06617139',
        params: {
          ruleId: '6e80d2fc-747a-4ae8-a435-acce06617139',
          title: 'Generic threat to Non-compliance',
          type: 'Non-compliance',
          modelType: 'LINDDUN',
          status: 'Open',
          severity: 'Medium',
          description: 'A generic threat to non-compliance'
        }
      }
    });

  }

  function initialiseRulesByContext(engine) {
    /* No context threat suggestion */
    engine.addRule({
      conditions: {
        any: [
          {
            all: [
              {
                fact: 'elementType',
                operator: 'equal',
                value: 'tm.Actor'
              } , {
                any: [
                  {
                    fact: 'providesAuthentication',
                    operator: 'equal',
                    value: false
                  }, {
                    fact: 'providesAuthentication',
                    operator: 'equal',
                    value: undefined
                 }
               ]
              }
            ]
          }, {
            all: [
              {
                fact: 'elementType',
                operator: 'equal',
                value: 'tm.Flow'
              } , {
                any: [
                  {
                    fact: 'elementIsPublicNetwork',
                    operator: 'equal',
                    value: false
                  }, {
                    fact: 'elementIsPublicNetwork',
                    operator: 'equal',
                    value: undefined
                 }
               ]
              }
            ]
          }
        ]
      },
      event: {
        type: 'c1cae982-3e92-4bb2-b50b-ea51deadbeef',
        params: {
          ruleId: 'c1cae982-3e92-4bb2-b50b-ea51deadbeef',
          title: 'No context threat suggestion',
          type: 'TBD',
          modelType: 'TBD',
          status: 'Open',
          severity: 'TBD',
          description: 'No context specific threat determined, add one manually if appropriate',
          mitigation: 'Mitigation or prevention for the threat'
        }
      }
    });

    /* CAPTCHA defeat */
    engine.addRule({
      conditions: {
        all: [
          {
            fact: 'elementType',
            operator: 'equal',
            value: 'tm.Actor'
          } , {
            fact: 'providesAuthentication',
            operator: 'equal',
            value: true
          }
        ]
      },
      event: {
        type: 'c1cae982-3e92-4bb2-b50b-ea51deadbeef',
        params: {
          ruleId: 'c1cae982-3e92-4bb2-b50b-ea51deadbeef',
          title: 'CAPTCHA defeat',
          type: 'TBD',
          modelType: 'TBD',
          status: 'Open',
          severity: 'TBD',
          description: '',
          mitigation: ''
        }
      }
    });

    /* Credential stuffing */
    engine.addRule({
      conditions: {
        all: [
          {
            fact: 'elementType',
            operator: 'equal',
            value: 'tm.Actor'
          } , {
            fact: 'providesAuthentication',
            operator: 'equal',
            value: true
          }
        ]
      },
      event: {
        type: '38c51fb4-2370-4ac1-a24a-4ba1deadbeef',
        params: {
          ruleId: '38c51fb4-2370-4ac1-a24a-4ba1deadbeef',
          title: 'Credential stuffing',
          type: 'TBD',
          modelType: 'TBD',
          status: 'Open',
          severity: 'TBD',
          description: 'Lists of authentication credentials stolen from elsewhere are tested against the application’s authentication mechanisms to identify whether users have re-used the same login credentials',
          mitigation: 'Defenses against Credential Stuffing are described in the Credential Stuffing Prevention Cheat Sheet, Multi-Factor Authentication being a primary counter-measure'
        }
      }
    });

    /* Use encryption over public networks */
    engine.addRule({
      conditions: {
        all: [
          {
            fact: 'elementType',
            operator: 'equal',
            value: 'tm.Flow'
          } , {
            fact: 'elementIsPublicNetwork',
            operator: 'equal',
            value: true
          } , {
            any: [
              {
                fact: 'elementIsEncrypted',
                operator: 'equal',
                value: false
              }, {
                fact: 'elementIsEncrypted',
                operator: 'equal',
                value: undefined
              }
            ]
          }
        ]
      },
      event: {
        type: '021ab22d-8d51-4501-9bb8-6dabf9c27f0d',
        params: {
          ruleId: '021ab22d-8d51-4501-9bb8-6dabf9c27f0d',
          title: 'Use encryption',
          type: 'TBD',
          modelType: 'TBD',
          status: 'Open',
          severity: 'High',
          description: 'Unencrypted data sent over a public network may be intercepted and read by an attacker',
          mitigation: 'Data should be encrypted either at the message or transport level'
        }
      }
    });

    /* Fingerprinting */
    engine.addRule({
      conditions: {
        all: [
          {
            fact: 'elementType',
            operator: 'equal',
            value: 'tm.Flow'
          } , {
            fact: 'elementIsPublicNetwork',
            operator: 'equal',
            value: true
          }
        ]
      },
      event: {
        type: 'c1cae982-3e92-4bb2-b50b-ea51deadbeef',
        params: {
          ruleId: 'c1cae982-3e92-4bb2-b50b-ea51deadbeef',
          title: 'Fingerprinting',
          type: 'TBD',
          modelType: 'TBD',
          status: 'Open',
          severity: 'TBD',
          description: 'Specific requests are sent to the application eliciting information in order to profile the application',
          mitigation: ''
        }
      }
    });
  }
}

module.exports = threatengine;
