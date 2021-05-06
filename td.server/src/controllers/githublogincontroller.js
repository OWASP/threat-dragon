import passport from 'passport';

import { badRequest } from './errors.js';
import cryptoPromise from '../helpers/crypto.promise.js';

const doLogin = async (req, res, next) => {
    if (!req.session.githubOauthState) {
        const rand = await cryptoPromise.randomBytes(32);
        const state = rand.toString('hex');
        req.session.githubOauthState = state; // eslint-disable-line require-atomic-updates
        return passport.authenticate('github', { state })(req, res, next);
    }
    return passport.authenticate('github')(req, res, next);
};

/**
 * Completes the Github Oauth sign in with CSRF protection
 * @param {object} req
 * @param {object} res
 */
const completeLogin = (req, res) => {
    const expectedState = req.session.githubOauthState;
    const incomingState = req.query.state;
    delete req.session.githubOauthState;

    if (!incomingState || expectedState !== incomingState) {
        req.log.error({ security: true, idp: 'github' }, 'invalid oauth state value');
        const msg = 'Threat Dragon received an invalid request from GitHub. Your internet connection may not be secure!';
        return badRequest(msg, res);
    }

    req.log.info({ security: true, userName: req.user.profile.username, idp: req.user.profile.provider }, 'logged in');
    const returnTo = req.session.returnTo;
    delete req.session.returnTo;
    return res.redirect(returnTo || '/');
};

export default {
    completeLogin,
    doLogin
};
