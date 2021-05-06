/**
 * @name errors
 * @description A handful of errors / status codes that might get returned by the server
 */
import { logger } from '../config/loggers.config.js';


/**
 * Sends an error to the client
 * @param {String} error
 * @param {Number} code
 * @param {String} message
 * @param {Object} res
 * @returns {Object}
 */
const sendError = (error, code, message, res) => {
    const returnObj = {
        status: code,
        message,
        details: error
    };
    logger.debug({ security: false }, `Returning error to client: ${JSON.stringify(returnObj)}`);
    return res.status(code).json(returnObj);
};

/**
 * Returns a 500 status / error
 * @param {String} error
 * @param {Object} res
 * @returns {Object}
 */
export const serverError = (error, res) => sendError(error, 500, 'Internal Server Error', res);

/**
 * Returns a 404 status / error
 * @param {String} error
 * @param {Object} res
 * @returns {Object}
 */
export const notFound = (error, res) => sendError(error, 404, 'Not Found', res);

/**
 * Returns a 400 status / error
 * @param {String} error
 * @param {Object} res
 * @returns {Object}
 */
export const badRequest = (error, res) => sendError(error, 400, 'Bad Request', res);

/**
 * Returns a 401 status / error
 * @param {Object} res
 * @returns {Object}
 */
export const unauthorized = (res) => sendError('You must login to continue', 401, 'Unauthorized', res);

/**
 * Returns a 403 status / error
 * @param {Object} res
 * @returns {Object}
 */
export const forbidden = (res) => sendError('Forbidden', 403, 'Forbidden', res);

module.exports = {
    badRequest,
    forbidden,
    notFound,
    serverError,
    unauthorized
};
