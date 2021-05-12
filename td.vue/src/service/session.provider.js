const getDashboardActions = () => ([
    {
        to: '/threatmodel-select',
        description: 'Open an existing threat model',
        icon: 'vuejs',
        iconPreface: 'fab'
    },
    {
        to: '/repository',
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
