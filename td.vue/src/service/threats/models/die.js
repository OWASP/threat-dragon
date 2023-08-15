/* DIE Model

distributed: Are systems distributed to allow for scalability while preventing dependence on a single zone?
immutable: Can the infrastructure be disposed of and replaced in the event of an issue, aka infrastructure as code?
ephemeral: What’s the period for system reprovisioning, and are assets disposable in the event of a breach?

          D | I | E |
ACTOR   | X | X | X |
STORE   | X | X | X |
FLOW    | X | X | X |
PROCESS | X | X | X |
*/

export default {
    distributed: 'threats.model.die.distributed',
    immutable: 'threats.model.die.immutable',
    ephemeral: 'threats.model.die.ephemeral'
};
