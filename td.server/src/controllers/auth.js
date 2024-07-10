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
        const provider = providers.get(req.params.provider);
        return responseWrapper.sendResponse(() => provider.getOauthRedirectUrl(), req, res, logger);
    } catch (err) {
        return errors.badRequest(err.message, res, logger);
    }
};

const oauthReturn = (req, res) => {
    logger.debug(`API oauthReturn request: ${logger.transformToString(req)}`);

    let returnUrl = `/#/oauth-return?code=${req.query.code}`;
    if (env.get().config.NODE_ENV === 'development') {
        returnUrl = `http://localhost:8080${returnUrl}`;
    }
    return res.redirect(returnUrl);
};

const completeLogin = (req, res) => {
    logger.debug(`API completeLogin request: ${logger.transformToString(req)}`);

    try {
        const provider = providers.get(req.params.provider);

        // Errors in here will return as server errors as opposed to bad requests
        return responseWrapper.sendResponseAsync(async () => {
            const { user, opts } = await provider.completeLoginAsync(req.query.code);
            const { accessToken, refreshToken } = await jwtHelper.createAsync(provider.name, opts, user);
            tokenRepo.add(refreshToken);
            return {
                accessToken,
                refreshToken
            };
        }, req, res, logger);
    } catch (err) {
        return errors.badRequest(err.message, res, logger);
    }
};

const logout = (req, res) => responseWrapper.sendResponse(() => {
    logger.debug(`API logout request: ${logger.transformToString(req)}`);

    try {
        const refreshToken = req.body.refreshToken;
        if (!refreshToken) {
            logger.audit('Log out without a refresh token');
            // Return OK, it could be a client error or an expired token
            return '';
        }

        logger.debug('Remove refresh token');
        tokenRepo.remove(refreshToken);
        return '';
    } catch (e) {
        logger.error(e);
        return '';
    }
}, req, res, logger);

const refresh = (req, res) => {
    logger.debug(`API refresh request: ${logger.transformToString(req)}`);

    const tokenBody = tokenRepo.verify(req.body.refreshToken);
    if (!tokenBody) {
        return errors.unauthorized(res, logger);
    }
    return responseWrapper.sendResponseAsync(async () => {
        const { provider, user } = tokenBody;
        const { accessToken } = await jwtHelper.createAsync(provider.name, provider, user);

        // Limit the time refresh tokens live, so do not provide a new one.
        return { accessToken, refreshToken: req.body.refreshToken };
    }, req, res, logger);
};

export default {
    completeLogin,
    login,
    logout,
    oauthReturn,
    refresh
};
