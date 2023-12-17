/**
 * @name bitbucket
 * @description Identity provider for Bitbucket OAuth
 */
import axios from 'axios';

import env from '../env/Env.js';
import repositories from "../repositories";

const name = 'bitbucket';

/**
 * Determines if the Bitbucket provider is configured
 * @returns {Boolean}
 */
const isConfigured = () => Boolean(env.get().config.BITBUCKET_CLIENT_ID);

/**
 * Gets the Bitbucket endpoint, which will be bitbucket.com by default OR a custom endpoint for Bitbucket enterprise
 * @returns {String}
 */
const getBitbucketUrl = () => {
    const enterpriseHostname = env.get().config.BITBUCKET_ENTERPRISE_HOSTNAME;
    if(enterpriseHostname) {
        const port = env.get().config.BITBUCKET_ENTERPRISE_PORT || '';
        const protocol = env.get().config.BITBUCKET_ENTERPRISE_PROTOCOL || 'https';
        return `${protocol}://${enterpriseHostname}${port ? ':' + port : ''}`;
    }
    return 'https://bitbucket.org';
};

/**
 * Gets the Bitbucket OAuth Login URL
 * @returns {String}
 */
const getOauthRedirectUrl = () => {
    const scope = env.get().config.BITBUCKET_SCOPE || '';
    return `${getBitbucketUrl()}/site/oauth2/authorize?scope=${scope}&response_type=code&client_id=${env.get().config.BITBUCKET_CLIENT_ID}`;
};

/**
 * Gets the return URL for our application, returning from bitbucket
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
    const url = `${getBitbucketUrl()}/site/oauth2/access_token`;
    const form = new FormData();
    form.append("grant_type", "authorization_code");
    form.append("client_id", env.get().config.BITBUCKET_CLIENT_ID);
    form.append("client_secret", env.get().config.BITBUCKET_CLIENT_SECRET);
    form.append("code", code);
    const options = {
        headers: {
            'Content-Type': `multipart/form-data; boundary=${form._boundary}`,
        }
    };

    repositories.set("bitbucketrepo");
    const repo = repositories.get();
    const providerResp = await axios.post(url, form, options);
    const fullUser = await repo.userAsync(providerResp.data.access_token);
    const user = {
        username: fullUser.display_name,
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
    name
};
