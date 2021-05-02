import crypto, { createDecipheriv } from 'crypto';
import { expect } from 'chai';
import sinon from 'sinon';

import encryptionHelper from '../../src/helpers/encryption.helper.js';
import loggers from '../../src/config/loggers.config.js';

describe('encryption helper tests', () => {
    const plainText = 'test plain text';
    const encryptedText = 'encrypted';
    const randomIv = 'test random iv';
    const mockRandomBytes = (bytes, cb) => cb(null, randomIv);
    const sessionEncryptionKeys = 
    [
        {
            isPrimary: true,
            id: 0,
            value: 'testkey0'
        },
        {
            isPrimary: false,
            id: 1,
            value: 'testkey1'
        }
    ];
    const mockDecryptor = {
        update: () => '',
        final: () => ''
    };
    const mockCreateCipheriv = {
        update: () => '',
        final: () => ''
    };

    beforeEach(() => {
        process.env.SESSION_ENCRYPTION_KEYS = JSON.stringify(sessionEncryptionKeys);

        sinon.stub(crypto, 'createDecipheriv').returns(mockDecryptor);
        sinon.stub(crypto, 'createCipheriv').returns(mockCreateCipheriv);
        sinon.stub(crypto, 'randomBytes').callsFake(mockRandomBytes);
    });
    
    afterEach(() => {
        sinon.restore();
    });
    
    it('should log an invalid key error and throw', () => {
        const encryptedData = {
            keyId: 2,
            iv: 'test iv',
            data: 'test cipher text'
        };
        sinon.spy(loggers.logger, 'error');
        expect(() => encryptionHelper.decrypt(encryptedData)).to.throw();
        expect(loggers.logger.error).to.have.been.called;
    });
    
    it('should log an invalid primary key error and throw', () => {
        process.env.SESSION_ENCRYPTION_KEYS = JSON.stringify(
            [
                {
                    isPrimary: false,
                    id: 1,
                    value: 'testkey1'
                }
            ]
        );

        const cb = sinon.spy();
        sinon.spy(loggers.logger, 'fatal');
        expect(() => encryptionHelper.encrypt('test plain text', cb)).to.throw();
        expect(loggers.logger.fatal).to.have.been.called;
    });
    
    it('should decrypt with the specified key and iv', () => {
        const encryptionKey = sessionEncryptionKeys.find(x => x.id === 1);
        const encryptedData = {
            keyId: encryptionKey.id,
            iv: 'test iv',
            data: 'test cipher data'
        };

        encryptionHelper.decrypt(encryptedData);

        expect(crypto.createDecipheriv).to.have.been.calledWith(
            'aes256',
            Buffer.from(encryptionKey.value, 'ascii'),
            Buffer.from(encryptedData.iv, 'ascii')
        );
    });
    
    it('should decrypt the ciphertext', () => {
        const encryptedData = {
            keyId: 1,
            iv: 'test iv',
            data: 'test cipher text'
        };

        sinon.stub(mockDecryptor, 'update').returns('');
        sinon.stub(mockDecryptor, 'final').returns(plainText);

        expect(encryptionHelper.decrypt(encryptedData)).to.eq(plainText);
    });
    
    it('should encrypt with the primary key and a random iv', () => {
        const encryptionKey = sessionEncryptionKeys.find(x => x.isPrimary);

        const callback = sinon.spy();
        sinon.stub(mockCreateCipheriv, 'update').returns('');
        sinon.stub(mockCreateCipheriv, 'final').returns('');
        
        encryptionHelper.encrypt(plainText, callback);
        expect(crypto.createCipheriv).to.have.been.calledWith(
            'aes256',
            Buffer.from(encryptionKey.value, 'ascii'),
            randomIv
        );
    });
    
    it('should attach the key id and IV to the encrypted data', () => {
        const callback = sinon.spy();
        sinon.stub(mockCreateCipheriv, 'update').returns('');
        sinon.stub(mockCreateCipheriv, 'final').returns('');

        encryptionHelper.encrypt(plainText, callback);
        expect(callback).to.have.been.called;
        expect(mockCreateCipheriv.update).to.have.been.calledWith(
            plainText,
            'ascii',
            'base64'
        );
    });
    
    it('should encrypt the data', () => {
        const encryptionKey = sessionEncryptionKeys.find(x => x.isPrimary);
        const callback = sinon.spy();
        sinon.stub(mockCreateCipheriv, 'update').returns('');
        sinon.stub(mockCreateCipheriv, 'final').returns(encryptedText);

        encryptionHelper.encrypt(plainText, callback);
        expect(callback).to.have.been.calledWith(sinon.match({ 
            keyId: encryptionKey.id,
            iv: randomIv,
            data: encryptedText
        }));
    });
});
