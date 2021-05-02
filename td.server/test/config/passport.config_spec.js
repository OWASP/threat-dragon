import { expect } from 'chai';
import passport from 'passport';
import sinon from 'sinon';

import passportConfig from '../../src/config/passport.config.js';

describe('passport configuration tests', () => {
    const clientId = 'clientid',
        clientSecret = 'clientsecret',
        mockApp = {
            use: () => {}
        };

    process.env.IS_TEST = 'true';
    process.env.GITHUB_CLIENT_ID = clientId;
    process.env.GITHUB_CLIENT_SECRET = clientSecret;

    beforeEach(() => {
        sinon.stub(passport, 'initialize');
        sinon.stub(passport, 'session');
        sinon.stub(passport, 'use');
        sinon.stub(passport, 'serializeUser');
        sinon.stub(passport, 'deserializeUser');
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('default scope', () => {

        beforeEach(() => {
            passportConfig.config(mockApp);
        });

        it('initializes passport', () => {
            expect(passport.initialize).to.have.been.calledOnce;
        });

        it('sets up passport sessions', () => {
            expect(passport.session).to.have.been.calledOnce;
        });

        it('configures the strategy', () => {
            const expected = new passportConfig.TestingStrategy({
                clientID: clientId,
                clientSecret: clientSecret,
                failureRedirect: 'login/github',
                scope: [ 'public_repo' ]
            });
            expect(passport.use).to.have.been.calledWith(expected);
        });

        it('stores the user', () => {
            expect(passport.serializeUser).to.have.been.calledOnce;
        });

        it('deserializes the user', () => {
            expect(passport.deserializeUser).to.have.been.calledOnce;
        });
    });

    describe('with alternate scope', () => {
        const scope = 'blah';

        beforeEach(() => {
            process.env.GITHUB_SCOPE = scope;
            passportConfig.config(mockApp);
        });

        afterEach(() => {
            delete process.env.GITHUB_SCOPE;
        });

        it('uses the defined scope', () => {
            const expected = new passportConfig.TestingStrategy({
                clientID: clientId,
                clientSecret: clientSecret,
                failureRedirect: 'login/github',
                scope: [scope]
            });
            expect(passport.use).to.have.been.calledWith(expected);
        });
    });
});
