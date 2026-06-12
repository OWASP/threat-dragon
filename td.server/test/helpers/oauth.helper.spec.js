import { expect } from 'chai';
import sinon from 'sinon';

import env from '../../src/env/Env.js';
import oauthHelper from '../../src/helpers/oauth.helper.js';

describe('helpers/oauth.helper.js', () => {
    const code = '1234-5678';

    describe('getOauthReturnUrl', () => {
        describe('with OAUTH_FRONTEND_RETURN_URL configured', () => {
            beforeEach(() => {
                sinon.stub(env, 'get').returns({
                    config: {
                        OAUTH_FRONTEND_RETURN_URL: 'https://my.app'
                    }
                });
            });

            it('uses the configured frontend return url', () => {
                expect(oauthHelper.getOauthReturnUrl(code)).to
                    .contain('https://my.app');
            });

            it('adds the code as a query param', () => {
                expect(oauthHelper.getOauthReturnUrl(code)).to
                    .contain(`code=${code}`);
            });
        });

        describe('development', () => {
            beforeEach(() => {
                sinon.stub(env, 'get').returns({
                    config: { NODE_ENV: 'development' }
                });
            });

            it('returns an absolute url with the front-end port', () => {
                const idx = oauthHelper.getOauthReturnUrl(code).indexOf('http://localhost:8080');
                expect(idx).to.eq(0);
            });
        });

        describe('production', () => {
            beforeEach(() => {
                sinon.stub(env, 'get').returns({
                    config: { NODE_ENV: 'production' }
                });
            });

            it('gives a relative url', () => {
                const idx = oauthHelper.getOauthReturnUrl(code).indexOf('/#/oauth-return');
                expect(idx).to.eq(0);
            });

            it('adds the code as a query param', () => {
                expect(oauthHelper.getOauthReturnUrl(code)).to
                    .contain(`code=${code}`);
            });
        });
    });
});
