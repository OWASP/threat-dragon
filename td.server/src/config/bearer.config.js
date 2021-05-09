import encryptionHelper from '../helpers/encryption.helper.js';
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
        const providerName = Object.keys(provider)[0];
        const decodedProvider = JSON.parse(decodeURIComponent(provider[providerName]));
        req.provider = JSON.parse(encryptionHelper.decrypt(decodedProvider));
        req.user = user;
        return next();
    } catch (e) {
        // Catch a specific error or error code for an expired token
        // as opposed to an invalid token
        // expired should get unauthorized?
        req.log.error({ security: true }, 'Error decoding JWT');
        req.log.error({ security: true }, e);
        return errors.badRequest('Invalid JWT', res);
    }
};

export default {
    middleware
};
