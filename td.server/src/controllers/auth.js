import env from '../env/Env.js';
import errors from './errors.js';
import jwtHelper from '../helpers/jwt.helper.js';
import providers from '../providers/index.js';
import responseWrapper from './responseWrapper.js';

/**
 * Consider saving this somewhere other than in-memory
 * Every time the server restarts, we lose the refresh tokens
 * @type {Array<String>}
 */
const refreshTokens = [];

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
            refreshTokens.push(refreshToken);
            return {
                accessToken,
                refreshToken
            };
        }, req, res);
    } catch (err) {
        return errors.badRequest(err.message, res);
    }
};

const logout = (req, res) => {
    // Delete refresh token
    req.log.error('Not implemented');
    res.status(400).json({ status: 400, message: 'Not implemented on the server' });
};

// const refresh = (req, res) => {
//     // verify tokens
//     console.log('TODO');
// };

export default {
    completeLogin,
    login,
    logout,
    oauthReturn //,
    // refresh
};
