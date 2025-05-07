import loggerHelper from '../helpers/logger.helper.js';
import responseWrapper from './responseWrapper.js';

/**
 * Controller for handling Google token operations
 * Provides secure access to Google tokens for client-side operations
 */

const logger = loggerHelper.get('controllers/googleTokenController.js');

/**
 * Returns the Google access token from the provider information in the JWT
 * This is needed for client-side operations that require direct access to the Google token,
 * such as the Google Picker API.
 */
const getGoogleToken = (req, res) =>
    responseWrapper.sendResponseAsync(
        async () => {
            try {
                // Use await to ensure async function has await expression
                await Promise.resolve();
                logger.info(`Google token requested by user ${req.user?.username || 'unknown'}`);
                logger.info(`Request URL: ${req.url}`);
                logger.info(`Request method: ${req.method}`);

                // Log headers without authorization
                const safeHeaders = { ...req.headers };
                if (safeHeaders.authorization) safeHeaders.authorization = '[REDACTED]';
                logger.info(`Request headers: ${JSON.stringify(safeHeaders || {})}`);

                // Log JWT token information (without the actual token)
                if (req.headers.authorization) {
                    const authParts = req.headers.authorization.split(' ');
                    if (authParts.length === 2 && authParts[0] === 'Bearer') {
                        logger.info(`JWT token present, length: ${authParts[1].length}`);

                        // Try to extract some basic info from the JWT without decoding it
                        try {
                            const jwtParts = authParts[1].split('.');
                            if (jwtParts.length === 3) {
                                logger.info('JWT token has valid format (3 parts)');
                            } else {
                                logger.warn(
                                    `JWT token has invalid format (${jwtParts.length} parts)`
                                );
                            }
                        } catch (jwtError) {
                            logger.warn(`Error analyzing JWT format: ${jwtError.message}`);
                        }
                    } else {
                        logger.warn('Authorization header does not contain a Bearer token');
                    }
                } else {
                    logger.warn('No authorization header present');
                }

                // Log the full provider details to debug
                if (req.provider) {
                    // Create a safe copy of the provider object without sensitive data
                    const safeProvider = { ...req.provider };
                    if (safeProvider.access_token) safeProvider.access_token = '[REDACTED]';
                    if (safeProvider.refresh_token) safeProvider.refresh_token = '[REDACTED]';
                    if (safeProvider.id_token) safeProvider.id_token = '[REDACTED]';

                    logger.debug(
                        `Provider details in JWT: ${JSON.stringify({
                            providerExists: true,
                            providerName: req.provider.name || req.provider.provider_name || 'none',
                            hasAccessToken: Boolean(req.provider.access_token),
                            providerKeys: Object.keys(req.provider),
                            hasUser: Boolean(req.user),
                            userKeys: req.user ? Object.keys(req.user) : [],
                            provider: safeProvider
                        })}`
                    );
                } else {
                    logger.debug('No provider information in request');
                }

                // For security, only log that a token exists, not its value
                if (req.provider && req.provider.access_token) {
                    logger.debug(
                        `Access token is present (length: ${req.provider.access_token.length})`
                    );
                } else {
                    logger.debug('No access token found in provider');
                }

                // Validate that the user has a provider and token
                if (!req.provider) {
                    logger.warn('No provider information available in JWT');
                    throw new Error(
                        'No provider information available in JWT. Please sign in again.'
                    );
                }

                // Check for provider name in multiple places (for compatibility)
                const providerName = req.provider.name || req.provider.provider_name;

                logger.debug(`Provider name from JWT: ${providerName || 'unknown'}`);

                // More flexible provider name checking - accept any provider that has 'google' in the name
                if (!providerName || !providerName.toLowerCase().includes('google')) {
                    logger.warn(
                        `Wrong provider type: ${
                            providerName || 'unknown'
                        } (should contain 'google')`
                    );
                    logger.warn(`Provider keys: ${Object.keys(req.provider).join(', ')}`);
                    throw new Error(
                        `Authentication with Google is required. Current provider: ${
                            providerName || 'unknown'
                        }`
                    );
                }

                if (!req.provider.access_token) {
                    logger.warn('No Google access token available in JWT');
                    throw new Error(
                        'No Google access token available in JWT. Please sign in again.'
                    );
                }

                logger.info(`Google token request validated for provider: ${providerName}`);
                logger.info(`Access token length: ${req.provider.access_token.length}`);

                // Prevent caching of the token response
                res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
                res.set('Pragma', 'no-cache');
                res.set('Expires', '0');

                logger.debug('Successfully returning Google access token');

                return {
                    accessToken: req.provider.access_token
                };
            } catch (error) {
                logger.error(`Error in getGoogleToken: ${error.message}`);
                logger.error(`Error stack: ${error.stack}`);
                throw error;
            }
        },
        req,
        res,
        logger
    );

export default {
    getGoogleToken
};
