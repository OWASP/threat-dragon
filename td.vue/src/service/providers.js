import githubProvider from './github.provider.js';
import sessionProvider from './session.provider.js';

const providers = {
    github: {
        key: 'github',
        displayName: 'GitHub',
        provider: githubProvider,
        icon: ['fab', 'github']
    },
    local: {
        key: 'local',
        displayName: 'Local Session',
        provider: sessionProvider,
        icon: ['fab', 'vuejs']
    }
};

export const allProviders = (() => {
    return Object.freeze(providers);
})();

export const providerNames = (() => {
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

    if (!provider.provider || ! provider.provider.getDashboardActions()) {
        throw new Error(`No dashboard actions configured for provider ${providerKey}`);
    }

    return provider.provider.getDashboardActions();
};

export default {
    allProviders,
    providerNames,
    getDashboardActions
};
