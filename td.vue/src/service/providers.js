import githubProvider from './github.provider.js';

const providers = {
    github: {
        key: 'github',
        displayName: 'GitHub',
        provider: githubProvider
    },
    testingOnly: {
        key: 'testingOnly',
        displayName: 'Fake Datasource'
    }
};

export const allProviders = (() => {
    const _providers = {};
    Object.keys(providers).forEach(key => _providers[key] = providers[key].key);
    return Object.freeze(_providers);
})();

export const getDisplayName = (providerKey) => providers[providerKey].displayName;

/**
 * Gets the dashboard actions based on the selected provider
 * @param {string} providerKey
 * @returns {Object[]}
 */
export const getDashboardActions = (providerKey) => {
    const provider = providers[providerKey];

    if (!provider) {
        throw new Error(`Unknown provider: ${providerKey}`);
    }

    if (!provider.provider || ! provider.provider.dashboardActions) {
        throw new Error(`No dashboard actions configured for provider ${providerKey}`);
    }

    return provider.provider.dashboardActions;
};

export default {
    allProviders,
    getDashboardActions
};
