/**
 * @name github
 * @description Identity provider for Github OAuth
 */
import axios from 'axios';

import env from '../env/Env.js';
import loggerHelper from '../helpers/logger.helper.js';
import repositories from '../repositories/index.js';

const logger = loggerHelper.get('providers/github.js');

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
    if (enterpriseHostname) {
        const port = env.get().config.GITHUB_ENTERPRISE_PORT || '';
        const protocol = env.get().config.GITHUB_ENTERPRISE_PROTOCOL || 'https';
        return `${protocol}://${enterpriseHostname}${port ? ':' + port : ''}`;
    }
    return 'https://github.com';
};

/**
 * Gets the Github OAuth Login URL
 * @param {String} providerName - The name of the provider to store in state
 * @returns {String}
 */
const getOauthRedirectUrl = (providerName) => {
    const scope = env.get().config.GITHUB_SCOPE || 'public_repo';
    return `${getGithubUrl()}/login/oauth/authorize?scope=${scope}&client_id=${
        env.get().config.GITHUB_CLIENT_ID
    }&state=${providerName}`;
};

/**
 * Gets the return URL for our application, returning from github
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
    logger.info('=========== GITHUB OAUTH TOKEN EXCHANGE START ===========');
    logger.info(`Starting GitHub completeLoginAsync with code length: ${code?.length || 0}`);
    logger.debug(`NODE_ENV: ${env.get().config.NODE_ENV}`);
    // Validate GitHub client credentials
    if (!env.get().config.GITHUB_CLIENT_ID) {
        logger.error('GitHub OAuth Error: GITHUB_CLIENT_ID is not configured');
        throw new Error('GitHub client ID is not configured');
    }

    if (!env.get().config.GITHUB_CLIENT_SECRET) {
        logger.error('GitHub OAuth Error: GITHUB_CLIENT_SECRET is not configured');
        throw new Error('GitHub client secret is not configured');
    }

    const url = `${getGithubUrl()}/login/oauth/access_token`;
    logger.debug(`Token exchange URL: ${url}`);

    // Get the redirect URI from environment and ensure it uses HTTPS if needed
    let redirectUri = env.get().config.GITHUB_REDIRECT_URI;

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
        logger.info(`GitHub OAuth: Converting redirect URI from ${redirectUri} to ${httpsUri}`);
        redirectUri = httpsUri;
    }

    logger.debug(`GitHub OAuth: Using redirect URI: ${redirectUri}`);
    logger.debug(`GitHub client ID configured: ${Boolean(env.get().config.GITHUB_CLIENT_ID)}`);
    logger.debug(`GitHub client ID length: ${env.get().config.GITHUB_CLIENT_ID?.length || 0}`);
    logger.debug(
        `GitHub client secret configured: ${Boolean(env.get().config.GITHUB_CLIENT_SECRET)}`
    );
    logger.debug(
        `GitHub client secret length: ${env.get().config.GITHUB_CLIENT_SECRET?.length || 0}`
    );

    const body = {
        client_id: env.get().config.GITHUB_CLIENT_ID,
        client_secret: env.get().config.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: redirectUri
    };

    logger.info(`GitHub OAuth: Exchanging code for token at ${url}`);

    // Log request details without sensitive information
    logger.debug(
        `GitHub OAuth: Request body: ${JSON.stringify({
            client_id: '[REDACTED]', // Don't log actual client ID
            code_length: code?.length || 0,
            redirect_uri: redirectUri ? '[REDACTED_URI]' : 'none' // Don't log actual URI
        })}`
    );

    const options = {
        headers: {
            accept: 'application/json'
        }
    };

    try {
        logger.debug(`GitHub OAuth: Sending token request to GitHub`);
        logger.debug(`GitHub OAuth: Request URL: ${url}`);
        logger.debug(`GitHub OAuth: Request method: POST`);
        logger.debug(`GitHub OAuth: Request headers: ${JSON.stringify(options.headers)}`);

        const providerResp = await axios.post(url, body, options);

        logger.info(`GitHub OAuth: Received token response from GitHub`);
        logger.debug(`GitHub OAuth: Response status: ${providerResp.status}`);

        // Log presence of tokens without revealing their values
        logger.debug(
            `GitHub OAuth: Response has access_token: ${Boolean(providerResp.data.access_token)}`
        );
        logger.debug(
            `GitHub OAuth: Response has refresh_token: ${Boolean(providerResp.data.refresh_token)}`
        );
        logger.debug(`GitHub OAuth: Response has error: ${Boolean(providerResp.data.error)}`);

        if (providerResp.data.error) {
            // Log error information (errors are generally safe to log)
            logger.error(`GitHub OAuth Error: ${providerResp.data.error}`);
            logger.error(`GitHub OAuth Error Description: ${providerResp.data.error_description}`);
            throw new Error(
                `GitHub OAuth Error: ${
                    providerResp.data.error_description || providerResp.data.error
                }`
            );
        }

        // Log keys received without revealing their values
        logger.debug(
            `GitHub OAuth: Token exchange successful, received keys: ${Object.keys(
                providerResp.data
            ).join(', ')}`
        );

        // Validate access token
        if (!providerResp.data.access_token) {
            logger.error(
                `GitHub OAuth: No access token received. Response: ${JSON.stringify(
                    providerResp.data
                )}`
            );
            throw new Error('No access token received from GitHub');
        }

        logger.info(`GitHub OAuth: Successfully obtained access token, fetching user info`);

        // Set up GitHub API URL for user info
        const githubApiUrl = env.get().config.GITHUB_ENTERPRISE_HOSTNAME
            ? `${getGithubUrl()}/api/v3/user`
            : 'https://api.github.com/user';

        logger.debug(`GitHub OAuth: Getting user info from ${githubApiUrl}`);

        try {
            // Make direct API call to GitHub to get user info
            const userResponse = await axios.get(githubApiUrl, {
                headers: {
                    Authorization: `token ${providerResp.data.access_token}`,
                    Accept: 'application/vnd.github.v3+json'
                }
            });

            if (!userResponse.data || !userResponse.data.login) {
                logger.error('GitHub OAuth: Invalid user data received');
                logger.error(`GitHub OAuth: User response: ${JSON.stringify(userResponse.data)}`);
                throw new Error('Invalid user data received from GitHub');
            }

            const fullUser = userResponse.data;

            // Log user info without revealing sensitive data
            logger.info(`GitHub OAuth: User info received for ${fullUser.login || '[UNKNOWN]'}`);
            logger.debug(`GitHub OAuth: User info has name: ${Boolean(fullUser.name)}`);
            logger.debug(`GitHub OAuth: User info has email: ${Boolean(fullUser.email)}`);

            // Don't log any actual user data that might be sensitive

            // Set repository for future use
            try {
                logger.debug('Setting repository to githubrepo');
                repositories.set('githubrepo');
                logger.debug('Repository set successfully');
            } catch (repoError) {
                // Log but don't fail if repository setting fails
                logger.warn(`Warning - Error setting repository: ${repoError.message}`);
                logger.warn(`This may cause issues with future operations`);
            }

            const user = {
                username: fullUser.login,
                email: fullUser.email,
                repos_url: fullUser.repos_url
            };

            logger.info(
                `GitHub OAuth: Created user object with username: ${user.username || '[UNKNOWN]'}`
            );
            if (user.email) {
                // Don't log the actual email address
                logger.debug(`GitHub OAuth: Created user object with email: [REDACTED]`);
            }

            // Add audit logging for successful authentication
            logger.audit(`User ${user.username} authenticated successfully via GitHub OAuth`);

            logger.info('=========== GITHUB OAUTH TOKEN EXCHANGE COMPLETE ===========');

            return {
                user,
                opts: providerResp.data
            };
        } catch (userError) {
            logger.error(`GitHub OAuth: Error fetching user info: ${userError.message}`);
            if (userError.response) {
                logger.error(
                    `GitHub OAuth: User info response status: ${userError.response.status}`
                );
                logger.error(
                    `GitHub OAuth: User info response data: ${JSON.stringify(
                        userError.response.data || {}
                    )}`
                );
            }
            throw new Error(`Failed to fetch GitHub user info: ${userError.message}`);
        }
    } catch (error) {
        logger.error(`GitHub OAuth Error: ${error.message}`);
        logger.error(`GitHub OAuth Error Stack: ${error.stack}`);

        if (error.response) {
            logger.error(
                `GitHub OAuth Error Response: ${JSON.stringify({
                    status: error.response.status,
                    statusText: error.response.statusText,
                    data: error.response.data
                })}`
            );
        }

        logger.info('=========== GITHUB OAUTH TOKEN EXCHANGE FAILED ===========');
        // Add audit logging for authentication failures
        logger.audit(`GitHub OAuth authentication failed: ${error.message}`);
        logger.error(`GitHub OAuth authentication failed: ${error.message}`);
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
