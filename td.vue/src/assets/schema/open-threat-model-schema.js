export const schema = {
    'title': 'Open Threat Model (OTM) schema',
    'description': 'Used for threat models in Open Threat Model format',
    'type': 'object',
    'properties': {
        'otmVersion': {
            'description': 'REQUIRED This field states the OTM version used in the current file',
            'type': 'string',
            'maxLength': 5
        },
        'project': {
            'description': 'The project node represents the entity within all the other elements are grouped. Its the unit of work.',
            'type': 'object',
            'properties': {
                'name': {
                    'description': 'REQUIRED Name of the project',
                    'type': 'string'
                },
                'id': {
                    'description': 'REQUIRED Unique identifier for the project',
                    'type': 'string'
                },
                'description': {
                    'description': 'Short description for the project',
                    'type': 'string'
                },
                'owner': {
                    'description': 'Name of the project owner who is responsible for the project',
                    'type': 'string'
                },
                'ownerContact': {
                    'description': 'Project owner contact email',
                    'type': 'string'
                }
            },
            'required': [ 'name', 'id' ]
        }
    },
    'required': [ 'otmVersion', 'project' ],
    additionalProperties: false
};
