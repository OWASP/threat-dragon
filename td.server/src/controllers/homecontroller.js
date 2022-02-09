import path from 'path';

import { upDir } from '../helpers/path.helper.js';

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
    res.sendFile(indexHtmlPath);
};

export default {
    index
};
