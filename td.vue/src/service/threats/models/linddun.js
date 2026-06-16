/* LINDDUN per element
          L | I | N | D | D | U | N
ACTOR   | X | X |   |   |   | X |
STORE   | X | X | X | X | X |   | X
FLOW    | X | X | X | X | X |   | X
PROCESS | X | X | X | X | X |   | X
*/

export default {
    actor: {
        linkability: {
            translation: 'threats.model.linddun.linkability',
            ruleId: '896abdef-0e7e-46ec-aeaa-b8e70c233d57'
        },
        identifiability: {
            translation: 'threats.model.linddun.identifiability',
            ruleId: '9128c587-bc76-41d0-a02d-5de3b539ecc0'
        },
        unawareness: {
            translation: 'threats.model.linddun.unawareness',
            ruleId: '8d0993c0-9d92-4c51-99f5-6772270a7d88'
        }
    },
    default: {
        linkability: {
            translation: 'threats.model.linddun.linkability',
            ruleId: '896abdef-0e7e-46ec-aeaa-b8e70c233d57'
        },
        identifiability: {
            translation: 'threats.model.linddun.identifiability',
            ruleId: '9128c587-bc76-41d0-a02d-5de3b539ecc0'
        },
        nonRepudiation: {
            translation: 'threats.model.linddun.nonRepudiation',
            ruleId: '74834f24-8f89-40bb-b0c6-d1fdd8b8accc'
        },
        detectability: {
            translation: 'threats.model.linddun.detectability',
            ruleId: 'df43b091-9ffb-44e3-9eb9-471b9ee56d39'
        },
        disclosureOfInformation: {
            translation: 'threats.model.linddun.disclosureOfInformation',
            ruleId: '9d576610-5c53-4f84-90c5-ec70751a339d'
        },
        nonCompliance: {
            translation: 'threats.model.linddun.nonCompliance',
            ruleId: '6e80d2fc-747a-4ae8-a435-acce06617139'
        }
    },
    all: {
        linkability: {
            translation: 'threats.model.linddun.linkability',
            ruleId: '896abdef-0e7e-46ec-aeaa-b8e70c233d57'
        },
        identifiability: {
            translation: 'threats.model.linddun.identifiability',
            ruleId: '9128c587-bc76-41d0-a02d-5de3b539ecc0'
        },
        nonRepudiation: {
            translation: 'threats.model.linddun.nonRepudiation',
            ruleId: '74834f24-8f89-40bb-b0c6-d1fdd8b8accc'
        },
        detectability: {
            translation: 'threats.model.linddun.detectability',
            ruleId: 'df43b091-9ffb-44e3-9eb9-471b9ee56d39'
        },
        disclosureOfInformation: {
            translation: 'threats.model.linddun.disclosureOfInformation',
            ruleId: '9d576610-5c53-4f84-90c5-ec70751a339d'
        },
        unawareness: {
            translation: 'threats.model.linddun.unawareness',
            ruleId: '8d0993c0-9d92-4c51-99f5-6772270a7d88'
        },
        nonCompliance: {
            translation: 'threats.model.linddun.nonCompliance',
            ruleId: '6e80d2fc-747a-4ae8-a435-acce06617139'
        }
    }
};
