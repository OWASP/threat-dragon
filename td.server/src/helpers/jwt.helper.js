import jsonwebtoken from 'jsonwebtoken';

import encryptionHelper from './encryption.helper.js';
import env from '../env/Env.js';

// TODO: Create unit tests

const createAsync = async (providerName, providerOptions, user) => {
    const key = env.get().config.JWT_SIGNING_KEY;
    const encryptedProviderOptions = await encryptionHelper.encryptPromise(JSON.stringify(providerOptions));  
    const provider = {
        [providerName]: encryptedProviderOptions
    };
    // TODO: Get better defaults for JWT signing options
    return jsonwebtoken.sign({ provider, user }, key, {
        expiresIn: '5m'
    });
};

export default {
    createAsync
};
