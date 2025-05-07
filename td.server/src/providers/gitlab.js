/**
 * @name gitlab
 * @description Identity provider for Gitlab OAuth
 */
import axios from 'axios';

import env from '../env/Env.js';
import loggerHelper from '../helpers/logger.helper.js';
import repositories from '../repositories/index.js';

const logger = loggerHelper.get('providers/gitlab.js');

const name = 'gitlab';

/**
 * Determines if the GitHub provider is configured
 * @returns {Boolean}
 */
const isConfigured = () => Boolean(env.get().config.GITLAB_CLIENT_ID);

/**
 * Gets the Gitlab endpoint, which will be gitlab.com by default OR a custom endpoint for Gitlab enterprise scenarios
 * @returns {String}
 */
const getGitlabUrl = () => env.get().config.GITLAB_HOST || 'https://gitlab.com';

/**
 * Gets the Gitlab OAuth Login URL
 * @param {String} providerName - The name of the provider to store in state
 * @returns {String}
 */
const getOauthRedirectUrl = (providerName) => {
    const scope =
        env.get().config.GITLAB_SCOPE || 'read_user write_repository profile read_api api';
    return `${getGitlabUrl()}/oauth/authorize?scope=${scope}&redirect_uri=${
        env.get().config.GITLAB_REDIRECT_URI
    }&response_type=code&client_id=${env.get().config.GITLAB_CLIENT_ID}&state=${providerName}`;
};

/**
 * Gets the return URL for our application, returning from gitlab
 * @param {string} code
 * @returns {String}
 */
