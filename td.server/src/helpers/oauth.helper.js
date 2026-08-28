/**
 * @name oauth.helper.js
 * @description Shared OAuth helper for return URL construction
 */
import crypto from 'crypto';

import env from '../env/Env.js';

// One-time OAuth state values, used to prevent CSRF login attacks.
// Consumed (deleted) as soon as they are verified.
const pendingStates = new Set();

/**
 * Generates and remembers a one-time state value to protect the OAuth
 * redirect against CSRF login attacks
 * @returns {String}
 */
const generateState = () => {
    const state = crypto.randomBytes(16).toString('hex');
    pendingStates.add(state);
    return state;
};

/**
 * Verifies that a state value was issued by us and has not already been used,
 * consuming it so it cannot be replayed
 * @param {String} state
 * @returns {Boolean}
 */
const verifyState = (state) => {
    if (!state || !pendingStates.has(state)) {
        return false;
    }
    pendingStates.delete(state);
    return true;
};

/**
 * Gets the return URL for our application after OAuth login
 * If OAUTH_FRONTEND_RETURN_URL is set, it takes precedence over NODE_ENV logic
 * @param {string} code
 * @returns {String}
 */
const getOauthReturnUrl = (code) => {
    const returnPath = `/#/oauth-return?code=${code}`;
    const configured = env.get().config.OAUTH_FRONTEND_RETURN_URL;
    if (configured) {
        return `${configured}${returnPath}`;
    }
    if (env.get().config.NODE_ENV === 'development') {
        return `http://localhost:8080${returnPath}`;
    }
    return returnPath;
};

export default {
    generateState,
    verifyState,
    getOauthReturnUrl
};
