import { providerTypes } from './providerTypes.js';

const providerType = providerTypes.local;

const getDashboardActions = () => ([
    {
        to: `/${providerType}/threatmodels`,
        key: 'openExisting',
        icon: 'vuejs',
        iconPreface: 'fab'
    },
    {
        // TODO: Create page
        to: `/${providerType}/:threatmodel/edit`,
        key: 'createNew',
        icon: 'plus'
    },
    {
        to: '/',
        key: 'download',
        icon: 'cloud-download-alt'
    }
]);

export default {
    getDashboardActions
};
