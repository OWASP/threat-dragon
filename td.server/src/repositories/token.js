import jwtHelper from '../helpers/jwt.helper.js';
import loggerHelper from '../helpers/logger.helper.js';

const logger = loggerHelper.get('repositories/token.js');

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
    logger.debug('Adding refresh token to repository');
    refreshTokens.push(token);
};

/**
 * Removes a token from the refresh store
 * This is the same as invalidating the refresh token
 * @param {String} token
 */
const remove = (token) => {
    const idx = refreshTokens.indexOf(token);
    logger.debug('Removing / invalidating refresh token from repository');

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
        logger.audit('Refresh token not found in repository');
        return false;
    }

    try {
        // Refresh tokens are just JWTs.  The JWTs have a default expiration time
        // Ensure that it is a valid (signed) token, and that it is not expired
        logger.debug('Refresh token verified');
        return jwtHelper.verifyRefresh(token);
    } catch (err) {
        logger.audit('Error verifying refresh token');
        logger.info(err);

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
