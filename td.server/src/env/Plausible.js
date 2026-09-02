import { Env } from './Env.js';
import loggerHelper from '../helpers/logger.helper.js';

const parseBoolean = (value, propertyName) => {
    if (value === true || value === 'true') {return true;}
    if (value === false || value === 'false' || value === undefined || value === null) {return false;}
    throw new Error(`${propertyName} must be true or false`);
};

const validateUrl = (value, propertyName, { allowInsecure, allowQuery = false }) => {
    let url;
    try {
        url = new URL(value);
    } catch {
        throw new Error(`${propertyName} must be a valid URL`);
    }

    if (url.username || url.password || url.hash || (!allowQuery && url.search)) {
        throw new Error(`${propertyName} must not include credentials, fragments, or query parameters`);
    }

    if (url.protocol !== 'https:' && !(allowInsecure && url.protocol === 'http:')) {
        throw new Error(`${propertyName} must use HTTPS unless PLAUSIBLE_ALLOW_INSECURE is true`);
    }
};

const validateDomain = (value) => {
    try {
        const url = new URL(`https://${value}`);
        if (url.hostname === '' || url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
            throw new Error('invalid domain');
        }
    } catch {
        throw new Error('PLAUSIBLE_DOMAIN must be a domain name, optionally with a port');
    }
};

class PlausibleEnv extends Env {
    constructor () {
        super('Plausible');
        this.logger = loggerHelper.get('env/Plausible.js');
    }

    get prefix () {
        return 'PLAUSIBLE_';
    }

    _loadConfig () {
        const config = super._loadConfig();
        const enabled = parseBoolean(config.PLAUSIBLE_ENABLED, 'PLAUSIBLE_ENABLED');
        const allowInsecure = parseBoolean(config.PLAUSIBLE_ALLOW_INSECURE, 'PLAUSIBLE_ALLOW_INSECURE');

        config.PLAUSIBLE_ENABLED = enabled;
        config.PLAUSIBLE_ALLOW_INSECURE = allowInsecure;

        if (allowInsecure) {
            this.logger.warn('Plausible insecure connections are enabled; use only for local testing.');
        }

        if (!enabled) {return config;}

        const required = ['PLAUSIBLE_EVENT_URL', 'PLAUSIBLE_DOMAIN', 'PLAUSIBLE_DASHBOARD_URL'];
        required.forEach((property) => {
            if (!config[property]) {
                throw new Error(`${property} is required when PLAUSIBLE_ENABLED is true`);
            }
        });

        validateUrl(config.PLAUSIBLE_EVENT_URL, 'PLAUSIBLE_EVENT_URL', { allowInsecure });
        validateUrl(config.PLAUSIBLE_DASHBOARD_URL, 'PLAUSIBLE_DASHBOARD_URL', {
            allowInsecure,
            allowQuery: true
        });
        validateDomain(config.PLAUSIBLE_DOMAIN);

        return config;
    }

    get properties () {
        return [
            { key: 'ENABLED', required: false, defaultValue: false },
            { key: 'EVENT_URL', required: false },
            { key: 'DOMAIN', required: false },
            { key: 'DASHBOARD_URL', required: false },
            { key: 'ALLOW_INSECURE', required: false, defaultValue: false }
        ];
    }
}

export default PlausibleEnv;
