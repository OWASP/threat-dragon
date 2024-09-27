import bitbucket from './bitbucket.js';
import github from './github.js';
import gitlab from "./gitlab";
import google from './google.js';

/**
 * An immutable object containing all
 * providers
 * @type {Object}
 */
const all = Object.freeze({
    github,
    gitlab,
    bitbucket,
    google
});

/**
 * Gets a provider
 * @param {String} name
 * @throw {Error} If the provider does not exist or is not configured
 * @returns {Object}
 */
const get = (name) => {
    const lowerName = (name || '').toLowerCase();
    const provider = all[lowerName];
    if (!provider) {
        throw new Error(`Unknown provider: ${name}`);
    }

    if (!provider.isConfigured()) {
        throw new Error(`Provider ${name} is not configured. Refer to development/environment.md for more info`);
    }

    return provider;
};

export default {
    all,
    get
};
