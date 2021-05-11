import jsonwebtoken from 'jsonwebtoken';

import encryptionHelper from './encryption.helper.js';
import env from '../env/Env.js';

const createAsync = async (providerName, providerOptions, user) => {
    const encryptedProviderOptions = await encryptionHelper.encryptPromise(JSON.stringify(providerOptions));
    const providerOptsEncoded = encodeURIComponent(JSON.stringify(encryptedProviderOptions));
    const provider = {
        [providerName]: providerOptsEncoded
    };
    // Explore other options including issuer, scope, etc
    const accessToken = jsonwebtoken.sign({ provider, user }, env.get().config.JWT_SIGNING_KEY, {
        expiresIn: '5m'
    });

    const refreshToken = jsonwebtoken.sign({ provider, user }, env.get().config.JWT_REFRESH_SIGNING_KEY, {
        expiresIn: '6h'
    });

    return { accessToken, refreshToken };
};

const verifyToken = (token) => jsonwebtoken.verify(token, env.get().config.JWT_SIGNING_KEY);

const verifyRefresh = (token) => jsonwebtoken.verify(token, env.get().config.JWT_REFRESH_SIGNING_KEY);

export default {
    createAsync,
    verifyToken,
    verifyRefresh
};
