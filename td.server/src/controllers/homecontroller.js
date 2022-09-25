import loggerHelper from '../helpers/logger.helper.js';
import path from 'path';

import { upDir } from '../helpers/path.helper.js';

const logger = loggerHelper.get('controllers/homecontroller.js');

/**
 * The path to the index.html file
 * @type {String}
 */
const indexHtmlPath = path.join(__dirname, upDir, upDir, upDir, 'dist', 'index.html');

/**
 * Serves the index.html page for the SPA
 * @param {Object} req
 * @param {Object} res
 * @returns {Object}
 */
const index = (req, res) => {
    logger.debug('API index request, sendFile ' + indexHtmlPath);
    res.sendFile(indexHtmlPath);
};

export default {
    index
};
