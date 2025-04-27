/**
 * @name bitbucket
 * @description Identity provider for Bitbucket OAuth
 */
import axios from 'axios';

import env from '../env/Env.js';
import loggerHelper from '../helpers/logger.helper.js';
import repositories from '../repositories/index.js';

const logger = loggerHelper.get('providers/bitbucket.js');

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
    if (enterpriseHostname) {
        const port = env.get().config.BITBUCKET_ENTERPRISE_PORT || '';
        const protocol = env.get().config.BITBUCKET_ENTERPRISE_PROTOCOL || 'https';
        return `${protocol}://${enterpriseHostname}${port ? ':' + port : ''}`;
    }
    return 'https://bitbucket.org';
};

/**
 * Gets the Bitbucket OAuth Login URL
 * @param {String} providerName - The name of the provider to store in state
 * @returns {String}
 */
const getOauthRedirectUrl = (providerName) => {
    const scope = env.get().config.BITBUCKET_SCOPE || '';
    return `${getBitbucketUrl()}/site/oauth2/authorize?scope=${scope}&response_type=code&client_id=${
        env.get().config.BITBUCKET_CLIENT_ID
    }&state=${providerName}`;
};

/**
 * Gets the return URL for our application, returning from bitbucket
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
    logger.info('=========== BITBUCKET OAUTH TOKEN EXCHANGE START ===========');
    logger.info(`Starting BitBucket completeLoginAsync with code length: ${code?.length || 0}`);
    logger.debug(`NODE_ENV: ${env.get().config.NODE_ENV}`);

    const url = `${getBitbucketUrl()}/site/oauth2/access_token`;
    logger.debug(`Token exchange URL: ${url}`);

    logger.debug(
        `BitBucket client ID configured: ${Boolean(env.get().config.BITBUCKET_CLIENT_ID)}`
    );
    logger.debug(
        `BitBucket client ID length: ${env.get().config.BITBUCKET_CLIENT_ID?.length || 0}`
    );
    logger.debug(
        `BitBucket client secret configured: ${Boolean(env.get().config.BITBUCKET_CLIENT_SECRET)}`
    );
    logger.debug(
        `BitBucket client secret length: ${env.get().config.BITBUCKET_CLIENT_SECRET?.length || 0}`
    );

    const form = new FormData();
    form.append('grant_type', 'authorization_code');
    form.append('client_id', env.get().config.BITBUCKET_CLIENT_ID);
    form.append('client_secret', env.get().config.BITBUCKET_CLIENT_SECRET);
    form.append('code', code);

    logger.info(`BitBucket OAuth: Exchanging code for token at ${url}`);
    logger.debug(
        `BitBucket OAuth: Request form data prepared with code length: ${code?.length || 0}`
    );

    const options = {
        headers: {
            'Content-Type': `multipart/form-data; boundary=${form._boundary}`
        }
    };

    try {
        logger.debug(`BitBucket OAuth: Sending token request to BitBucket`);
        logger.debug(`BitBucket OAuth: Request URL: ${url}`);
        logger.debug(`BitBucket OAuth: Request method: POST`);

        repositories.set('bitbucketrepo');
        const repo = repositories.get();
        const providerResp = await axios.post(url, form, options);

        logger.info(`BitBucket OAuth: Received token response from BitBucket`);
        logger.debug(`BitBucket OAuth: Response status: ${providerResp.status}`);
        logger.debug(
            `BitBucket OAuth: Response has access_token: ${Boolean(providerResp.data.access_token)}`
        );
        logger.debug(`BitBucket OAuth: Response has error: ${Boolean(providerResp.data.error)}`);

        if (providerResp.data.error) {
            logger.error(`BitBucket OAuth Error: ${providerResp.data.error}`);
            logger.error(
                `BitBucket OAuth Error Description: ${providerResp.data.error_description}`
            );

            // Add audit logging for authentication failure
            logger.audit(
                `Authentication failed: BitBucket OAuth error: ${
                    providerResp.data.error_description || providerResp.data.error
                }`
            );

            throw new Error(
                `BitBucket OAuth Error: ${
                    providerResp.data.error_description || providerResp.data.error
                }`
            );
        }

        logger.debug(
            `BitBucket OAuth: Token exchange successful, received ${Object.keys(
                providerResp.data
            ).join(', ')}`
        );

        if (!providerResp.data.access_token) {
            logger.error(
                `BitBucket OAuth: No access token received. Response: ${JSON.stringify(
                    providerResp.data
                )}`
            );

            // Add audit logging for authentication failure
            logger.audit(`Authentication failed: No access token received from BitBucket`);

            throw new Error('No access token received from BitBucket');
        }

        logger.info(`BitBucket OAuth: Successfully obtained access token, fetching user info`);
        logger.debug(`BitBucket OAuth: Getting user info with access token`);

        try {
            const fullUser = await repo.userAsync(providerResp.data.access_token);
            // Use simple string format for logging to avoid colorize issues
            logger.info(`BitBucket OAuth: User info received for ${fullUser.display_name}`);

            // Get the Bitbucket workspace from environment
            const workspace = env.get().config.BITBUCKET_WORKSPACE;
            logger.debug(`BitBucket OAuth: Using workspace: ${workspace}`);

            // Create user object with both display_name and actual_username
            const user = {
                // Use display_name for UI display purposes
                username: fullUser.display_name,
                // Store the actual username for logging and identification
                actual_username: fullUser.actual_username || fullUser.nickname || fullUser.uuid,
                // Include other user information
                email: fullUser.email,
                repos_url: fullUser.repos_url,
                workspace: workspace // Include the workspace in the user object
            };

            // Use simple string logging to avoid colorize issues
            logger.info(`BitBucket OAuth: Created user object with display name: ${user.username}`);
            logger.info(
                `BitBucket OAuth: Created user object with actual username: ${user.actual_username}`
            );
            if (user.email) {
                // Don't log the actual email address
                logger.debug(`BitBucket OAuth: Created user object with email: [REDACTED]`);
            }

            // Add audit logging for successful authentication
            logger.audit(
                `Authentication successful: User ${user.username} authenticated via BitBucket OAuth`
            );

            logger.info('=========== BITBUCKET OAUTH TOKEN EXCHANGE COMPLETE ===========');

            return {
                user,
                opts: providerResp.data
            };
        } catch (userError) {
            // Simplify error logging to avoid colorize issues
            let errorMessage = `BitBucket OAuth: Error fetching user info: `;

            if (typeof userError === 'string') {
                errorMessage += userError;
            } else if (userError && userError.message) {
                errorMessage += userError.message;
            } else {
                errorMessage += 'Unknown error';
            }

            logger.error(errorMessage);

            // Log response details as simple strings
            if (userError && userError.response) {
                logger.error(
                    `BitBucket OAuth: User info response status: ${
                        userError.response.status || 'unknown'
                    }`
                );

                // Safely stringify response data
                try {
                    const responseData = userError.response.data || {};
                    const safeResponseData =
                        typeof responseData === 'object'
                            ? JSON.stringify(responseData)
                            : String(responseData);
                    logger.error(`BitBucket OAuth: User info response data: ${safeResponseData}`);
                } catch (stringifyError) {
                    logger.error(
                        `BitBucket OAuth: Could not stringify response data: ${stringifyError.message}`
                    );
                }
            }

            // Add audit logging for authentication failure
            logger.audit(
                `Authentication failed: Error fetching BitBucket user info: ${
                    userError.message || 'Unknown error'
                }`
            );

            throw userError;
        }
    } catch (error) {
        // Simplify error logging to avoid colorize issues
        let errorMessage = `BitBucket OAuth Error: `;

        if (typeof error === 'string') {
            errorMessage += error;
        } else if (error && error.message) {
            errorMessage += error.message;
        } else {
            errorMessage += 'Unknown error';
        }

        logger.error(errorMessage);

        // Log stack trace as a separate, simple string
        if (error && error.stack) {
            logger.error(`BitBucket OAuth Error Stack: ${error.stack}`);
        }

        // Safely log response details
        if (error && error.response) {
            try {
                const status = error.response.status || 'unknown';
                const statusText = error.response.statusText || 'unknown';

                logger.error(`BitBucket OAuth Error Response Status: ${status}`);
                logger.error(`BitBucket OAuth Error Response Status Text: ${statusText}`);

                // Handle response data carefully
                if (error.response.data) {
                    if (typeof error.response.data === 'string') {
                        logger.error(`BitBucket OAuth Error Response Data: ${error.response.data}`);
                    } else {
                        try {
                            const safeData = JSON.stringify(error.response.data);
                            logger.error(`BitBucket OAuth Error Response Data: ${safeData}`);
                        } catch (jsonError) {
                            logger.error(
                                `BitBucket OAuth Error Response Data: [Could not stringify data: ${jsonError.message}]`
                            );
                        }
                    }
                }
            } catch (responseError) {
                logger.error(
                    `BitBucket OAuth Error: Could not log response details: ${responseError.message}`
                );
            }
        }

        // Add audit logging for authentication failure
        logger.audit(
            `Authentication failed: BitBucket OAuth error: ${error.message || 'Unknown error'}`
        );

        logger.error('=========== BITBUCKET OAUTH TOKEN EXCHANGE FAILED ===========');
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
