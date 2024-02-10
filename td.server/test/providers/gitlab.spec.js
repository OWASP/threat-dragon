import axios from 'axios';
import gitlabProvider from '../../src/providers/gitlab.js';
import { expect } from 'chai';
import sinon from 'sinon';

import env from '../../src/env/Env.js';
import repo from '../../src/repositories/gitlabrepo.js';

describe('providers/gitlab.js', () => {
    describe('isConfigured', () => {
        it('returns true if GITLAB_CLIENT_ID is set', () => {
            const config = { GITLAB_CLIENT_ID: '1234567' };
            sinon.stub(env, 'get').returns({ config });
            expect(gitlabProvider.isConfigured()).to.be.true;
        });

        it('returns false if GITLAB_CLIENT_ID is not set', () => {
            expect(gitlabProvider.isConfigured()).to.be.false;
        });
    });

    describe('getOauthRedirectUrl', () => {
        const config = { GITLAB_CLIENT_ID: '1234567' };

        it('contains the gitlab login oauth url', () => {
            expect(gitlabProvider.getOauthRedirectUrl()).to
                .contain('https://gitlab.com/oauth/authorize');
        });

        it('adds the client_id', () => {
            sinon.stub(env, 'get').returns({ config });
            expect(gitlabProvider.getOauthRedirectUrl()).to
                .contain(`client_id=${config.GITLAB_CLIENT_ID}`);
        });

        it('uses the default scope', () => {
            expect(gitlabProvider.getOauthRedirectUrl()).to
                .contain('');
        });

        it('uses the configured scope', () => {
            const scopedCfg = Object.assign({}, config, {
                GITLAB_SCOPE: 'repo'
            });
            sinon.stub(env, 'get').returns({ config: scopedCfg });
            expect(gitlabProvider.getOauthRedirectUrl()).to
                .contain('scope=repo');
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
                const idx = gitlabProvider.getOauthReturnUrl(code).indexOf('/#/oauth-return');
                expect(idx).to.eq(0);
            });

            it('adds the code as a query param', () => {
                expect(gitlabProvider.getOauthReturnUrl(code)).to
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
                const idx = gitlabProvider.getOauthReturnUrl(code).indexOf('http://localhost:8080');
                expect(idx).to.eq(0);
            });
        });
    });

    describe('completeLoginAsync', () => {
        const config = {
            GITLAB_CLIENT_ID: '12345678',
            GITLAB_CLIENT_SECRET: '098765432109865432',
            GITLAB_REDIRECT_URI: 'http://localhost:3000/api/oauth/return'
        };
        const code = 'mycode';

        beforeEach(async () => {
            sinon.stub(axios, 'post').resolves({ data: { access_token: '' }});
            sinon.stub(env, 'get').returns({ config });
            sinon.stub(repo, 'userAsync').resolves({});

            await gitlabProvider.completeLoginAsync(code);
        });

        it('gets the access_token from gitlab', () => {
            const data = {
                grant_type: 'authorization_code',
                client_id: config.GITLAB_CLIENT_ID,
                client_secret: config.GITLAB_CLIENT_SECRET,
                redirect_uri: config.GITLAB_REDIRECT_URI,
                code: code
            };
            expect(axios.post).to.have.been.calledWith(
                'https://gitlab.com/oauth/token',
                data,
                {
                    headers: {
                        'accept': 'application/json',
                    }
                }
            );
        });

        it('gets the user info from the repo', () => {
            expect(repo.userAsync).to.have.been.calledOnce;
        });
    });
});