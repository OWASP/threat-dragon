import env from '../env/Env.js';
import errors from './errors.js';
import jwtHelper from '../helpers/jwt.helper.js';
import loggerHelper from '../helpers/logger.helper.js';
import providers from '../providers/index.js';
import responseWrapper from './responseWrapper.js';
import tokenRepo from '../repositories/token.js';

const logger = loggerHelper.get('controllers/auth.js');

const login = (req, res) => {
    logger.debug(`API login request: ${logger.transformToString(req)}`);

    try {
        const providerName = req.params.provider;
        const provider = providers.get(providerName);
        return responseWrapper.sendResponse(
            () => provider.getOauthRedirectUrl(providerName),
            req,
            res,
            logger
        );
    } catch (err) {
        return errors.badRequest(err.message, res, logger);
    }
};

// Helper to get base URL for OAuth redirect
const getBaseUrl = (req, logger) => {
    let baseUrl = '';
    if (env.get().config.NODE_ENV === 'development') {
        logger.info('Using development environment base URL');
        baseUrl = 'http://localhost:8080';
    } else {
        // Try to determine the redirect URL from configured headers
        logger.info('Determining base URL from request headers');

        const host = req.get('x-forwarded-host') || req.get('host');
        logger.info(`Host header: ${host || 'none'}`);
        logger.info(`X-Forwarded-Host header: ${req.get('x-forwarded-host') || 'none'}`);

        // Take only the first protocol if multiple are provided in x-forwarded-proto
        const rawProto = req.get('x-forwarded-proto') || req.protocol || 'http';
        logger.info(`Protocol: ${rawProto || 'none'}`);
        logger.info(`X-Forwarded-Proto header: ${req.get('x-forwarded-proto') || 'none'}`);

        const protocol = (rawProto.split ? rawProto.split(',')[0].trim() : rawProto) + '://';
        logger.info(`Using protocol: ${protocol}`);

        if (host) {
            baseUrl = protocol + host;
            logger.info(`Constructed base URL: ${baseUrl}`);
        } else {
            logger.error('Could not determine host for redirect');
        }
    }
    return baseUrl;
};

const oauthReturn = (req, res) => {
    logger.info(`=== OAuth return callback received ===`);
    logger.info(`Provider from URL path: ${req.params.provider || 'none'}`);
    logger.info(
        `Auth code received: ${req.query.code ? `${req.query.code.substring(0, 10)}...` : 'none'}`
    );
    logger.info(`Auth code length: ${req.query.code?.length || 0}`);
    logger.info(`State parameter: ${req.query.state || 'none'}`);
    logger.info(`Request URL: ${req.url}`);
    logger.info(`Request method: ${req.method}`);
    logger.info(`Request headers: ${JSON.stringify(req.headers)}`);
    logger.debug(`API oauthReturn request: ${logger.transformToString(req)}`);

    // Get the base URL from the configured server or the request
    const baseUrl = getBaseUrl(req, logger);

    if (!baseUrl) {
        logger.error('Failed to determine base URL for redirect');
        return errors.serverError('Could not determine base URL for redirect', res, logger);
    }

    if (!req.query.code) {
        logger.error('No authorization code present in OAuth return');
        return errors.badRequest('No authorization code present in OAuth return', res, logger);
    }

    // Extract provider from state parameter
    const providerName = req.query.state;
    if (!providerName) {
        logger.error('No provider specified in state parameter');
        return errors.badRequest('No provider specified in state parameter', res, logger);
    }

    try {
        // Get the return URL from the provider with consistent format
        const provider = providers.get(providerName);
        const returnUrl = provider.getOauthReturnUrl(req.query.code);

        // In development mode, returnUrl already includes the full URL with hostname
        // In production, we need to prepend the baseUrl if it was successfully determined
        const fullReturnUrl =
            env.get().config.NODE_ENV === 'development' ? returnUrl : `${baseUrl}${returnUrl}`;

        logger.info(
            `Complete redirect URL: ${fullReturnUrl.replace(/code=[^&]+/u, 'code=REDACTED')}`
        );

        logger.info(`Redirecting to client application...`);
        return res.redirect(fullReturnUrl);
    } catch (err) {
        logger.error(`Error in OAuth return: ${err.message}`);
        return errors.badRequest(err.message, res, logger);
    }
};

