import githubProvider from './github.provider.js';
import localProvider from './local.provider.js';
import desktopProvider from './desktop.provider.js';
import { providerTypes } from './providerTypes.js';
import bitbucketProvider from '@/service/provider/bitbucket.provider';
import gitlabProvider from '@/service/provider/gitlab.provider';
import googleProvider from './google.provider.js';

const providers = {
    desktop: {
        key: 'desktop',
        displayName: 'Desktop',
        provider: desktopProvider,
        type: providerTypes.desktop,
        icon: ['fab', 'vuejs']
    },
    github: {
        key: 'github',
        displayName: 'GitHub',
        provider: githubProvider,
        type: providerTypes.git,
        icon: ['fab', 'github']
    },
    gitlab: {
        key: 'gitlab',
        displayName: 'Gitlab',
        provider: gitlabProvider,
        type: providerTypes.git,
        icon: ['fab', 'gitlab']
    },
    bitbucket: {
        key: 'bitbucket',
        displayName: 'Bitbucket',
        provider: bitbucketProvider,
        type: providerTypes.git,
        icon: ['fab', 'bitbucket']
    },
    google: {
        key: 'google',
        displayName: 'Google',
        provider: googleProvider,
        type: providerTypes.google,
        icon: ['fab', 'google']
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
