import errors from '../controllers/errors.js';
import jwt from '../helpers/jwt.helper.js';

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
        req.log.info({ security: true }, 'No bearer token found for a resource that requires authentication');
        return errors.unauthorized(res);
    }

    try {
        const { provider, user } = jwt.verifyToken(token);
        req.provider = provider;
        req.user = user;
        return next();
    } catch (e) {
        if (e.name === 'TokenExpiredError') {
            req.log.debug({ security: true }, 'Expired JWT');
            return errors.unauthorized(res);
        }
        
        req.log.error({ security: true }, 'Error decoding JWT');
        req.log.error({ security: true }, e);
        return errors.badRequest('Invalid JWT', res);
    }
};

export default {
    middleware
};
