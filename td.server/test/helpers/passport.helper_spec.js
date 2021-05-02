import { expect } from 'chai';
import sinon from 'sinon';

import encryptionHelper from '../../src/helpers/encryption.helper.js';
import passportHelper from '../../src/helpers/passport.helper.js';

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
        doneFn = sinon.spy();
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

        beforeEach(() => {
            const encryptMock = (text, cb) => cb(text);
            sinon.stub(encryptionHelper, 'encrypt').callsFake(encryptMock);
            passportHelper.serializeUser(user, doneFn);
        });

        it('returns the encrypted the user', () => {
            expect(doneFn).to.have.been.calledWith(null, JSON.stringify(storedUserExpected));
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
