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

/**
 * Gets the angular view for the logout form
 * Dynamic for username
 * @param {Object} req
 * @param {Object} res
 * @returns {Object}
 */
const logoutform = (req, res) => res.render('logoutform', {
        username: req.user.profile.username
});

/**
 * Logs the user out
 * @param {Object} req
 * @param {Object} res
 * @returns {Object}
 */
const logout = (req, res) => {
    const userName = req.user.profile.username;
    const idp = req.user.profile.provider;

    req.logOut();

    return req.session.destroy(() => {
        req.log.info({ security: true, userName, idp }, 'logged out');
        return res.redirect('/');
    });
};

export default {
    index,
    logout,
    logoutform
};
