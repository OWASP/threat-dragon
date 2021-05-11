import env from '../env/Env.js';
import errors from './errors.js';
import jwtHelper from '../helpers/jwt.helper.js';
import providers from '../providers/index.js';
import responseWrapper from './responseWrapper.js';
import tokenRepo from '../repositories/token.js';

const login = (req, res) => {
    try {
        const provider = providers.get(req.params.provider);
        return responseWrapper.sendResponse(() => provider.getOauthRedirectUrl(), req, res);
    } catch (err) {
        return errors.badRequest(err.message, res);
    }
};

const oauthReturn = (req, res) => {
    let returnUrl = `/#/oauth-return?code=${req.query.code}`;
    if (env.get().config.NODE_ENV === 'development') {
        returnUrl = `http://localhost:8080${returnUrl}`;
    }
    return res.redirect(returnUrl);
};

const completeLogin = (req, res) => {
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
        }, req, res);
    } catch (err) {
        return errors.badRequest(err.message, res);
    }
};

const refresh = (req, res) => {
    const tokenBody = tokenRepo.verify(req.body.refreshToken);
    if (!tokenBody) {
        return errors.unauthorized(res);
    }
    return responseWrapper.sendResponseAsync(async () => {
        const { provider, user } = tokenBody;
        const { accessToken }  = await jwtHelper.createAsync(provider.name, provider, user);
        
        // Limit the time refresh tokens live, so do not provide a new one.
        return { accessToken, refreshToken: req.body.refreshToken };
    }, req, res);
};

const logout = (req, res) => {
    // Delete refresh token
    req.log.error('Not implemented');
    res.status(400).json({ status: 400, message: 'Not implemented on the server' });
};

export default {
    completeLogin,
    login,
    logout,
    oauthReturn,
    refresh
};
