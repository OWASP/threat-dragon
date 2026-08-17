import { Env } from './Env.js';
import loggerHelper from '../helpers/logger.helper.js';

/**
 * Configuration for optional Plausible Analytics integration.
 * Analytics are opt-in only and disabled by default.
 * @see https://plausible.io/docs
 */
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

        const enabled = config.PLAUSIBLE_ENABLED;
        if (!enabled || enabled.toString().toLowerCase() === 'false') {
            return config;
        }

        const domain = config.PLAUSIBLE_DOMAIN;
        if (!domain || !domain.length) {
            const errMsg = 'When PLAUSIBLE_ENABLED is set to true, PLAUSIBLE_DOMAIN is required';
            this.logger.error(errMsg);
            throw new Error(errMsg);
        }

        return config;
    }

    get properties () {
        return [
            { key: 'ENABLED', required: false, defaultValue: false },
            { key: 'URL', required: false, defaultValue: 'https://plausible.io' },
            { key: 'DOMAIN', required: false }
        ];
    }
}

export default PlausibleEnv;
