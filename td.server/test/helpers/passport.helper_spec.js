import { expect } from 'chai';
import sinon from 'sinon';

import encryptionHelper from '../../src/helpers/encryption.helper.js';
import passportHelper from '../../src/helpers/passport.helper.js';
import { logger } from '../../src/config/loggers.config.js';

describe('passport helper', () => {
    const user = {
        accessToken: 'token',
        profile: {
            username: 'user',
            provider: 'github',
            _json: {
                repos_url: 'some_url'
            }
        }
    };
    let doneFn;

    beforeEach(() => {
        doneFn = sinon.stub();
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('serializeUser', () => {
        const storedUserExpected = {
            accessToken: user.accessToken,
            profile: {
                username: user.profile.username,
                provider: user.profile.provider,
                repos_url: user.profile._json.repos_url
            }
        };

        describe('without error', () => {
            beforeEach(async () => {
                sinon.stub(encryptionHelper, 'encryptPromise').resolves(storedUserExpected);
                await passportHelper.serializeUser(user, doneFn);
            });
    
            it('returns the encrypted user', () => {
                expect(doneFn).to.have.been.calledWith(null, storedUserExpected);
            });
        });

        describe('with error', () => {
            const err = 'whoops';
            beforeEach(async () => {
                sinon.stub(encryptionHelper, 'encryptPromise').rejects(err);
                sinon.stub(logger, 'error');
                await passportHelper.serializeUser(user, doneFn);
            });

            it('provides done with an error', () => {
                expect(doneFn).to.have.been.calledWith(sinon.match.any);
            });

            it('logs the error', () => {
                expect(logger.error).to.have.been.calledOnce;
            });
        });
    });

    describe('deserializeUser', () => {
        beforeEach(() => {
            const stringifiedUser = JSON.stringify(user);
            sinon.stub(encryptionHelper, 'decrypt').returns(stringifiedUser);
            passportHelper.deserializeUser(stringifiedUser, doneFn);
        });

        it('deserializes the encrypted user', () => {
            expect(doneFn).to.have.been.calledWith(null, user);
        });
    });
});
