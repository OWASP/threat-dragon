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
    if (!authHeader || authHeader.indexOf('Bearer ') === -1) {
        return null;
    }

    return authHeader.split(' ')[1];
};

const middleware = (req, res, next) => {
    const token = getBearerToken(req.headers.authorization);
    if (!token) {
        logger.info('No bearer token found for a resource that requires authentication');
        return errors.unauthorized(res, logger);
    }

    try {
        const { provider, user } = jwt.verifyToken(token);
        req.provider = provider;
        req.user = user;
        return next();
    } catch (e) {
        if (e.name === 'TokenExpiredError') {
            logger.audit('Expired JWT encountered');
            return errors.unauthorized(res, logger);
        }
        
        logger.audit('Error decoding JWT');
        logger.error(e);
        return errors.badRequest('Invalid JWT', res, logger);
    }
};

export default {
    middleware
};