// Helper to process OAuth login completion
const processOAuthLogin = async (providerName, code, logger, req) => {
    try {
        logger.info(`Processing OAuth login for provider: ${providerName}`);

        // Validate provider
        if (!providerName) {
            logger.error('No provider name specified');
            throw new Error('No provider name specified');
        }

        // Get available providers for better error messages
        const availableProviders = Object.keys(providers.all || {}).join(', ');
        logger.info(`Available providers: ${availableProviders}`);

        // Get the provider
        let provider;
        try {
            provider = providers.get(providerName);
            logger.info(`Provider ${providerName} found`);
        } catch (providerError) {
            logger.error(`Provider ${providerName} not found or not configured`);
            logger.error(`Provider error: ${providerError.message}`);
            throw new Error(
                `Provider ${providerName} not found or not configured. Available providers: ${availableProviders}`
            );
        }

        if (!provider) {
            logger.error(`Provider ${providerName} is null or undefined`);
            throw new Error(`Provider ${providerName} is null or undefined`);
        }

        // Validate authorization code
        if (!code) {
            logger.error('Missing authorization code');
            throw new Error('Missing authorization code in request body');
        }

        // Complete the login process with the provider
        logger.info(`Calling provider.completeLoginAsync with code length: ${code.length}`);
        let user, opts;
        try {
            // Call completeLoginAsync with just the code parameter to maintain compatibility with tests
            const result = await provider.completeLoginAsync(code);
            user = result.user;
            opts = result.opts;

            if (!user || !opts) {
                logger.error('Provider returned invalid user or options data');
                // Redact sensitive information from logs
                const safeUserData = { ...(user || {}) };
                if (safeUserData.email) safeUserData.email = '[REDACTED]';
                if (safeUserData.id) safeUserData.id = '[REDACTED]';

                const safeOptsData = { ...(opts || {}) };
                if (safeOptsData.access_token) safeOptsData.access_token = '[REDACTED]';
                if (safeOptsData.refresh_token) safeOptsData.refresh_token = '[REDACTED]';
                if (safeOptsData.id_token) safeOptsData.id_token = '[REDACTED]';

                logger.error(`User data: ${JSON.stringify(safeUserData)}`);
                logger.error(`Options data: ${JSON.stringify(safeOptsData)}`);
                throw new Error('Provider returned invalid user or options data');
            }

            if (!opts.access_token) {
                logger.error('Provider did not return an access token');
                throw new Error('Provider did not return an access token');
            }
        } catch (loginError) {
            logger.error(`Error in provider.completeLoginAsync: ${loginError.message}`);
            logger.error(`Error stack: ${loginError.stack}`);
            throw new Error(`OAuth provider login failed: ${loginError.message}`);
        }

        // Redact sensitive information from user data before logging
        const safeUserInfo = { ...(user || {}) };
        if (safeUserInfo.email) safeUserInfo.email = '[REDACTED]';
        if (safeUserInfo.id) safeUserInfo.id = '[REDACTED]';

        // Log both display name and actual username
        logger.info(
            `Got user info: ${JSON.stringify({
                ...safeUserInfo,
                username: safeUserInfo.username || 'unknown',
                actual_username: safeUserInfo.actual_username || safeUserInfo.username || 'unknown'
            })}`
        );

        // Only log the presence of tokens, not their values
        logger.info(
            `Provider options received: ${JSON.stringify({
                has_access_token: Boolean(opts?.access_token),
                has_refresh_token: Boolean(opts?.refresh_token),
                has_id_token: Boolean(opts?.id_token),
                token_type: opts?.token_type || 'none',
                expires_in: opts?.expires_in || 'none'
            })}`
        );

        // Create JWT tokens
        logger.info(`Creating JWT for ${provider.name}`);
        let accessToken, refreshToken;
        try {
            const tokens = await jwtHelper.createAsync(provider.name, opts, user);
            accessToken = tokens.accessToken;
            refreshToken = tokens.refreshToken;

            if (!accessToken || !refreshToken) {
                logger.error('Failed to create JWT tokens');
                throw new Error('Failed to create JWT tokens');
            }
        } catch (jwtError) {
            logger.error(`Error creating JWT: ${jwtError.message}`);
            logger.error(`Error stack: ${jwtError.stack}`);
            throw new Error(`Failed to create authentication tokens: ${jwtError.message}`);
        }

        logger.info(`JWT created successfully, length: ${accessToken?.length || 0}`);
        logger.info(`Refresh token created, length: ${refreshToken?.length || 0}`);

        // Store the refresh token
        try {
            tokenRepo.add(refreshToken);
            logger.info('Refresh token stored successfully');
        } catch (tokenError) {
            logger.error(`Error storing refresh token: ${tokenError.message}`);
            // Don't fail the process if token storage fails
        }

        logger.info(
            `Login completed successfully for ${user?.username || 'unknown'} (actual username: ${
                user?.actual_username || user?.username || 'unknown'
            }), ${user?.email || 'no email'}`
        );

        // Add audit logging for successful authentication
        const ipAddress = req?.ip ? ` from IP ${req.ip}` : '';
        logger.audit(
            `Authentication successful: User ${user?.username || 'unknown'} (actual username: ${
                user?.actual_username || user?.username || 'unknown'
            }) authenticated via ${provider.name} provider${ipAddress}`
        );

        return { accessToken, refreshToken, user };
    } catch (error) {
        logger.error(`Error in processOAuthLogin: ${error.message}`);
        logger.error(`Error stack: ${error.stack}`);

        // Add audit logging for authentication failures
        const ipAddress = req?.ip ? ` from IP ${req.ip}` : '';
        logger.audit(
            `Authentication failed: Error during OAuth login process for provider ${providerName}${ipAddress}: ${error.message}`
        );

        throw error;
    }
};

