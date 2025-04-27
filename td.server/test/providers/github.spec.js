import axios from 'axios';
import { expect } from 'chai';
import sinon from 'sinon';

import env from '../../src/env/Env.js';
import githubProvider from '../../src/providers/github.js';
import repositories from '../../src/repositories/index.js';

describe('providers/github.js', () => {
    describe('isConfigured', () => {
        it('returns true if GITHUB_CLIENT_ID is set', () => {
            const config = { GITHUB_CLIENT_ID: '1234567' };
            sinon.stub(env, 'get').returns({ config });
            expect(githubProvider.isConfigured()).to.be.true;
        });

        it('returns false if GITHUB_CLIENT_ID is not set', () => {
            expect(githubProvider.isConfigured()).to.be.false;
        });
    });

    describe('getOauthRedirectUrl', () => {
        const config = { GITHUB_CLIENT_ID: '1234567' };

        it('contains the github login oauth url', () => {
            expect(githubProvider.getOauthRedirectUrl()).to.contain(
                'https://github.com/login/oauth/authorize'
            );
        });

        it('adds the client_id', () => {
            sinon.stub(env, 'get').returns({ config });
            expect(githubProvider.getOauthRedirectUrl()).to.contain(
                `client_id=${config.GITHUB_CLIENT_ID}`
            );
        });

        it('uses the default scope', () => {
            expect(githubProvider.getOauthRedirectUrl()).to.contain('scope=public_repo');
        });

        it('uses the configured scope', () => {
            const scopedCfg = Object.assign({}, config, {
                GITHUB_SCOPE: 'repo'
            });
            sinon.stub(env, 'get').returns({ config: scopedCfg });
            expect(githubProvider.getOauthRedirectUrl()).to.contain('scope=repo');
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
                const idx = githubProvider.getOauthReturnUrl(code).indexOf('/oauth-return');
                expect(idx).to.eq(0);
            });

            it('adds the code as a query param', () => {
                expect(githubProvider.getOauthReturnUrl(code)).to.contain(`code=${code}`);
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
                const idx = githubProvider.getOauthReturnUrl(code).indexOf('http://localhost:8080');
                expect(idx).to.eq(0);
            });
        });
    });

    describe('completeLoginAsync', () => {
        const config = {
            GITHUB_CLIENT_ID: '12345678',
            GITHUB_CLIENT_SECRET: '098765432109865432'
        };
        const code = 'mycode';

        beforeEach(async () => {
            sinon.stub(axios, 'post').resolves({ data: { access_token: 'test-access-token' } });
            sinon
                .stub(axios, 'get')
                .resolves({ data: { login: 'test-user', email: 'test@example.com' } });
            sinon.stub(env, 'get').returns({ config });
            sinon.stub(repositories, 'set').returns({});

            await githubProvider.completeLoginAsync(code);
        });

        it('gets the access_token from github', () => {
            expect(axios.post).to.have.been.calledWith(
                'https://github.com/login/oauth/access_token',
                {
                    client_id: config.GITHUB_CLIENT_ID,
                    client_secret: config.GITHUB_CLIENT_SECRET,
                    code,
                    redirect_uri: undefined
                },
                {
                    headers: {
                        accept: 'application/json'
                    }
                }
            );
        });

        it('gets the user info from GitHub API', () => {
            expect(axios.get).to.have.been.calledWith('https://api.github.com/user', {
                headers: {
                    Authorization: 'token test-access-token',
                    Accept: 'application/vnd.github.v3+json'
                }
            });
        });
    });
});
