import errors from './errors.js';

/**
 * Wraps a function to be sent using a standardized JSON format
 * This catches errors and logs them using the logger
 * @param {Function} fn
 * @param {*} req
 * @param {*} res
 * @param {*} logger
 * @returns {*}
 */
const sendResponse = (fn, req, res, logger) => {
    try {
        const respObj = {
            status: 200,
            data: fn()
        };
        return res.status(200).json(respObj);
    } catch (e) {
        logger.error(e);
        return errors.serverError('Internal Server Error', res, logger);
    }
};

/**
 * Wraps an async function (promise) to be sent using a standardized JSON format
 * This catches errors and logs them using the logger
 * @param {function(): Promise<{localEnabled: boolean, githubEnabled, bitbucketEnabled}>} asyncFn
 * @param {*} req
 * @param {*} res
 * @param {*} logger
 * @returns {*}
 */
const sendResponseAsync = async (asyncFn, req, res, logger) => {
    try {
        const data = await asyncFn();
        return res.status(200).json({
            status: 200,
            data
        });
    } catch (e) {
        logger.error(e);
        return errors.serverError('Internal Server Error', res, logger);
    }
};

export default {
    sendResponse,
    sendResponseAsync
};
