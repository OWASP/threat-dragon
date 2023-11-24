/* PLOT4ai per element
          T | A | I | S | S | U | E | N
ACTOR   |   | X | X | X | X | X | X |
STORE   | X | X | X | X |   |   |   | X
FLOW    | X |   | X | X |   |   |   | X
PROCESS | X | X | X | X |   |   |   | X
*/

export default {
    actor: {
        accessibility: 'threats.model.plot4ai.accessibility',
        identifiabilityLinkability: 'threats.model.plot4ai.identifiabilityLinkability',
        security: 'threats.model.plot4ai.security',
        safety: 'threats.model.plot4ai.safety',
        unawareness: 'threats.model.plot4ai.unawareness',
        ethicsHumanRights: 'threats.model.plot4ai.ethicsHumanRights',
    },
    flow: {
        techniqueProcesses: 'threats.model.plot4ai.techniqueProcesses',
        identifiabilityLinkability: 'threats.model.plot4ai.identifiabilityLinkability',
        security: 'threats.model.plot4ai.security',
        nonCompliance: 'threats.model.plot4ai.nonCompliance'
    },
    store: {
        techniqueProcesses: 'threats.model.plot4ai.techniqueProcesses',
        accessibility: 'threats.model.plot4ai.accessibility',
        identifiabilityLinkability: 'threats.model.plot4ai.identifiabilityLinkability',
        security: 'threats.model.plot4ai.security',
        nonCompliance: 'threats.model.plot4ai.nonCompliance'
    },
    process: {
        techniqueProcesses: 'threats.model.plot4ai.techniqueProcesses',
        accessibility: 'threats.model.plot4ai.accessibility',
        identifiabilityLinkability: 'threats.model.plot4ai.identifiabilityLinkability',
        security: 'threats.model.plot4ai.security',
        nonCompliance: 'threats.model.plot4ai.nonCompliance'
    },
    all: {
        techniqueProcesses: 'threats.model.plot4ai.techniqueProcesses',
        accessibility: 'threats.model.plot4ai.accessibility',
        identifiabilityLinkability: 'threats.model.plot4ai.identifiabilityLinkability',
        security: 'threats.model.plot4ai.security',
        safety: 'threats.model.plot4ai.safety',
        unawareness: 'threats.model.plot4ai.unawareness',
        ethicsHumanRights: 'threats.model.plot4ai.ethicsHumanRights',
        nonCompliance: 'threats.model.plot4ai.nonCompliance'
    }
};
