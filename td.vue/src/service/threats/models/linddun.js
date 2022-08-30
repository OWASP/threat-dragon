/* LINDDUN per element
          L | I | N | D | D | U | N
ACTOR   | X | X |   |   |   | X |
STORE   | X | X | X | X | X |   | X
FLOW    | X | X | X | X | X |   | X
PROCESS | X | X | X | X | X |   | X
*/

export default {
    actor: {
        linkability: 'threats.model.linddun.linkability',
        identifiability: 'threats.model.linddun.identifiability',
        unawareness: 'threats.model.linddun.unawareness'
    },
    default: {
        linkability: 'threats.model.linddun.linkability',
        identifiability: 'threats.model.linddun.identifiability',
        nonRepudiation: 'threats.model.linddun.nonRepudiation',
        detectability: 'threats.model.linddun.detectability',
        disclosureOfInformation: 'threats.model.linddun.disclosureOfInformation',
        nonCompliance: 'threats.model.linddun.nonCompliance'
    },
    all: {
        linkability: 'threats.model.linddun.linkability',
        identifiability: 'threats.model.linddun.identifiability',
        nonRepudiation: 'threats.model.linddun.nonRepudiation',
        detectability: 'threats.model.linddun.detectability',
        disclosureOfInformation: 'threats.model.linddun.disclosureOfInformation',
        unawareness: 'threats.model.linddun.unawareness',
        nonCompliance: 'threats.model.linddun.nonCompliance'
    }
};
