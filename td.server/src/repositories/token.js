import jwtHelper from '../helpers/jwt.helper.js';
import { logger } from '../config/loggers.config.js';

/**
 * The refresh tokens
 * This is a bit of a code smell having this held in memory
 * Typically you would store this in a database, since we will
 * lose all valid refresh tokens when the server restarts
 * Threat Dragon does not currently have a canonical persistence layer
 * @type {Array<String>}
 */
const refreshTokens = [];

/**
 * Adds a refresh token to the repo
 * @param {String} token
 */
const add = (token) => {
    refreshTokens.push(token);
};

/**
 * Removes a token from the refresh store
 * This is the same as invalidating the refresh token
 * @param {String} token
 */
const remove = (token) => {
    const idx = refreshTokens.indexOf(token);
    if (idx !== -1) {
        refreshTokens.splice(idx, 1);
    }
};

/**
 * Verifies that a refresh token is valid
 * @param {String} token
 * @returns {Object} The decoded token
 */
const verify = (token) => {
    if (refreshTokens.indexOf(token) === -1) {
        return false;
    }

    try {
        // Refresh tokens are just JWTs.  The JWTs have a default expiration time
        // Ensure that it is a valid (signed) token, and that it is not expired
        return jwtHelper.verifyRefresh(token);
    } catch (err) {
        logger.info({ security: true }, 'Error verifying refresh token');
        logger.info({ security: true }, err);

        // Since the token is invalid and was found in the array, we should remove it
        remove(token);
        return false;
    }
};

export default {
    add,
    remove,
    verify
};
