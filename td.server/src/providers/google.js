/**
 * @name google
 * @description Identity provider for Google OAuth
 */
import axios from 'axios';
import env from '../env/Env.js';
import loggerHelper from '../helpers/logger.helper.js';

const name = 'google';

/**
 * Determines if the Google provider is configured
 * @returns {Boolean}
 */
const isConfigured = () => Boolean(env.get().config.GOOGLE_CLIENT_ID);

/**
 * Gets the Google OAuth Login URL
 * @param {String} providerName - The name of the provider to store in state
 * @returns {String}
 */
const getOauthRedirectUrl = (providerName) => {
    const scope = 'openid email profile https://www.googleapis.com/auth/drive.file';
    const redirectUri = env.get().config.GOOGLE_REDIRECT_URI;
    const clientId = env.get().config.GOOGLE_CLIENT_ID;
    return `https://accounts.google.com/o/oauth2/auth?response_type=code&scope=${scope}&client_id=${clientId}&redirect_uri=${encodeURIComponent(
        redirectUri
    )}&state=${providerName}`;
};

/**
 * Gets the return URL for our application, returning from Google
 * @param {string} code
 * @returns {String}
 */
const getOauthReturnUrl = (code) => {
    // Use a consistent format for the URL regardless of environment
    // For history mode routers, use a standard path without hash
    const path = `/oauth-return?code=${code}`;

    // In development, include the full localhost URL
    if (env.get().config.NODE_ENV === 'development') {
        return `http://localhost:8080${path}`;
    }

    // In production, use a relative path that will work with any protocol/host
    return path;
};

/**
 * Validates required Google OAuth configuration
 * @param {Object} logger - The logger instance
 * @throws {Error} If any required configuration is missing
 */
const validateConfiguration = (logger) => {
    logger.info(`NODE_ENV: ${env.get().config.NODE_ENV}`);
    logger.info(`Using redirect URI: ${env.get().config.GOOGLE_REDIRECT_URI}`);
    logger.info(`Google client ID configured: ${Boolean(env.get().config.GOOGLE_CLIENT_ID)}`);
    logger.info(`Google client ID length: ${env.get().config.GOOGLE_CLIENT_ID?.length || 0}`);
    logger.info(
        `Google client secret configured: ${Boolean(env.get().config.GOOGLE_CLIENT_SECRET)}`
    );
    logger.info(
        `Google client secret length: ${env.get().config.GOOGLE_CLIENT_SECRET?.length || 0}`
    );

    if (!env.get().config.GOOGLE_CLIENT_ID) {
        const error = new Error('Google OAuth client ID is not configured');
        logger.error(error.message);
        logger.audit(`Authentication failed: Google OAuth client ID is not configured`);
        throw error;
    }

    if (!env.get().config.GOOGLE_CLIENT_SECRET) {
        const error = new Error('Google OAuth client secret is not configured');
        logger.error(error.message);
        logger.audit(`Authentication failed: Google OAuth client secret is not configured`);
        throw error;
    }

    if (!env.get().config.GOOGLE_REDIRECT_URI) {
        const error = new Error('Google OAuth redirect URI is not configured');
        logger.error(error.message);
        logger.audit(`Authentication failed: Google OAuth redirect URI is not configured`);
        throw error;
    }
};

/**
 * Exchanges auth code for Google access token
 * @param {String} code - The authorization code
 * @param {Object} logger - The logger instance
 * @returns {Object} The token response data
 */
const exchangeCodeForToken = async (code, logger) => {
    const url = 'https://oauth2.googleapis.com/token';
    logger.info(`Token exchange URL: ${url}`);

    const body = {
        client_id: env.get().config.GOOGLE_CLIENT_ID,
        client_secret: env.get().config.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: env.get().config.GOOGLE_REDIRECT_URI
    };

    logger.info('Request body prepared with code and required parameters');

    const options = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    logger.info('Sending token request to Google OAuth endpoint');
    logger.info(`Request URL: ${url}`);
    logger.info(`Request method: POST`);
    logger.info(`Request headers: ${JSON.stringify(options.headers)}`);

    const providerResp = await axios.post(url, new URLSearchParams(body), options);

    logger.info('Received token response from Google');
    logger.info(`Response status: ${providerResp.status}`);
    logger.info(`Response has access_token: ${Boolean(providerResp.data?.access_token)}`);
    logger.info(`Response has refresh_token: ${Boolean(providerResp.data?.refresh_token)}`);
    logger.info(`Response has id_token: ${Boolean(providerResp.data?.id_token)}`);
    logger.info(`Response has token_type: ${providerResp.data?.token_type || 'none'}`);
    logger.info(`Response has expires_in: ${providerResp.data?.expires_in || 'none'}`);

    if (!providerResp.data || !providerResp.data.access_token) {
        logger.error(
            'No access token in Google response:',
            JSON.stringify(providerResp.data || {})
        );

        // Add audit logging for token validation failure
        logger.audit(`Authentication failed: No access token received from Google`);

        throw new Error('No access token received from Google');
    }

    return providerResp.data;
};

