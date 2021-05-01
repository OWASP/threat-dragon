import githubProvider from './github.provider.js';

export const allProviders = Object.freeze({
    github: 'github',
    testingOnly: 'testingOnly'
});

/**
 * Gets the dashboard actions based on the selected provider
 * @param {string} provider
 * @returns {Object[]}
 */
export const getDashboardActions = (provider) => {
    if (!allProviders[provider]) {
        throw new Error(`Unknown provider: ${provider}`);
    }

    if (provider === allProviders.github) {
        return githubProvider.dashboardActions;
    }

    throw new Error(`No dashboard actions configured for provider ${provider}`);
};

export default {
    allProviders,
    getDashboardActions
};
