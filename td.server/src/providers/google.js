/**
 * @name google
 * @description Identity provider for Google OAuth
 */
import axios from 'axios';
import env from '../env/Env.js';

const name = 'google';

/**
 * Determines if the Google provider is configured
 * @returns {Boolean}
 */
const isConfigured = () => Boolean(env.get().config.GOOGLE_CLIENT_ID);

/**
 * Gets the Google OAuth Login URL
 * @returns {String}
 */
const getOauthRedirectUrl = () => {
    const scope = env.get().config.GOOGLE_SCOPE || 'openid email profile';
    const redirectUri = env.get().config.GOOGLE_REDIRECT_URI;
    return `https://accounts.google.com/o/oauth2/auth?response_type=code&scope=${scope}&client_id=${env.get().config.GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}`;
};

/**
 * Gets the return URL for our application, returning from Google
 * @param {string} code
 * @returns {String}
 */
const getOauthReturnUrl = (code) => {
    let returnUrl = `/#/oauth-return?code=${code}`;
    if (env.get().config.NODE_ENV === 'development') {
        returnUrl = `http://localhost:8080${returnUrl}`;
    }
    return returnUrl;
};

/**
 * Finishes the OAuth login, issues a JWT
 * @param {String} code
 * @returns {String} jwt
 */
const completeLoginAsync = async (code) => {
    const url = `https://oauth2.googleapis.com/token`;
    const body = {
        client_id: env.get().config.GOOGLE_CLIENT_ID,
        client_secret: env.get().config.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: env.get().config.GOOGLE_REDIRECT_URI
    };
    const options = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    const providerResp = await axios.post(url, new URLSearchParams(body), options);

    const tokenInfoUrl = `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${providerResp.data.access_token}`;
    const userInfo = await axios.get(tokenInfoUrl);

    const user = {
        username: userInfo.data.name,
        email: userInfo.data.email,
        picture: userInfo.data.picture
    };

    return {
        user,
        opts: providerResp.data
    };
};

export default {
    completeLoginAsync,
    getOauthReturnUrl,
    getOauthRedirectUrl,
    isConfigured,
    name
};
