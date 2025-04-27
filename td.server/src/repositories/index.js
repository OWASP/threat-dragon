import bitbucketrepo from './bitbucketrepo.js';
import githubrepo from './githubrepo.js';
import gitlabrepo from './gitlabrepo.js';
import googledrive from './googledrive.js';
import loggerHelper from '../helpers/logger.helper.js';

const logger = loggerHelper.get('repositories/index.js');

/**
 * An immutable object containing all
 * providers
 * @type {Object}
 */
const all = Object.freeze({
    githubrepo,
    gitlabrepo,
    bitbucketrepo,
    googledrive
});

// Default to github as it's the most commonly used
let selection = 'githubrepo';

const get = () => getSpecific(selection);

const set = (name) => {
    if (!name) {
        console.warn('Attempted to set repository selection to empty value');
        return;
    }

    // Ensure the repo name ends with 'repo'
    const repoName = name.endsWith('repo') ? name : `${name}repo`;

    // Verify this is a valid repository before setting
    if (!all[repoName.toLowerCase()]) {
        console.warn(`Attempted to set unknown repository: ${repoName}`);
        return;
    }

    logger.info(`Setting repository selection to: ${repoName}`);
    selection = repoName.toLowerCase();
};

/**
 * Gets a provider
 * @param {String} name
 * @throw {Error} If the provider does not exist or is not configured
 * @returns {Object}
 */
const getSpecific = (name) => {
    const lowerName = (name || '').toLowerCase();
    const provider = all[lowerName];
    if (!provider) {
        throw new Error(`Unknown provider: ${name}`);
    }
    //
    // if (!provider.isConfigured()) {
    //     throw new Error(`Provider ${name} is not configured. See docs/development/environment.md for more info`);
    // }

    return provider;
};

export default {
    all,
    get,
    getSpecific,
    set
};
