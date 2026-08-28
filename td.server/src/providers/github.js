/**
 * @name github
 * @description Identity provider for Github OAuth
 */
import axios from 'axios';

import env from '../env/Env.js';
import oauthHelper from '../helpers/oauth.helper.js';
import repositories from '../repositories';

const name = 'github';

/**
 * Determines if the GitHub provider is configured
 * @returns {Boolean}
 */
const isConfigured = () => Boolean(env.get().config.GITHUB_CLIENT_ID);

/**
 * Gets the Github endpoint, which will be github.com by default OR a custom endpoint for Github enterprise
 * @returns {String}
 */
const getGithubUrl = () => {
    const enterpriseHostname = env.get().config.GITHUB_ENTERPRISE_HOSTNAME;
    if(enterpriseHostname) {
        const port = env.get().config.GITHUB_ENTERPRISE_PORT || '';
        const protocol = env.get().config.GITHUB_ENTERPRISE_PROTOCOL || 'https';
        return `${protocol}://${enterpriseHostname}${port ? ':' + port : ''}`;
    }
    return 'https://github.com';
};

/**
 * Gets the Github OAuth Login URL
 * @returns {String}
 */
const getOauthRedirectUrl = () => {
    const scope = env.get().config.GITHUB_SCOPE || 'public_repo';
    const state = oauthHelper.generateState();
    return `${getGithubUrl()}/login/oauth/authorize?scope=${scope}&client_id=${env.get().config.GITHUB_CLIENT_ID}&state=${state}`;
};

/**
 * Gets the return URL for our application, returning from github
 * @param {string} code
 * @returns {String}
 */
const getOauthReturnUrl = (code) => oauthHelper.getOauthReturnUrl(code);

/**
 * Finishes the OAuth login, issues a JWT
 * @param {String} code
 * @param {String} state
 * @returns {String} jwt
 */
const completeLoginAsync = async (code, state) => {
    if (!oauthHelper.verifyState(state)) {
        throw new Error('Invalid or missing OAuth state parameter');
    }

    const url = `${getGithubUrl()}/login/oauth/access_token`;
    const body = {
        client_id: env.get().config.GITHUB_CLIENT_ID,
        client_secret: env.get().config.GITHUB_CLIENT_SECRET,
        code
    };
    const options = {
        headers: {
            accept: 'application/json'
        }
    };

    const providerResp = await axios.post(url, body, options);

    repositories.set('githubrepo');
    const repo = repositories.get();
    const fullUser = await repo.userAsync(providerResp.data.access_token);
    const user = {
        username: fullUser.login,
        repos_url: fullUser.repos_url
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
    getGithubUrl,
    name
};
