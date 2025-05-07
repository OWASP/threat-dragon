import errors from '../controllers/errors.js';
import jwt from '../helpers/jwt.helper.js';
import loggerHelper from '../helpers/logger.helper.js';

const logger = loggerHelper.get('config/bearer.config.js');

/**
 * Extracts the bearer token from the auth header
 * Returns null if there is not a valid bearer token
 * @param {String} authHeader
 * @returns {String|null}
 */
const getBearerToken = (authHeader) => {
    if (!authHeader) {
        logger.info('Bearer token not found, auth header is empty');
        return null;
    }

    if (!authHeader.startsWith('Bearer ')) {
        logger.warn('Bearer token keyword not found in auth header');
        return null;
    }

    return authHeader.split(' ')[1];
};

const middleware = (req, res, next) => {
    logger.debug(`Bearer token middleware processing request for: ${req.url}`);

    const token = getBearerToken(req.headers.authorization);
    if (!token) {
        logger.warn(`Bearer token not found for resource requiring authentication: ${req.url}`);
        // Add audit logging for missing token
        logger.audit(
            `Authorization failure: No bearer token provided for protected resource ${
                req.url
            } from IP ${req.ip || 'unknown'}`
        );
        return errors.unauthorized(res, logger);
    }

    try {
        logger.debug('Verifying JWT token');
        const decodedData = jwt.verifyToken(token);

        if (!decodedData) {
            logger.warn('JWT verification returned no data');
            // Add audit logging for invalid token
            logger.audit(
                `Authorization failure: JWT verification failed for request to ${req.url} from IP ${
                    req.ip || 'unknown'
                }`
            );
            return errors.unauthorized(res, logger);
        }

        const { provider, user } = decodedData;

        // Debug provider info
        logger.debug(
            `Provider from JWT: ${JSON.stringify({
                exists: Boolean(provider),
                name: provider?.name || 'unknown',
                hasAccessToken: provider && Boolean(provider.access_token)
            })}`
        );

        req.provider = provider;
        req.user = user;

        // Add audit logging for successful authorization
        logger.audit(
            `Authorization success: User ${user?.username || 'unknown'} authorized for ${
                req.url
            } from IP ${req.ip || 'unknown'}`
        );

        return next();
    } catch (e) {
        if (e.name === 'TokenExpiredError') {
            logger.error('Expired JWT encountered');
            // Add audit logging for expired token
            logger.audit(
                `Authorization failure: Expired JWT token for request to ${req.url} from IP ${
                    req.ip || 'unknown'
                }`
            );
            return errors.unauthorized(res, logger);
        }

        logger.error('Error decoding JWT');
        logger.error(e);
        // Add audit logging for invalid JWT
        logger.audit(
            `Authorization failure: Invalid JWT format or signature for request to ${
                req.url
            } from IP ${req.ip || 'unknown'}: ${e.message}`
        );
        return errors.badRequest('Invalid JWT', res, logger);
    }
};

export default {
    middleware
};
