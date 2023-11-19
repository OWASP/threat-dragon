import jsonwebtoken from 'jsonwebtoken';

import encryptionHelper from './encryption.helper.js';
import env from '../env/Env.js';

const createAsync = async (providerName, providerOptions, user) => {
    const encryptedProviderOptions = await encryptionHelper.encryptPromise(JSON.stringify(providerOptions));
    const providerOptsEncoded = Buffer.from(JSON.stringify(encryptedProviderOptions)).toString('base64');
    const provider = {
        [providerName]: providerOptsEncoded
    };
    // Explore other options including issuer, scope, etc
    const accessToken = jsonwebtoken.sign({ provider, user }, env.get().config.ENCRYPTION_JWT_SIGNING_KEY, {
        expiresIn: '1d'
    });

    const refreshToken = jsonwebtoken.sign({ provider, user }, env.get().config.ENCRYPTION_JWT_REFRESH_SIGNING_KEY, {
        expiresIn: '7d'
    });

    return { accessToken, refreshToken };
};

const decodeProvider = (encodedProvider) => {
    const providerName = Object.keys(encodedProvider)[0];
    const decodedProvider = JSON.parse(Buffer.from(encodedProvider[providerName], 'base64').toString('utf-8'));
    const provider = JSON.parse(encryptionHelper.decrypt(decodedProvider));
    provider.name = providerName;
    return provider;
};

const decode = (token, key) => {
    const { provider, user } = jsonwebtoken.verify(token, key);
    const decodedProvider = decodeProvider(provider);
    return {
        provider: decodedProvider,
        user
    };
};

const verifyToken = (token) => decode(token, env.get().config.ENCRYPTION_JWT_SIGNING_KEY);

const verifyRefresh = (token) => decode(token, env.get().config.ENCRYPTION_JWT_REFRESH_SIGNING_KEY);


export default {
    createAsync,
    verifyToken,
    verifyRefresh
};
