import axios from 'axios';
import bitbucketProvider from '../../src/providers/bitbucket.js';
import { expect } from 'chai';
import sinon from 'sinon';

import env from '../../src/env/Env.js';
import repo from '../../src/repositories/bitbucketrepo.js';

describe('providers/bitbucket.js', () => {
    describe('isConfigured', () => {
        it('returns true if BITBUCKET_CLIENT_ID is set', () => {
            const config = { BITBUCKET_CLIENT_ID: '1234567' };
            sinon.stub(env, 'get').returns({ config });
            expect(bitbucketProvider.isConfigured()).to.be.true;
        });

        it('returns false if BITBUCKET_CLIENT_ID is not set', () => {
            expect(bitbucketProvider.isConfigured()).to.be.false;
        });
    });

    describe('getOauthRedirectUrl', () => {
        const config = { BITBUCKET_CLIENT_ID: '1234567' };

        it('contains the bitbucket login oauth url', () => {
            expect(bitbucketProvider.getOauthRedirectUrl()).to
                .contain('https://bitbucket.org/site/oauth2/authorize');
        });

        it('adds the client_id', () => {
            sinon.stub(env, 'get').returns({ config });
            expect(bitbucketProvider.getOauthRedirectUrl()).to
                .contain(`client_id=${config.BITBUCKET_CLIENT_ID}`);
        });

        it('uses the default scope', () => {
            expect(bitbucketProvider.getOauthRedirectUrl()).to
                .contain('');
        });

        it('uses the configured scope', () => {
            const scopedCfg = Object.assign({}, config, {
                BITBUCKET_SCOPE: 'repo'
            });
            sinon.stub(env, 'get').returns({ config: scopedCfg });
            expect(bitbucketProvider.getOauthRedirectUrl()).to
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
                const idx = bitbucketProvider.getOauthReturnUrl(code).indexOf('/#/oauth-return');
                expect(idx).to.eq(0);
            });

            it('adds the code as a query param', () => {
                expect(bitbucketProvider.getOauthReturnUrl(code)).to
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
                const idx = bitbucketProvider.getOauthReturnUrl(code).indexOf('http://localhost:8080');
                expect(idx).to.eq(0);
            });
        });
    });

    describe('completeLoginAsync', () => {
        const config = {
            BITBUCKET_CLIENT_ID: '12345678',
            BITBUCKET_CLIENT_SECRET: '098765432109865432'
        };
        const code = 'mycode';

        beforeEach(async () => {
            sinon.stub(axios, 'post').resolves({ data: { access_token: '' }});
            sinon.stub(env, 'get').returns({ config });
            sinon.stub(repo, 'userAsync').resolves({});

            await bitbucketProvider.completeLoginAsync(code);
        });

        it('gets the access_token from bitbucket', () => {
            var form = new FormData();
            form.append('grant_type', 'authorization_code');
            form.append('client_id', config.BITBUCKET_CLIENT_ID);
            form.append('client_secret', config.BITBUCKET_CLIENT_SECRET);
            form.append('code', code);
            expect(axios.post).to.have.been.calledWith(
                'https://bitbucket.org/site/oauth2/access_token',
                form,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data; boundary=undefined',
                    }
                }
            );
        });

        it('gets the user info from the repo', () => {
            expect(repo.userAsync).to.have.been.calledOnce;
        });
    });
});