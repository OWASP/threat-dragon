import { providerTypes } from './providerTypes.js';

const providerType = providerTypes.google;

const getDashboardActions = () => ([
    {
        to: `/${providerType}/google/drive`,
        key: 'openExisting',
        icon: 'google-drive',
        iconPreface: 'fab'
    },
    {
        to: `/${providerType}/google/drive?action=create`,
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
