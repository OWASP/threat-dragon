import { serverError } from './errors.js';

/**
 * Wraps a function to be sent using a standardized JSON format
 * This catches errors and logs them using the req.log logger
 * @param {Function} fn
 * @param {*} req
 * @param {*} res
 * @returns {*}
 */
const sendResponse = (fn, req, res) => {
    try {
        const respObj = {
            status: 200,
            data: fn()
        };
        return res.status(200).json(respObj);
    } catch (e) {
        req.log.error(e);
        return serverError('Internal Server Error', res);
    }
};

/**
 * Wraps an async function (promise) to be sent using a standardized JSON format
 * This catches errors and logs them using the req.log logger
 * @param {Promise} asyncFn
 * @param {*} req
 * @param {*} res
 * @returns {*}
 */
const sendResponseAsync = async (asyncFn, req, res) => {
    try {
        const data = await asyncFn();
        return res.status(200).json({
            status: 200,
            data
        });
    } catch (e) {
        req.log.error(e);
        return serverError('Internal Server Error', res);
    }
};

export default {
    sendResponse,
    sendResponseAsync
};
