import { expect } from 'chai';
import passport from 'passport';
import sinon from 'sinon';

import env from '../../src/env/Env.js';
import { getMockApp } from '../express.mocks.js';
import passportConfig from '../../src/config/passport.config.js';

describe('passport configuration tests', () => {
    let mockApp;
    const clientId = 'clientid',
        clientSecret = 'clientsecret';

    beforeEach(() => {
        mockApp = getMockApp();
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
        const mockEnv = {
            config: {
                IS_TEST: 'true',
                GITHUB_CLIENT_ID: clientId,
                GITHUB_CLIENT_SECRET: clientSecret
            }
        };

        beforeEach(() => {
            sinon.stub(env, 'get').returns(mockEnv);
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
        const mockEnv = {
            config: {
                IS_TEST: 'true',
                GITHUB_CLIENT_ID: clientId,
                GITHUB_CLIENT_SECRET: clientSecret,
                GITHUB_SCOPE: scope
            }
        };

        beforeEach(() => {
            sinon.stub(env, 'get').returns(mockEnv);
            passportConfig.config(mockApp);
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

    describe('with enterprise configuration hostname only', () => {
        const enterpriseHost = 'foobar.threatdragon.com';
        const mockEnv = {
            config: {
                IS_TEST: 'true',
                GITHUB_CLIENT_ID: clientId,
                GITHUB_CLIENT_SECRET: clientSecret,
                GITHUB_ENTERPRISE_HOSTNAME: enterpriseHost
            }
        };

        beforeEach(() => {
            sinon.stub(env, 'get').returns(mockEnv);
            passportConfig.config(mockApp);
        });

        it('uses the enterprise configuration', () => {
            const expected = new passportConfig.TestingStrategy({
                clientID: clientId,
                clientSecret: clientSecret,
                failureRedirect: 'login/github',
                scope: [ 'public_repo' ],
                authorizationURL: `https://${enterpriseHost}/login/oauth/authorize`,
                tokenURL: `https://${enterpriseHost}/login/oauth/access_token`,
                userProfileURL: `https://${enterpriseHost}/api/v3/user`
            });
            expect(passport.use).to.have.been.calledWith(expected);
        });
    });

    describe('with enterprise configuration custom port and protocol', () => {
        const enterpriseHost = 'foobar.threatdragon.com';
        const port = 5443;
        const protocol = 'http';
        const enterpriseUrl = 'http://foobar.threatdragon.com:5443';
        const mockEnv = {
            config: {
                IS_TEST: 'true',
                GITHUB_CLIENT_ID: clientId,
                GITHUB_CLIENT_SECRET: clientSecret,
                GITHUB_ENTERPRISE_HOSTNAME: enterpriseHost,
                GITHUB_ENTERPRISE_PORT: port,
                GITHUB_ENTERPRISE_PROTOCOL: protocol
            }
        };

        beforeEach(() => {
            sinon.stub(env, 'get').returns(mockEnv);
            passportConfig.config(mockApp);
        });

        it('uses the enterprise configuration', () => {
            const expected = new passportConfig.TestingStrategy({
                clientID: clientId,
                clientSecret: clientSecret,
                failureRedirect: 'login/github',
                scope: [ 'public_repo' ],
                authorizationURL: `${enterpriseUrl}/login/oauth/authorize`,
                tokenURL: `${enterpriseUrl}/login/oauth/access_token`,
                userProfileURL: `${enterpriseUrl}/api/v3/user`
            });
            expect(passport.use).to.have.been.calledWith(expected);
        });
    });
});
