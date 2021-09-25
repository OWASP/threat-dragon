import { providerTypes } from './providerTypes.js';

const providerType = providerTypes.git;

const getDashboardActions = () => ([
    {
        to: `/${providerType}/github/repository`,
        key: 'openExisting',
        icon: 'github',
        iconPreface: 'fab'
    },
    {
        to: `/${providerType}/github/repository`,
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
