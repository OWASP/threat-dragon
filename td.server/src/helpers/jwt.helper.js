import encryptionHelper from './encryption.helper.js';
import env from '../env/Env.js';
import jwt from 'jsonwebtoken';
import loggerHelper from '../helpers/logger.helper.js';

const createAsync = async (providerName, providerOptions, user) => {
    // Ensure provider name and keyId are set in the options
    const optionsWithName = {
        ...providerOptions,
        name: providerName, // Ensure name is explicitly set
        keyId: 0 // Add keyId to prevent warnings
    };

    const encryptedProviderOptions = await encryptionHelper.encryptPromise(
        JSON.stringify(optionsWithName)
    );
    const providerOptsEncoded = Buffer.from(JSON.stringify(encryptedProviderOptions)).toString(
        'base64'
    );
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
        env.get().config.ENCRYPTION_JWT_REFRESH_SIGNING_KEY,
        { expiresIn: '7d' } // 7 days
    );

    return { accessToken, refreshToken };
};

const decodeProvider = (encodedProvider) => {
    const logger = loggerHelper.get('helpers/jwt.helper.js');

    try {
        // Get the provider name from the encoded provider object
        const providerName = Object.keys(encodedProvider)[0];
        if (!providerName) {
            logger.error('No provider name found in encoded provider');
            throw new Error('No provider name found in encoded provider');
        }

        logger.debug(`Decoding provider data for: ${providerName}`);

        // Decode the base64 encoded provider data
        let decodedProvider;
        try {
            decodedProvider = JSON.parse(
                Buffer.from(encodedProvider[providerName], 'base64').toString('utf-8')
            );
            logger.debug(`Successfully decoded base64 provider data`);
        } catch (decodeError) {
            logger.error(`Error decoding base64 provider data: ${decodeError.message}`);
            throw new Error(`Failed to decode provider data: ${decodeError.message}`);
        }

        // Check if the decoded provider has the required fields for decryption
        if (!decodedProvider) {
            logger.error('Decoded provider is null or undefined');
            throw new Error('Decoded provider is null or undefined');
        }

        // Add keyId if it's missing (for backward compatibility)
        if (!decodedProvider.keyId && decodedProvider.data) {
            logger.warn('Adding missing keyId to provider data for backward compatibility');
            decodedProvider.keyId = 0; // Default key ID
        }

        // Decrypt the provider data
        let provider;
        try {
            provider = JSON.parse(encryptionHelper.decrypt(decodedProvider));
            logger.debug(`Successfully decrypted provider data`);
        } catch (decryptError) {
            logger.error(`Error decrypting provider data: ${decryptError.message}`);
            throw new Error(`Failed to decrypt provider data: ${decryptError.message}`);
        }

        // Ensure the provider name is set consistently
        provider.name = providerName;

        // For backward compatibility, also set provider_name
        if (!provider.provider_name) {
            provider.provider_name = providerName;
        }

        return provider;
    } catch (error) {
        logger.error(`Error in decodeProvider: ${error.message}`);
        logger.error(`Error stack: ${error.stack}`);
        throw error;
    }
};

const decode = (token, key) => {
    const logger = loggerHelper.get('helpers/jwt.helper.js');

    try {
        if (!token) {
            logger.error('No token provided for verification');
            throw new Error('No token provided');
        }

        // Verify the token
        logger.debug(`Verifying token (length: ${token.length})`);
        const decoded = jwt.verify(token, key);

        if (!decoded) {
            logger.error('JWT verification returned null/undefined');
            throw new Error('JWT verification failed');
        }

        if (!decoded.provider) {
            logger.error('JWT missing provider information');
            throw new Error('JWT missing provider information');
        }

        const { provider, user } = decoded;

        try {
            logger.debug('Decoding provider information from JWT');
            const decodedProvider = decodeProvider(provider);

            logger.debug(`Successfully decoded JWT for provider: ${decodedProvider.name}`);
            return {
                provider: decodedProvider,
                user
            };
        } catch (providerError) {
            logger.error(`Error decoding provider from JWT: ${providerError.message}`);
            logger.error(`Provider data: ${JSON.stringify(provider)}`);
            throw new Error(`Failed to decode provider data: ${providerError.message}`);
        }
    } catch (error) {
        logger.error(`Error verifying token: ${error.message}`);
        logger.error(`Error stack: ${error.stack}`);

        // Provide more specific error messages based on the type of error
        if (error.name === 'TokenExpiredError') {
            throw new Error('JWT token has expired');
        } else if (error.name === 'JsonWebTokenError') {
            throw new Error(`Invalid JWT: ${error.message}`);
        } else {
            throw new Error(`JWT verification error: ${error.message}`);
        }
    }
};

const verifyToken = (token) => decode(token, env.get().config.ENCRYPTION_JWT_SIGNING_KEY);

const verifyRefresh = (token) => decode(token, env.get().config.ENCRYPTION_JWT_REFRESH_SIGNING_KEY);

export default {
    decode,
    createAsync,
    verifyToken,
    verifyRefresh
};
