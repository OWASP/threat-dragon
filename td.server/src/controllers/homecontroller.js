import connectEnsureLoggedIn from 'connect-ensure-login';
import path from 'path';

import env from '../env/Env.js';
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
    //angular ajax request need xsrf token as a script accessible cookie
    const cookieOptions = {
        httpOnly: false,
        secure: env.get().config.NODE_ENV !== 'development'
    };

    if (!cookieOptions.secure) {
        req.log.error({ security: true }, 'secure anti-XSRF cookie flag was false - should only happen in dev environments');
    }

    res.cookie('XSRF-TOKEN', req.csrfToken(), cookieOptions);
    res.sendFile(indexHtmlPath);
};

/**
 * Renders the login view
 * @param {Object} req
 * @param {Object} res
 * @returns {Object}
 */
const login = (req, res) => res.render('login', { csrfToken: req.csrfToken() });

/**
 * Ensures the current user is logged in
 */
const ensureLoggedIn = connectEnsureLoggedIn.ensureLoggedIn('/login');

/**
 * Gets the angular view for the logout form
 * Dynamic for username and anti-csrf token
 * @param {Object} req
 * @param {Object} res
 * @returns {Object}
 */
const logoutform = (req, res) => res.render('logoutform', {
        csrfToken: req.csrfToken(),
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

    // Ensure cookies are cleared
    res.clearCookie('connect.sid');
    res.clearCookie('XSRF-TOKEN');

    return req.session.destroy(() => {
        req.log.info({ security: true, userName, idp }, 'logged out');
        return res.redirect('/');
    });
};

export default {
    ensureLoggedIn,
    index,
    login,
    logout,
    logoutform
};
