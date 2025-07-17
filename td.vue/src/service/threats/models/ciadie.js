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
    confidentiality: 'threats.model.ciadie.confidentiality',
    integrity: 'threats.model.ciadie.integrity',
    availability: 'threats.model.ciadie.availability',
    distributed: 'threats.model.ciadie.distributed',
    immutable: 'threats.model.ciadie.immutable',
    ephemeral: 'threats.model.ciadie.ephemeral'
};
