import crypto from 'crypto';

import cryptoPromise from './crypto.promise.js';
import env from '../env/Env.js';
import loggerHelper from './logger.helper.js';

const logger = loggerHelper.get('helpers/encryption.helper.js');

const inputEncoding = 'ascii';
const outputEncoding = 'base64';
const keyEncoding = 'ascii';
const algorithm = 'aes256';

/**
 * Gets the primary key used for encryption
 * @returns {Object}
 */
const getPrimaryKey = () => {
    const keys = JSON.parse(env.get().config.ENCRYPTION_KEYS);
    const primaryKey = keys.find((key) => key.isPrimary);

    if (!primaryKey) {
        const message = 'missing primary encryption key';
        logger.error(message);
        throw new Error(message);
    }

    return {
        id: primaryKey.id,
        value: Buffer.from(primaryKey.value, keyEncoding)
    };
};

/**
 * Gets a key by its id
 * Other keys can be used for decryption to support key expiry
 * @param {String} id
 * @returns {Object}
 */
const getKeyById = (id) => {
    const keys = JSON.parse(env.get().config.ENCRYPTION_KEYS);
    const key = keys.find((key) => key.id === id);

    if (!key) {
        const message = `Missing encryption key id: ${id}`;
        logger.error(message);
        throw new Error(message);
    }

    return {
        id: key.id,
        value: Buffer.from(key.value, keyEncoding)
    };
};

/**
 * Encrypts plaintext data using the given key and initialization vector
 * @param {String} plainText
 * @param {Object} key
 * @param {String} iv
 * @returns {Object}
 */
const encryptData = (plainText, key, iv) => {
    const encryptor = crypto.createCipheriv(algorithm, key.value, iv);
    let cipherText = encryptor.update(plainText, inputEncoding, outputEncoding);
    cipherText += encryptor.final(outputEncoding);
    return {
        keyId: key.id,
        iv: iv.toString(keyEncoding),
        data: cipherText
    };
};

/**
 * Decrypts a ciphertext using the given key and initialization vector
 * @param {String} cipherText
 * @param {Object} key
 * @param {String} iv
 * @returns {String}
 */
const decryptData = (cipherText, key, iv) => {
    const decryptor = crypto.createDecipheriv(algorithm, key.value, iv);
    const plainText = decryptor.update(cipherText, outputEncoding, inputEncoding);
    return `${plainText}${decryptor.final(inputEncoding)}`;
};

/**
 * Encrypts a plaintext to a ciphertext
 * This uses the configured encryption keys
 * Refer to development/environment.md for more information
 * @param {String} plainText
 * @returns {Promise<Object>}
 */
const encryptPromise = (plainText) => {
    const key = getPrimaryKey();
    logger.debug('Encrypting plaintext');

    return cryptoPromise.randomBytes(16).then((iv) => encryptData(plainText, key, iv));
};

/**
 * Decrypts a ciphertext using the configured encryption keys
 * Refer to development/environment.md for more information
 * @param {Object} encryptedData
 * @returns {String}
 */
const decrypt = (encryptedData) => {
    try {
        if (!encryptedData) {
            logger.error('No encrypted data provided for decryption');
            throw new Error('No encrypted data provided');
        }

        if (!encryptedData.iv) {
            logger.error('Missing initialization vector (IV) in encrypted data');
            throw new Error('Missing initialization vector (IV)');
        }

        if (!encryptedData.data) {
            logger.error('Missing data in encrypted data object');
            throw new Error('Missing encrypted data');
        }

        // Handle missing keyId by using the primary key (for backward compatibility)
        let key;
        if (!encryptedData.keyId && encryptedData.keyId !== 0) {
            logger.warn('Missing key ID in encrypted data, using primary key');
            key = getPrimaryKey();
        } else {
            logger.debug(`Decrypting data with key ID: ${encryptedData.keyId}`);
            key = getKeyById(encryptedData.keyId);
        }

        const iv = Buffer.from(encryptedData.iv, keyEncoding);

        try {
            return decryptData(encryptedData.data, key, iv);
        } catch (decryptError) {
            logger.error(`Error in decryption process: ${decryptError.message}`);
            logger.error(`Error stack: ${decryptError.stack}`);

            // If decryption fails with the specified key, try with the primary key as fallback
            if (encryptedData.keyId && encryptedData.keyId !== 0) {
                logger.warn(
                    `Decryption failed with key ID ${encryptedData.keyId}, trying primary key as fallback`
                );
                try {
                    const primaryKey = getPrimaryKey();
                    return decryptData(encryptedData.data, primaryKey, iv);
                } catch (fallbackError) {
                    logger.error(`Fallback decryption also failed: ${fallbackError.message}`);
                    throw new Error(`Decryption failed with all available keys`);
                }
            }

            throw new Error(`Decryption failed: ${decryptError.message}`);
        }
    } catch (error) {
        logger.error(`Encryption error: ${error.message}`);
        logger.error(`Error stack: ${error.stack}`);
        throw error;
    }
};

export default {
    decrypt,
    encryptPromise
};
