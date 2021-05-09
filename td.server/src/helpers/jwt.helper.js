import jsonwebtoken from 'jsonwebtoken';

import encryptionHelper from './encryption.helper.js';
import env from '../env/Env.js';

const createAsync = async (providerName, providerOptions, user) => {
    const key = env.get().config.JWT_SIGNING_KEY;
    const encryptedProviderOptions = await encryptionHelper.encryptPromise(JSON.stringify(providerOptions));
    const providerOptsEncoded = encodeURIComponent(JSON.stringify(encryptedProviderOptions));
    const provider = {
        [providerName]: providerOptsEncoded
    };
    // Explore other options including issuer, scope, etc
    return jsonwebtoken.sign({ provider, user }, key, {
        expiresIn: '5m'
    });
};

const verifyToken = (token) => jsonwebtoken.verify(token, env.get().config.JWT_SIGNING_KEY);

export default {
    createAsync,
    verifyToken
};
