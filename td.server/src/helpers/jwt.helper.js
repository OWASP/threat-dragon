import jwt from 'jsonwebtoken';
import encryptionHelper from './encryption.helper.js';
import env from '../env/Env.js';

const createAsync = async (providerName, providerOptions, user) => {
    const encryptedProviderOptions = await encryptionHelper.encryptPromise(JSON.stringify(providerOptions));
    const providerOptsEncoded = Buffer.from(JSON.stringify(encryptedProviderOptions)).toString('base64');
    const provider = {
        [providerName]: providerOptsEncoded
    };

    const accessToken = jwt.sign(
        { provider, user },
        env.get().config.ENCRYPTION_JWT_SIGNING_KEY,
        { expiresIn: '1d' } // 1 day
    );

    const refreshToken = jwt.sign(
        { provider, user },
        env.get().config.ENCRYPTION_JWT_SIGNING_KEY,
        { expiresIn: '7d' } // 7 days
    );

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

    try {
        // Decode without verifying to inspect the token
        const decodedToken = jwt.decode(token, { complete: true });

        // Verify the token
        const { provider, user } = jwt.verify(token, key);

        const decodedProvider = decodeProvider(provider);
        return {
            provider: decodedProvider,
            user
        };
    } catch (error) {
        console.error('Error verifying token:', error.message);
        console.error('Error stack:', error.stack);
        throw new Error('Invalid JWT');
    }
};


const verifyToken = (token) => {
    return decode(token, env.get().config.ENCRYPTION_JWT_SIGNING_KEY);
};

const verifyRefresh = (token) => {
    return decode(token, env.get().config.ENCRYPTION_JWT_SIGNING_KEY);
};

export default {
    decode,
    createAsync,
    verifyToken,
    verifyRefresh
};