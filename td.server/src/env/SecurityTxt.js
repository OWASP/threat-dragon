import { Env } from './Env.js';
import loggerHelper from '../helpers/logger.helper.js';

/**
 * Config to generate an RFC 1196 compliant /.well-known/security.txt
 * @see https://datatracker.ietf.org/doc/rfc9116/
 */
class SecurityTxtEnv extends Env {
    constructor () {
        super('SecurityTxt');
        this.logger = loggerHelper.get('env/SecurityTxt.js');
    }

    get prefix () {
        return 'SECURITY_TXT_';
    }

    // Overriding the base implementation to apply conditional logic for when fields
    // are required. CONTACT and EXPIRES are the minimum required according to the RFC
    _loadConfig() {
        // Create the config object - remember config has full property names including prefix
        const config = super._loadConfig();
        // If not enabled, there is no need for the conditional logic
        if (!config.SECURITY_TXT_ENABLED || config.SECURITY_TXT_ENABLED.toLowerCase() === 'false') {
            return config;
        }

        const contactVal = config.SECURITY_TXT_CONTACT;
        const expiresVal = config.SECURITY_TXT_EXPIRES;

        const hasContact = contactVal && contactVal.length;
        const hasExpires = expiresVal && expiresVal.length;

        if (!hasContact || !hasExpires) {
            const errMsg = 'When SECURITY_TXT_ENABLED is set to true, both SECURITY_TXT_CONTACT and SECURITY_TXT_EXPIRES are required';
            this.logger.error(errMsg);
            throw new Error(errMsg);
        }

        this._validateExpiresDate(expiresVal);


        return config;
    }

    _validateExpiresDate(expiresVal) {
        // According to the RFC, expires must be a valid RFC3339 ISO.8601-2 date
        // We are not doing that complete validation here. We are simply 
        // checking that the date parses
        const expires = new Date(expiresVal);
        if (isNaN(expires.getTime())) {
            const errMsg = 'SECURITY_TXT_EXPIRES must be a valid date';
            this.logger.error(errMsg);
            throw new Error(errMsg);
        }

        // A date in the past means it is invalid and needs to be updated.
        // This must be a warning and not a hard failure - a hard failure
        // would prevent restarts in a production environment
        if (expires <= new Date()) {
            this.logger.warn('Your security.txt has expired. SECURITY_TXT_EXPIRES date is in the past');
        }
      
        // it is RECOMMENDED that expires be no more than 1 year in the future
        const oneYearFromNow = new Date();
        oneYearFromNow.setUTCFullYear(oneYearFromNow.getUTCFullYear() + 1);
        if (expires >= oneYearFromNow) {
            this.logger.info('Your security.txt expiration date is more than one year in the future.');
            this.logger.info('RFC 1196 recommends an expiration of less than a year');
        }
    }

    get properties () {
        return [
            { key: 'ENABLED', required: false, defaultValue: false },
            { key: 'CONTACT', required: false },
            { key: 'EXPIRES', required: false },
            { key: 'POLICY', required: false },
            { key: 'CANONICAL', required: false },
            { key: 'PREFERRED_LANGUAGES', required: false }
        ];
    }
}

export default SecurityTxtEnv;

