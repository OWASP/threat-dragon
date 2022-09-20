import { providerTypes } from './providerTypes.js';

const providerType = providerTypes.local;

const getDashboardActions = () => ([
    {
        to: `/${providerType}/threatmodel/open`,
        key: 'openExisting',
        icon: 'folder-open'
    },
    {
        to: `/${providerType}/threatmodel/import`,
        key: 'import',
        icon: 'file-import'
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
    }
]);

export default {
    getDashboardActions
};
