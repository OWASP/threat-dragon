import jwtHelper from '../helpers/jwt.helper.js';
import loggerHelper from '../helpers/logger.helper.js';

import InMemoryTokenStore from './inMemoryTokenStore.js';

const logger = loggerHelper.get('repositories/tokenStore.js');

/**
 * TokenStore class with pluggable backends
 * Allows for different storage methods in tests vs production
 */
export class TokenStore {
    constructor(backend) {
        this.backend = backend;
    }

    /**
     * Adds a refresh token to the store
     * @param {String} token - The token to store
     */
    add(token) {
        logger.debug('Adding refresh token to repository');
        this.backend.add(token);
    }

    /**
     * Removes a token from the refresh store
     * This is the same as invalidating the refresh token
     * @param {String} token - The token to remove
     */
    remove(token) {
        logger.debug('Removing / invalidating refresh token from repository');
        this.backend.remove(token);
    }

    /**
     * Verifies that a refresh token is valid
     * @param {String} token - The token to verify
     * @returns {Object|Boolean} The decoded token or false if invalid
     */
    verify(token) {
        if (!this.backend.exists(token)) {
            logger.error('Refresh token not found in repository');
            return false;
        }

        try {
            // Refresh tokens are just JWTs. The JWTs have a default expiration time
            // Ensure that it is a valid (signed) token, and that it is not expired
            logger.debug('Refresh token verified');
            return jwtHelper.verifyRefresh(token);
        } catch (err) {
            logger.error('Error verifying refresh token');
            logger.info(err);

            // Since the token is invalid and was found in the array, we should remove it
            this.remove(token);
            return false;
        }
    }
}

// Create a singleton instance with the in-memory backend
const inMemoryBackend = new InMemoryTokenStore();
const tokenStore = new TokenStore(inMemoryBackend);

export default tokenStore;
