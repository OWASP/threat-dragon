/* CIADIE Model

confidentiality: information is not disclosed to unauthorized individuals, entities, or processes
integrity: information is not modified by unauthorized individuals, entities, or processes
availability: information is available to authorized individuals, entities, and processes

distributed: Are systems distributed to allow for scalability while preventing dependence on a single zone?
immutable: Can the infrastructure be disposed of and replaced in the event of an issue, aka infrastructure as code?
ephemeral: What’s the period for system reprovisioning, and are assets disposable in the event of a breach?

          C | I | A | D | I | E |
ACTOR   | X | X | X | X | X | X |
STORE   | X | X | X | X | X | X |
FLOW    | X | X | X | X | X | X |
PROCESS | X | X | X | X | X | X |
*/

export default {
    confidentiality: {
        translation: 'threats.model.ciadie.confidentiality',
        ruleId: '0f20e64c-5d03-42ac-b0ae-ed105a38ee1f'
    },
    integrity: {
        translation: 'threats.model.ciadie.integrity',
        ruleId: '42511938-37d9-4bb6-866c-947a7c776e7e'
    },
    availability: {
        translation: 'threats.model.ciadie.availability',
        ruleId: '52453492-f49f-411e-a59d-5fc2dd98664b'
    },
    distributed: {
        translation: 'threats.model.ciadie.distributed',
        ruleId: 'f3fb94f4-7a4d-4271-80f4-01c450003128'
    },
    immutable: {
        translation: 'threats.model.ciadie.immutable',
        ruleId: '8dc67be7-1f2d-45b6-afb9-d44564871f28'
    },
    ephemeral: {
        translation: 'threats.model.ciadie.ephemeral',
        ruleId: '4c09f8a2-e738-432f-a378-08bc9e53a63f'
    }
};
