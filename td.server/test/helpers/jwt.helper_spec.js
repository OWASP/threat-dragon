import { expect } from 'chai';
import jsonwebtoken from 'jsonwebtoken';
import sinon from 'sinon';

import env from '../../src/env/Env.js';
import encryptionHelper from '../../src/helpers/encryption.helper.js';
import jwtHelper from '../../src/helpers/jwt.helper.js';

describe('helpers/jwt.helper.js', () => {
    const cipherText = 'foobar';
    const config = {
        JWT_SIGNING_KEY: 'asdfasdfasdf'
    };

    beforeEach(() => {
        sinon.stub(jsonwebtoken, 'sign');
        sinon.stub(env, 'get').returns({ config });
        sinon.stub(encryptionHelper, 'encryptPromise').resolves(cipherText)
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('createAsync', () => {
        const providerName = 'my provider';
        const providerOpts = { foo: 'bar' };
        const user = { username: 'my user' };

        beforeEach(async () => {
            await jwtHelper.createAsync(providerName, providerOpts, user);
        });

        it('encrypts the provider options', () => {
            expect(encryptionHelper.encryptPromise).to.have.been.calledWith(JSON.stringify(providerOpts));
        });

        it('uses the provider and user for the JWT', () => {
            const jwtObj = {
                provider: {
                    [providerName]: encodeURIComponent(JSON.stringify(cipherText))
                },
                user
            };
            expect(jsonwebtoken.sign).to.have.been.calledWith(
                jwtObj,
                sinon.match.any,
                sinon.match.any
            );
        });

        it('uses the JWT signing key', () => {
            expect(jsonwebtoken.sign).to.have.been.calledWith(
                sinon.match.any,
                config.JWT_SIGNING_KEY,
                sinon.match.any
            );
        });

        it('uses sensible options for the JWT', () => {
            expect(jsonwebtoken.sign).to.have.been.calledWith(
                sinon.match.any,
                config.JWT_SIGNING_KEY,
                {
                    expiresIn: '5m'
                }
            );
        });
    });

    describe('verifyToken', () => {
        const token = { foo: 'bar' };
        beforeEach(() => {
            sinon.stub(jsonwebtoken, 'verify');
            jwtHelper.verifyToken(token);
        });

        it('passes the token', () => {
            expect(jsonwebtoken.verify).to.have.been
                .calledWith(token, sinon.match.any);
        });

        it('passes the signing key', () => {
            expect(jsonwebtoken.verify).to.have.been
                .calledWith(sinon.match.any, config.JWT_SIGNING_KEY);
        });
    });
});