const getOauthReturnUrl = (code) => {
    // Use the same format as Google provider (without the hash)
    let returnUrl = `/oauth-return?code=${code}`;
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
    logger.info('=========== GITLAB OAUTH TOKEN EXCHANGE START ===========');
    logger.info(`Starting GitLab completeLoginAsync with code length: ${code?.length || 0}`);
    logger.debug(`NODE_ENV: ${env.get().config.NODE_ENV}`);

    const url = `${getGitlabUrl()}/oauth/token`;
    logger.debug(`Token exchange URL: ${url}`);

    // Get the redirect URI from environment and ensure it uses HTTPS if needed
    let redirectUri = env.get().config.GITLAB_REDIRECT_URI;

    // If we're in production and the URI starts with http:// but we're using https,
    // update it to use https:// to match the actual protocol being used
    if (
        env.get().config.NODE_ENV === 'production' &&
        redirectUri &&
        redirectUri.startsWith('http://') &&
        (env.get().config.SERVER_API_PROTOCOL === 'https' ||
            env.get().config.APP_USE_TLS === 'true')
    ) {
        const httpsUri = redirectUri.replace('http://', 'https://');
        logger.info(`GitLab OAuth: Converting redirect URI from ${redirectUri} to ${httpsUri}`);
        redirectUri = httpsUri;
    }

    logger.debug(`GitLab OAuth: Using redirect URI: ${redirectUri}`);
    logger.debug(`GitLab client ID configured: ${Boolean(env.get().config.GITLAB_CLIENT_ID)}`);
    logger.debug(`GitLab client ID length: ${env.get().config.GITLAB_CLIENT_ID?.length || 0}`);
    logger.debug(
        `GitLab client secret configured: ${Boolean(env.get().config.GITLAB_CLIENT_SECRET)}`
    );
    logger.debug(
        `GitLab client secret length: ${env.get().config.GITLAB_CLIENT_SECRET?.length || 0}`
    );

    const body = {
        client_id: env.get().config.GITLAB_CLIENT_ID,
        client_secret: env.get().config.GITLAB_CLIENT_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        code
    };

    logger.info(`GitLab OAuth: Exchanging code for token at ${url}`);
    logger.debug(
        `GitLab OAuth: Request body: ${JSON.stringify({
            client_id: '[REDACTED]', // Don't log actual client ID
            code_length: code?.length || 0,
            redirect_uri: '[REDACTED_URI]' // Don't log actual URI
        })}`
    );

    const options = {
        headers: {
            accept: 'application/json'
        }
    };

    try {
        logger.debug(`GitLab OAuth: Sending token request to GitLab`);
        logger.debug(`GitLab OAuth: Request URL: ${url}`);
        logger.debug(`GitLab OAuth: Request method: POST`);
        logger.debug(`GitLab OAuth: Request headers: ${JSON.stringify(options.headers)}`);

        const providerResp = await axios.post(url, body, options);

        logger.info(`GitLab OAuth: Received token response from GitLab`);
        logger.debug(`GitLab OAuth: Response status: ${providerResp.status}`);
        logger.debug(
            `GitLab OAuth: Response has access_token: ${Boolean(providerResp.data.access_token)}`
        );
        logger.debug(`GitLab OAuth: Response has error: ${Boolean(providerResp.data.error)}`);

        if (providerResp.data.error) {
            logger.error(`GitLab OAuth Error: ${providerResp.data.error}`);
            logger.error(`GitLab OAuth Error Description: ${providerResp.data.error_description}`);
            throw new Error(
                `GitLab OAuth Error: ${
                    providerResp.data.error_description || providerResp.data.error
                }`
            );
        }

        logger.debug(
            `GitLab OAuth: Token exchange successful, received ${Object.keys(
                providerResp.data
            ).join(', ')}`
        );

        repositories.set('gitlabrepo');
        const repo = repositories.get();

        if (!providerResp.data.access_token) {
            logger.error(
                `GitLab OAuth: No access token received. Response: ${JSON.stringify(
                    providerResp.data
                )}`
            );
            throw new Error('No access token received from GitLab');
        }

        logger.info(`GitLab OAuth: Successfully obtained access token, fetching user info`);
        logger.debug(`GitLab OAuth: Getting user info with access token`);

        try {
            const fullUser = await repo.userAsync(providerResp.data.access_token);
            logger.info(`GitLab OAuth: User info received for ${fullUser.username}`);
            logger.debug(`GitLab OAuth: User info has name: ${Boolean(fullUser.name)}`);
            logger.debug(`GitLab OAuth: User info has email: ${Boolean(fullUser.email)}`);

            const user = {
                username: fullUser.username,
                email: fullUser.email,
                repos_url: fullUser.web_url
            };

            logger.info(`GitLab OAuth: Created user object with username: ${user.username}`);
            if (user.email) {
                // Don't log the actual email address
                logger.debug(`GitLab OAuth: Created user object with email: [REDACTED]`);
            }

            // Add audit logging for successful authentication
            logger.audit(
                `Authentication successful: User ${user.username} authenticated via GitLab OAuth`
            );

            logger.info('=========== GITLAB OAUTH TOKEN EXCHANGE COMPLETE ===========');

            return {
                user,
                opts: providerResp.data
            };
        } catch (userError) {
            logger.error(`GitLab OAuth: Error fetching user info: ${userError.message}`);
            if (userError.response) {
                logger.error(
                    `GitLab OAuth: User info response status: ${userError.response.status}`
                );
                logger.error(
                    `GitLab OAuth: User info response data: ${JSON.stringify(
                        userError.response.data || {}
                    )}`
                );
            }

            // Add audit logging for authentication failure
            logger.audit(
                `Authentication failed: Error fetching GitLab user info: ${userError.message}`
            );

            throw userError;
        }
    } catch (error) {
        logger.error(`GitLab OAuth Error: ${error.message}`);
        logger.error(`GitLab OAuth Error Stack: ${error.stack}`);

        if (error.response) {
            logger.error(
                `GitLab OAuth Error Response: ${JSON.stringify({
                    status: error.response.status,
                    statusText: error.response.statusText,
                    data: error.response.data
                })}`
            );
        }

        // Add audit logging for authentication failure
        logger.audit(`Authentication failed: GitLab OAuth error: ${error.message}`);

        logger.error('=========== GITLAB OAUTH TOKEN EXCHANGE FAILED ===========');
        throw error;
    }
};

export default {
    completeLoginAsync,
    getOauthReturnUrl,
    getOauthRedirectUrl,
    isConfigured,
    name
};
