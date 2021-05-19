import { providerTypes } from './providerTypes.js';

const providerType = providerTypes.local;

const getDashboardActions = () => ([
    {
        to: `/${providerType}/threatmodels`,
        description: 'Open an existing threat model',
        icon: 'vuejs',
        iconPreface: 'fab'
    },
    {
        // TODO: Create page
        to: `/${providerType}/:threatmodel/edit`,
        description: 'Create a completely new, empty threat model',
        icon: 'plus'
    },
    {
        to: '/',
        description: 'Download and explore a sample threat model',
        icon: 'cloud-download-alt'
    }
]);

export default {
    getDashboardActions
};
