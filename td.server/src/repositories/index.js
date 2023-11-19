import bitbucketthreatmodelrepository from "./bitbucketthreatmodelrepository";
import githubthreatmodelrepository from "./githubthreatmodelrepository";

/**
 * An immutable object containing all
 * providers
 * @type {Object}
 */
const all = Object.freeze({
    githubthreatmodelrepository,
    bitbucketthreatmodelrepository,
});

let selection = 'bitbucketthreatmodelrepository';

const get = () => getSpecific(selection);

const set = (name) => {
    selection = name;
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
