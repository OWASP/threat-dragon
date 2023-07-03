import githubProvider from './github.provider.js';
import localProvider from './local.provider.js';
import { providerTypes } from './providerTypes.js';
import env from '../env/Env.js';

const providers = {
    github: {
        key: 'github',
        displayName: 'GitHub',
        provider: githubProvider,
        type: providerTypes.git,
        icon: ['fab', 'github']
    },
    local: {
        key: 'local',
        displayName: 'Local Session',
        provider: localProvider,
        type: providerTypes.local,
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

export const getProviderType = (providerKey) => providers[providerKey].type;

export const getProviderUri = (providerKey) => {
    if (providerKey == providers.github.key) {
        const enterpriseHostname = env.get().config.GITHUB_ENTERPRISE_HOSTNAME;
        if (enterpriseHostname) {
            const port = env.get().config.GITHUB_ENTERPRISE_PORT;
            const protocol = env.get().config.GITHUB_ENTERPRISE_PROTOCOL;
    
            return protocol + "://" + enterpriseHostname + ":" + port;
        }

        return "https://github.com"
    }
}

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

    if (!provider.provider || !provider.provider.getDashboardActions()) {
        throw new Error(`No dashboard actions configured for provider ${providerKey}`);
    }

    return provider.provider.getDashboardActions();
};

export default {
    allProviders,
    providerNames,
    getDashboardActions
};
