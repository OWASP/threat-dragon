import loggerHelper from '../helpers/logger.helper.js';
import tokenStore from './tokenStore.js';

const logger = loggerHelper.get('repositories/token.js');

/**
 * Adds a refresh token to the repo
 * @param {String} token
 */
const add = (token) => {
    logger.debug('Adding refresh token to repository');
    tokenStore.add(token);
};

/**
 * Removes a token from the refresh store
 * This is the same as invalidating the refresh token
 * @param {String} token
 */
const remove = (token) => {
    logger.debug('Removing / invalidating refresh token from repository');
    tokenStore.remove(token);
};

/**
 * Verifies that a refresh token is valid
 * @param {String} token
 * @returns {Object} The decoded token
 */
const verify = (token) => tokenStore.verify(token);

export default {
    add,
    remove,
    verify
};
