import { expect } from 'chai';

import { Env } from '../../src/env/Env.js';
import EncryptionEnv from '../../src/env/Encryption.js';

describe('env/Encryption.js', () => {
    let encryptionEnv;

    beforeEach(() => {
        encryptionEnv = new EncryptionEnv();
    });

    it('extends Env', () => {
        expect(encryptionEnv).is.instanceOf(Env);
    });

    it('is named encryption', () => {
        expect(encryptionEnv.name).to.eq('Encryption');
    });

    it('uses the ENCRYPTION_ prefix', () => {
        expect(encryptionEnv.prefix).to.eq('ENCRYPTION_');
    });

    it('has the required property KEYS', () => {
        const isRequired = encryptionEnv.properties
            .find(x => x.key === 'KEYS')
            .required;
        expect(isRequired).to.be.true;
    });

    it('has the required property JWT_SIGNING_KEY', () => {
        const isRequired = encryptionEnv.properties
            .find(x => x.key === 'JWT_SIGNING_KEY')
            .required;
        expect(isRequired).to.be.true;
    });

    it('has the required property JWT_REFRESH_SIGNING_KEY', () => {
        const isRequired = encryptionEnv.properties
            .find(x => x.key === 'JWT_REFRESH_SIGNING_KEY')
            .required;
        expect(isRequired).to.be.true;
    });
});
