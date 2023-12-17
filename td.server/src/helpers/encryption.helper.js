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

    return cryptoPromise.randomBytes(16).
        then((iv) => encryptData(plainText, key, iv));
};

/**
 * Decrypts a ciphertext using the configured encryption keys
 * Refer to development/environment.md for more information
 * @param {Object} encryptedData
 * @returns {String}
 */
const decrypt = (encryptedData) => {
    const iv = Buffer.from(encryptedData.iv, keyEncoding);
    const key = getKeyById(encryptedData.keyId);
    logger.debug('Decrypting ciphertext');

    return decryptData(encryptedData.data, key, iv);
};

export default {
    decrypt,
    encryptPromise
};
