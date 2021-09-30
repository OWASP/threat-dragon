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
        to: `/${providerType}/threatmodel/new`,
        key: 'createNew',
        icon: 'plus'
    },
    {
        to: '/demo/select',
        key: 'demo',
        icon: 'cloud-download-alt'
    },
    {
        to: `/${providerType}/threatmodel/import`,
        key: 'import',
        icon: 'file-import'
    }
]);

export default {
    getDashboardActions
};