/**
 * Fetches user info using the access token
 * @param {String} accessToken - The access token
 * @param {Object} logger - The logger instance
 * @returns {Object} The user info
 */
const fetchUserInfo = async (accessToken, logger) => {
    logger.info('Successfully obtained access token, fetching user info');
    const tokenInfoUrl = `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`;
    logger.info(`User info URL: ${tokenInfoUrl}`);

    const userInfo = await axios.get(tokenInfoUrl);

    logger.info('Successfully fetched user info');
    logger.info(`User info status: ${userInfo.status}`);
    logger.info(`User info has name: ${Boolean(userInfo.data?.name)}`);
    logger.info(`User info has email: ${Boolean(userInfo.data?.email)}`);
    logger.info(`User info has picture: ${Boolean(userInfo.data?.picture)}`);

    return {
        username: userInfo.data.name,
        email: userInfo.data.email,
        picture: userInfo.data.picture
    };
};

/**
 * Logs error details from API responses
 * @param {Error} error - The error object
 * @param {String} url - The request URL
 * @param {Object} logger - The logger instance
 */
const logApiError = (error, url, logger) => {
    logger.error('Error in Google OAuth flow:', error.message);
    logger.error('Error stack:', error.stack);

    if (error.response) {
        logger.error('Response status:', error.response.status);
        logger.error('Response data:', JSON.stringify(error.response.data || {}));
        logger.error('Response headers:', JSON.stringify(error.response.headers || {}));
    } else if (error.request) {
        logger.error('No response received from Google. Request details:');
        logger.error('Request method: POST');
        logger.error(`Request URL: ${url}`);
    }
};

/**
 * Finishes the OAuth login, issues a JWT
 * @param {String} code
 * @returns {String} jwt
 */
const completeLoginAsync = async (code) => {
    // Use the proper logger
    const googleLogger = loggerHelper.get('providers/google.js');
    googleLogger.info('=========== GOOGLE OAUTH TOKEN EXCHANGE START ===========');
    googleLogger.info(
        'Starting Google completeLoginAsync with code:',
        code ? `${code.substring(0, 10)}...` : 'none'
    );
    googleLogger.info(`Authorization code length: ${code?.length || 0}`);

    try {
        // Validate configuration
        validateConfiguration(googleLogger);

        // Exchange code for token
        const tokenData = await exchangeCodeForToken(code, googleLogger);

        // Fetch user info
        const user = await fetchUserInfo(tokenData.access_token, googleLogger);

        // Redact sensitive information in logs
        googleLogger.info(`Created user object with username: ${user.username || '[UNKNOWN]'}`);
        googleLogger.info(`Created user object with email: [REDACTED]`);

        // Add audit logging for successful authentication
        googleLogger.audit(
            `Authentication successful: User ${
                user.username || '[UNKNOWN]'
            } authenticated via Google OAuth`
        );

        googleLogger.info('=========== GOOGLE OAUTH TOKEN EXCHANGE COMPLETE ===========');

        // Ensure the provider name is explicitly set in the options
        const opts = {
            ...tokenData,
            provider_name: 'google' // Add explicit provider name
        };

        return {
            user,
            opts
        };
    } catch (error) {
        // Log errors from API calls
        logApiError(error, 'https://oauth2.googleapis.com/token', googleLogger);

        // Add audit logging for authentication failure
        googleLogger.audit(`Authentication failed: Google OAuth error: ${error.message}`);

        googleLogger.error('=========== GOOGLE OAUTH TOKEN EXCHANGE FAILED ===========');
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
