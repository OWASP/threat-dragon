/* STRIDE per element
          S | T | R | I | D | E
ACTOR   | X |   | X |   |   |
STORE   |   | X | X | X | X |
PROCESS | X | X | X | X | X | X
FLOW    |   | X |   | X | X |
*/

export default {
    spoofing: 'threats.model.stride.spoofing',
    tampering: 'threats.model.stride.tampering',
    repudiation: 'threats.model.stride.repudiation',
    informationDisclosure: 'threats.model.stride.informationDisclosure',
    denialOfService: 'threats.model.stride.denialOfService',
    elevationOfPrivilege: 'threats.model.stride.elevationOfPrivilege'
};
