'use strict';

var mockery =  require('mockery');
var mockCrypto;
var mockDecryptor;
var mockEncryptor;
var testRandomIV = 'test random IV';

describe('encryption helper tests', function() {

    beforeEach(function() {

        mockery.enable({ useCleanCache: true });
        mockery.warnOnUnregistered(false);
        mockery.warnOnReplace(false);

        process.env.SESSION_ENCRYPTION_KEYS = "[{\"isPrimary\": true, \"id\": 0, \"value\": \"testkey0\"}, {\"isPrimary\": false, \"id\": 1, \"value\": \"testkey1\"}]";

        //crypto mockery
        mockDecryptor = {
            update: function() { return 'plain '; },
            final: function() { return 'text'; }
        };

        mockEncryptor = {
            update: function() { return 'cipher '; },
            final: function() { return 'text'; }
        };

        mockCrypto = {
            createCipheriv: function() { return mockEncryptor; },
            createDecipheriv: function() { return mockDecryptor; },
            randomBytes: function(len, cb) { cb(null, testRandomIV); }
        };

        mockery.registerMock('crypto', mockCrypto);

    });
    
    afterEach(function() {
        mockery.disable();
    });

    afterAll(function() {
        mockery.deregisterAll();
    });
    
    it('should log an invalid key error and throw', function() {
        
        var testIV = 'test iv';
        var data = 'test cipher text';
        var encryptedData = {keyId: 2, iv: testIV, data: data};
        var mockLogger = {
            logger: {
                error: function() {},
                info: function() {}
            }
        };
        
        spyOn(mockLogger.logger, 'error');
        mockery.registerMock('../config/loggers.config', mockLogger);
        spyOn(mockCrypto,'createDecipheriv').and.callThrough();
        var cryptoHelper = require('../../src/helpers/encryption.helper');
        expect(function() {cryptoHelper.decrypt(encryptedData);}).toThrow();
        expect(mockLogger.logger.error).toHaveBeenCalled();
        
    });
    
    it('should log an invalid primary key error and throw', function() {
        
        var plainText = 'test plain text';
        process.env.SESSION_ENCRYPTION_KEYS = "[{\"isPrimary\": false, \"id\": 1, \"value\": \"testkey1\"}]";
        var mockLogger = {
            logger: {
                fatal: function() {},
                info: function() {}
            }
        };
        
        spyOn(mockLogger.logger, 'fatal');
        mockery.registerMock('../config/loggers.config', mockLogger);
        var cb = jasmine.createSpy('cb');
        var cryptoHelper = require('../../src/helpers/encryption.helper');
        expect(function() {cryptoHelper.encrypt(plainText, cb);}).toThrow();
        expect(mockLogger.logger.fatal).toHaveBeenCalled();
        
    });
    
    it('should decrypt with the specified key and iv', function() {
        
        var testIV = 'test iv';
        var data = 'test cipher text';
        var encryptedData = {keyId: 1, iv: testIV, data: data};
        var cryptoHelper = require('../../src/helpers/encryption.helper');
        spyOn(mockCrypto,'createDecipheriv').and.callThrough();
        cryptoHelper.decrypt(encryptedData);
        expect(mockCrypto.createDecipheriv.calls.argsFor(0)[1]).toEqual(new Buffer('testkey1', 'ascii'));
        expect(mockCrypto.createDecipheriv.calls.argsFor(0)[2]).toEqual(new Buffer(testIV, 'ascii'));
    });
    
    it('should decrypt the ciphertext', function() {
        
        var testIV = 'test iv';
        var data = 'test cipher text';
        var encryptedData = {keyId: 1, iv: testIV, data: data};
        var cryptoHelper = require('../../src/helpers/encryption.helper');
        var plainText = cryptoHelper.decrypt(encryptedData);
        expect(plainText).toEqual('plain text');
    });
    
    it('should encrypt with the primary key and a random iv', function() {
        
        var plainText = 'test plain text';
        var cryptoHelper = require('../../src/helpers/encryption.helper');
        var cb = jasmine.createSpy('cb');
        spyOn(mockCrypto,'createCipheriv').and.callThrough();
        cryptoHelper.encrypt(plainText, cb);
        expect(mockCrypto.createCipheriv.calls.argsFor(0)[1]).toEqual(new Buffer('testkey0', 'ascii'));
        expect(mockCrypto.createCipheriv.calls.argsFor(0)[2]).toEqual(testRandomIV);
    });
    
    it('should attach the key id and IV to the encrypted data', function() {
        
        var plainText = 'test plain text';
        var cryptoHelper = require('../../src/helpers/encryption.helper');
        var cb = jasmine.createSpy('cb');
        cryptoHelper.encrypt(plainText, cb);
        expect(cb).toHaveBeenCalled();
        expect(cb.calls.argsFor(0)[0].iv).toEqual(testRandomIV);
        expect(cb.calls.argsFor(0)[0].keyId).toEqual(0);        
    });
    
    it('should encrypt the data', function() {
        
        var plainText = 'test plain text';
        var cryptoHelper = require('../../src/helpers/encryption.helper');
        var cb = jasmine.createSpy('cb');
        cryptoHelper.encrypt(plainText, cb);
        expect(cb).toHaveBeenCalled();
        expect(cb.calls.argsFor(0)[0].data).toEqual('cipher text');    
    });
});