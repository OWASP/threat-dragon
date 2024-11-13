import axios from 'axios';
import { expect } from 'chai';
import sinon from 'sinon';

import env from '../../src/env/Env.js';
import googleProvider from '../../src/providers/google.js';

describe('providers/google.js', () => {
    describe('isConfigured', () => {
        it('returns true if GOOGLE_CLIENT_ID is set', () => {
            const config = { GOOGLE_CLIENT_ID: '1234567' };
            sinon.stub(env, 'get').returns({ config });
            expect(googleProvider.isConfigured()).to.be.true;
        });

        it('returns false if GOOGLE_CLIENT_ID is not set', () => {
            expect(googleProvider.isConfigured()).to.be.false;
        });
    });

    describe('getOauthRedirectUrl', () => {
        const config = { GOOGLE_CLIENT_ID: '1234567' };
    
        it('contains the Google OAuth URL', () => {
            expect(googleProvider.getOauthRedirectUrl()).to
                .contain('https://accounts.google.com/o/oauth2/auth');
        });
    
        it('adds the client_id', () => {
            sinon.stub(env, 'get').returns({ config });
            expect(googleProvider.getOauthRedirectUrl()).to
                .contain(`client_id=${config.GOOGLE_CLIENT_ID}`);
        });
    
        it('uses the default scope', () => {
            expect(googleProvider.getOauthRedirectUrl()).to
                .contain('scope=openid email profile');  // Do not use URL-encoded scopes in the test
        });
    
        it('uses the configured scope', () => {
            const scopedCfg = Object.assign({}, config, {
                GOOGLE_SCOPE: 'email profile'
            });
            sinon.stub(env, 'get').returns({ config: scopedCfg });
            expect(googleProvider.getOauthRedirectUrl()).to
                .contain('scope=email profile');  // No need to URL-encode in the test case
        });
    });

    describe('getOauthReturnUrl', () => {
        const code = '1234-5678';

        describe('simulated production', () => {
            beforeEach(() => {
                sinon.stub(env, 'get').returns({
                    config: {
                        NODE_ENV: 'simulated production'
                    }
                });
            });

            it('gives a relative url when not in development mode', () => {
                const idx = googleProvider.getOauthReturnUrl(code).indexOf('/#/oauth-return');
                expect(idx).to.eq(0);
            });

            it('adds the code as a query param', () => {
                expect(googleProvider.getOauthReturnUrl(code)).to
                    .contain(`code=${code}`);
            });
        });

        describe('development', () => {
            beforeEach(() => {
                sinon.stub(env, 'get').returns({
                    config: {
                        NODE_ENV: 'development'
                    }
                });
            });

            it('returns an absolute url with the front-end port', () => {
                const idx = googleProvider.getOauthReturnUrl(code).indexOf('http://localhost:8080');
                expect(idx).to.eq(0);
            });
        });
    });

    describe('completeLoginAsync', () => {
        const config = {
            GOOGLE_CLIENT_ID: '12345678',
            GOOGLE_CLIENT_SECRET: '098765432109865432',
            GOOGLE_REDIRECT_URI: 'http://localhost:8080/oauth-callback'
        };
        const code = 'mycode';

        beforeEach(async () => {
            sinon.stub(axios, 'post').resolves({ data: { access_token: '' }});
            sinon.stub(axios, 'get').resolves({ data: { name: 'John Doe', email: 'john.doe@example.com', picture: 'https://example.com/pic.jpg' }});
            sinon.stub(env, 'get').returns({ config });

            await googleProvider.completeLoginAsync(code);
        });

        it('gets the access_token from Google', () => {
            expect(axios.post).to.have.been.calledWith(
                'https://oauth2.googleapis.com/token',
                new URLSearchParams({
                    client_id: config.GOOGLE_CLIENT_ID,
                    client_secret: config.GOOGLE_CLIENT_SECRET,
                    code,
                    grant_type: 'authorization_code',
                    redirect_uri: config.GOOGLE_REDIRECT_URI
                }),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );
        });

        it('fetches the user info from Google', () => {
            expect(axios.get).to.have.been.calledWith(
                `https://www.googleapis.com/oauth2/v1/userinfo?access_token=`
            );
        });
    });
});
