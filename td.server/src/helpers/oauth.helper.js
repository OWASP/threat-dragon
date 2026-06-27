/**
 * @name oauth.helper.js
 * @description Shared OAuth helper for return URL construction
 */
import env from '../env/Env.js';

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
    getOauthReturnUrl
};
