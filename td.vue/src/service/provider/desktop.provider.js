import { providerTypes } from './providerTypes.js';

const providerType = providerTypes.desktop;

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
    }
]);

export default {
    getDashboardActions
};