const completeLogin = (req, res) => {
    logger.info(`=== API completeLogin received for provider: ${req.params.provider} ===`);
    logger.info(
        `Code received: ${
            req.body.code ? `${req.body.code.substring(0, 10)}...` : 'none'
        }, length: ${req.body.code?.length || 0}`
    );
    logger.info(`Request headers: ${JSON.stringify(req.headers)}`);
    logger.info(`Request URL: ${req.url}`);
    logger.info(`Request method: ${req.method}`);
    logger.info(`Request IP: ${req.ip}`);
    logger.debug(`API completeLogin request: ${logger.transformToString(req)}`);

    try {
        // Validate request parameters
        if (!req.params.provider) {
            logger.error('No provider specified in request parameters');
            return errors.badRequest('No provider specified', res, logger);
        }

        if (!req.body.code) {
            logger.error('No authorization code provided in request body');
            return errors.badRequest('No authorization code provided', res, logger);
        }

        // Errors in here will return as server errors as opposed to bad requests
        return responseWrapper.sendResponseAsync(
            async () => {
                try {
                    logger.info(`Processing OAuth login for provider: ${req.params.provider}`);
                    logger.info(`With code length: ${req.body.code.length}`);

                    const result = await processOAuthLogin(
                        req.params.provider,
                        req.body.code,
                        logger,
                        req
                    );

                    if (!result || !result.accessToken) {
                        logger.error('OAuth login process did not return valid tokens');
                        throw new Error('Failed to obtain authentication tokens');
                    }

                    logger.info(`=== End of OAuth flow for ${req.params.provider} ===`);
                    logger.info(`Access token length: ${result.accessToken.length}`);
                    logger.info(`Refresh token length: ${result.refreshToken.length}`);

                    return {
                        accessToken: result.accessToken,
                        refreshToken: result.refreshToken
                    };
                } catch (error) {
                    logger.error(`Error in completeLoginAsync: ${error.message}`);
                    logger.error(`Error stack: ${error.stack}`);

                    if (error.response) {
                        logger.error(`Error response status: ${error.response.status}`);
                        logger.error(
                            `Error response data: ${JSON.stringify(error.response.data || {})}`
                        );
                        logger.error(
                            `Error response headers: ${JSON.stringify(
                                error.response.headers || {}
                            )}`
                        );
                    }

                    // Provide a more specific error message
                    const errorMessage =
                        error.message || 'Unknown error during OAuth login process';
                    throw new Error(`OAuth login failed: ${errorMessage}`);
                }
            },
            req,
            res,
            logger
        );
    } catch (err) {
        logger.error(`Error in completeLogin: ${err.message}`);
        logger.error(`Error stack: ${err.stack}`);
        return errors.badRequest(err.message, res, logger);
    }
};

const logout = (req, res) =>
    responseWrapper.sendResponse(
        () => {
            logger.debug(`API logout request: ${logger.transformToString(req)}`);

            try {
                const refreshToken = req.body.refreshToken;
                if (!refreshToken) {
                    logger.error('Log out without a refresh token');
                    // Return OK, it could be a client error or an expired token
                    return '';
                }

                logger.debug('Remove refresh token');
                tokenRepo.remove(refreshToken);

                // Add audit logging for logout events
                logger.audit(`User logged out: Token invalidated from IP ${req.ip || 'unknown'}`);

                return '';
            } catch (e) {
                logger.error(e);
                return '';
            }
        },
        req,
        res,
        logger
    );

const refresh = (req, res) => {
    logger.debug(`API refresh request: ${logger.transformToString(req)}`);

    const tokenBody = tokenRepo.verify(req.body.refreshToken);
    if (!tokenBody) {
        return errors.unauthorized(res, logger);
    }
    return responseWrapper.sendResponseAsync(
        async () => {
            const { provider, user } = tokenBody;
            const { accessToken } = await jwtHelper.createAsync(provider.name, provider, user);

            // Add audit logging for token refresh
            logger.audit(
                `Token refreshed: User ${user?.username || 'unknown'} (actual username: ${
                    user?.actual_username || user?.username || 'unknown'
                }) refreshed access token from IP ${req.ip || 'unknown'}`
            );

            // Limit the time refresh tokens live, so do not provide a new one.
            return { accessToken, refreshToken: req.body.refreshToken };
        },
        req,
        res,
        logger
    );
};

export default {
    completeLogin,
    login,
    logout,
    oauthReturn,
    refresh
};
