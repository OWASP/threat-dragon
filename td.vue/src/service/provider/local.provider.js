import { providerTypes } from './providerTypes.js';

const providerType = providerTypes.local;

const getDashboardActions = () => ([
    {
        to: `/${providerType}/threatmodel/import`,
        key: 'openExisting',
        icon: 'file-import'
    },
    {
        to: `/${providerType}/threatmodel/new`,
        key: 'createNew',
        icon: 'plus'
    },
    {
        to: '/demo/select',
        key: 'readDemo',
        icon: 'cloud-download-alt'
    },

    {
        to: `/${providerType}/templates`,
        key: 'createFromTemplate',
        icon: 'file-alt'
    }
]);

export default {
    getDashboardActions
};
