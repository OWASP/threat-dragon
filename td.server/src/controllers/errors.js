/**
 * @name errors
 * @description A handful of errors / status codes that might get returned by the server
 */

/**
 * Sends an error to the client
 * @param {String} error
 * @param {Number} code
 * @param {String} message
 * @param {Object} res
 * @param {*} logger
 * @returns {Object}
 */
const sendError = (error, code, message, res, logger) => {
    const returnObj = {
        status: code,
        message,
        details: error
    };
    logger.debug(`Returning error to client: ${JSON.stringify(returnObj)}`);
    return res.status(code).json(returnObj);
};

/**
 * Returns a 500 status / error
 * @param {String} error
 * @param {Object} res
 * @param {*} logger
 * @returns {Object}
 */
export const serverError = (error, res, logger) => sendError(error, 500, 'Internal Server Error', res, logger);

/**
 * Returns a 404 status / error
 * @param {String} error
 * @param {Object} res
 * @param {*} logger
 * @returns {Object}
 */
export const notFound = (error, res, logger) => sendError(error, 404, 'Not Found', res, logger);

/**
 * Returns a 400 status / error
 * @param {String} error
 * @param {Object} res
 * @param {*} logger
 * @returns {Object}
 */
export const badRequest = (error, res, logger) => sendError(error, 400, 'Bad Request', res, logger);

/**
 * Returns a 401 status / error
 * @param {Object} res
 * @param {*} logger
 * @returns {Object}
 */
export const unauthorized = (res, logger) => sendError('You must login to continue', 401, 'Unauthorized', res, logger);

/**
 * Returns a 403 status / error
 * @param {Object} res
 * @param {*} logger
 * @returns {Object}
 */
export const forbidden = (res, logger) => sendError('Forbidden', 403, 'Forbidden', res, logger);

export default {
    badRequest,
    forbidden,
    notFound,
    serverError,
    unauthorized
};
