/* STRIDE per element
          S | T | R | I | D | E
ACTOR   | X |   | X |   |   |
STORE   |   | X | X | X | X |
PROCESS | X | X | X | X | X | X
FLOW    |   | X |   | X | X |
*/

export default {
    actor: {
        spoofing: {
            translation: 'threats.model.stride.spoofing',
            ruleId: 'b2a6d40d-d3f8-4750-8e4d-c02cc84b13dc'
        },
        repudiation: {
            translation: 'threats.model.stride.repudiation',
            ruleId: '87bc37e2-798e-4d68-bb96-feb1da26da48'
        }
    },
    store: {
        tampering: {
            translation: 'threats.model.stride.tampering',
            ruleId: '4adaa48a-0345-4533-a189-64c98c4420dd'
        },
        repudiation: {
            translation: 'threats.model.stride.repudiation',
            ruleId: '87bc37e2-798e-4d68-bb96-feb1da26da48'
        },
        informationDisclosure: {
            translation: 'threats.model.stride.informationDisclosure',
            ruleId: '13000296-b17d-4b72-9cc4-f5cc33f80e4c'
        },
        denialOfService: {
            translation: 'threats.model.stride.denialOfService',
            ruleId: 'edb05d76-a695-455f-947b-7d67b78bc31d'
        }
    },
    process: {
        spoofing: {
            translation: 'threats.model.stride.spoofing',
            ruleId: 'b2a6d40d-d3f8-4750-8e4d-c02cc84b13dc'
        },
        tampering: {
            translation: 'threats.model.stride.tampering',
            ruleId: '4adaa48a-0345-4533-a189-64c98c4420dd'
        },
        repudiation: {
            translation: 'threats.model.stride.repudiation',
            ruleId: '87bc37e2-798e-4d68-bb96-feb1da26da48'
        },
        informationDisclosure: {
            translation: 'threats.model.stride.informationDisclosure',
            ruleId: '13000296-b17d-4b72-9cc4-f5cc33f80e4c'
        },
        denialOfService: {
            translation: 'threats.model.stride.denialOfService',
            ruleId: 'edb05d76-a695-455f-947b-7d67b78bc31d'
        },
        elevationOfPrivilege: {
            translation: 'threats.model.stride.elevationOfPrivilege',
            ruleId: 'c1377855-ea20-4c97-8861-f95c364fb8d2'
        }
    },
    flow: {
        tampering: {
            translation: 'threats.model.stride.tampering',
            ruleId: '4adaa48a-0345-4533-a189-64c98c4420dd'
        },
        informationDisclosure: {
            translation: 'threats.model.stride.informationDisclosure',
            ruleId: '13000296-b17d-4b72-9cc4-f5cc33f80e4c'
        },
        denialOfService: {
            translation: 'threats.model.stride.denialOfService',
            ruleId: 'edb05d76-a695-455f-947b-7d67b78bc31d'
        }
    },
    all: {
        spoofing: {
            translation: 'threats.model.stride.spoofing',
            ruleId: 'b2a6d40d-d3f8-4750-8e4d-c02cc84b13dc'
        },
        tampering: {
            translation: 'threats.model.stride.tampering',
            ruleId: '4adaa48a-0345-4533-a189-64c98c4420dd'
        },
        repudiation: {
            translation: 'threats.model.stride.repudiation',
            ruleId: '87bc37e2-798e-4d68-bb96-feb1da26da48'
        },
        informationDisclosure: {
            translation: 'threats.model.stride.informationDisclosure',
            ruleId: '13000296-b17d-4b72-9cc4-f5cc33f80e4c'
        },
        denialOfService: {
            translation: 'threats.model.stride.denialOfService',
            ruleId: 'edb05d76-a695-455f-947b-7d67b78bc31d'
        },
        elevationOfPrivilege: {
            translation: 'threats.model.stride.elevationOfPrivilege',
            ruleId: 'c1377855-ea20-4c97-8861-f95c364fb8d2'
        }
    }
};
