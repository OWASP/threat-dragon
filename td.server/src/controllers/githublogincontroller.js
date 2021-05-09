import provider from '../providers/github.js';
import responseWrapper from './responseWrapper.js';


const login = (req, res) => responseWrapper.sendResponse(provider.getOauthRedirectUrl, req, res);

const oauthReturn = (req, res) => {
    const redirectUrl = provider.getOauthReturnUrl(req.query.code);
    return res.redirect(redirectUrl);
};

const completeLogin = async (req, res) => await responseWrapper.sendResponseAsync(async () => {
    return await provider.completeLoginAsync(req.query.code);
}, req, res);


export default {
    completeLogin,
    login,
    oauthReturn
};
