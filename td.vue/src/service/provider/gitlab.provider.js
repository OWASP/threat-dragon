import { providerTypes } from './providerTypes.js';

const providerType = providerTypes.git;

const getDashboardActions = () => ([
    {
        to: `/${providerType}/gitlab/repository`,
        key: 'openExisting',
        icon: 'gitlab',
        iconPreface: 'fab'
    },
    {
        to: `/${providerType}/gitlab/repository?action=create`,
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
