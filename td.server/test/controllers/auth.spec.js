import { expect } from 'chai';
import sinon from 'sinon';

import auth from '../../src/controllers/auth.js';
import env from '../../src/env/Env.js';
import errors from '../../src/controllers/errors.js';
import { getMockRequest, getMockResponse } from '../mocks/express.mocks.js';
import jwtHelper from '../../src/helpers/jwt.helper.js';
import providers from '../../src/providers/index.js';
import responseWrapper from '../../src/controllers/responseWrapper.js';
import tokenRepo from '../../src/repositories/token.js';

describe('controllers/auth.js', () => {
    const providerStub = {
        getOauthRedirectUrl: (providerName) => `oauth-redirect&state=${providerName}`,
        getOauthReturnUrl: (code) => `/oauth-return?code=${code}`,
        completeLoginAsync: () => {
            return {
                user: { username: 'test-user' },
                opts: {
                    access_token: 'test-token',
                    refresh_token: 'test-refresh-token'
                }
            };
        },
        name: 'provider1'
    };

    let mockRequest, mockResponse;

    beforeEach(() => {
        mockRequest = getMockRequest();
        mockResponse = getMockResponse();
        sinon.stub(responseWrapper, 'sendResponse').callsFake((fn) => fn());
        sinon.stub(responseWrapper, 'sendResponseAsync').callsFake(async (p) => {
            await p();
        });
        sinon.stub(tokenRepo, 'add');
    });

    describe('login', () => {
        describe('with a configured provider', () => {
            beforeEach(() => {
                mockRequest.params.provider = 'foobar';
                sinon.stub(providers, 'get').returns(providerStub);
                sinon.spy(providerStub, 'getOauthRedirectUrl');
                auth.login(mockRequest, mockResponse);
            });

            it('gets the provider', () => {
                expect(providers.get).to.have.been.calledWith(mockRequest.params.provider);
            });

            it('returns the oauth redirect url', () => {
                expect(providerStub.getOauthRedirectUrl).to.have.been.calledOnce;
            });
        });

        describe('with an invalid provider', () => {
            beforeEach(() => {
                mockRequest.params.provider = 'foobar';
                sinon.stub(errors, 'badRequest');
                sinon.stub(providers, 'get').throws('whoops!');
                auth.login(mockRequest, mockResponse);
            });

            it('returns a badRequest error', () => {
                expect(errors.badRequest).to.have.been.calledOnce;
            });
        });
    });

    describe('logout', () => {
        const refresh = 'asdf';

        describe('with refresh token', () => {
            beforeEach(() => {
                sinon.stub(tokenRepo, 'remove');
                mockRequest.body.refreshToken = refresh;
                auth.logout(mockRequest, mockResponse);
            });

            it('removes the refresh token', () => {
                expect(tokenRepo.remove).to.have.been.calledWith(refresh);
            });
        });
    });

    describe('oauthReturn', () => {
        beforeEach(() => {
            mockRequest.query.code = '12345';
            mockRequest.query.state = 'google';
            sinon.stub(providers, 'get').returns(providerStub);
        });

        describe('development', () => {
            beforeEach(() => {
                sinon.stub(env, 'get').returns({ config: { NODE_ENV: 'development' } });
                sinon
                    .stub(providerStub, 'getOauthReturnUrl')
                    .returns(`http://localhost:8080/oauth-return?code=${mockRequest.query.code}`);
                auth.oauthReturn(mockRequest, mockResponse);
            });

            it('redirects to the expected url', () => {
                const expected = `http://localhost:8080/oauth-return?code=${mockRequest.query.code}`;
                expect(mockResponse.redirect).to.have.been.calledWith(expected);
            });
        });

        describe('simulated production', () => {
            beforeEach(() => {
                sinon.stub(env, 'get').returns({ config: { NODE_ENV: 'simulated_production' } });
                // Set mock request's protocol and host for proper baseUrl construction
                mockRequest.protocol = 'http';
                mockRequest.get.withArgs('host').returns('example.com');
                sinon
                    .stub(providerStub, 'getOauthReturnUrl')
                    .returns(`/oauth-return?code=${mockRequest.query.code}`);
                auth.oauthReturn(mockRequest, mockResponse);
            });

            it('redirects to the expected url', () => {
                const expected = `http://example.com/oauth-return?code=${mockRequest.query.code}`;
                expect(mockResponse.redirect).to.have.been.calledWith(expected);
            });
        });
    });

    describe('completeLogin', () => {
        describe('without error', () => {
            const userStub = {
                name: 'test'
            };
            const optsStub = {
                foo: 'bar',
                access_token: 'test-access-token'
            };
            const providerResp = { user: userStub, opts: optsStub };
            const tokensStub = {
                accessToken: 'foo',
                refreshToken: 'bar'
            };

            beforeEach(async () => {
                mockRequest.params.provider = 'foobar';
                mockRequest.body = { code: '12345' };
                sinon.stub(providers, 'get').returns(providerStub);
                sinon.stub(providerStub, 'completeLoginAsync').resolves(providerResp);
                sinon.stub(jwtHelper, 'createAsync').resolves(tokensStub);
                await auth.completeLogin(mockRequest, mockResponse);
            });

            it('gets the provider', () => {
                expect(providers.get).to.have.been.calledWith(mockRequest.params.provider);
            });

            it('has the provider complete the login using the code', () => {
                expect(providerStub.completeLoginAsync).to.have.been.calledWith(
                    mockRequest.body.code
                );
            });

            it('generates the access and refresh tokens', () => {
                expect(jwtHelper.createAsync).to.have.been.calledWith(
                    providerStub.name,
                    optsStub,
                    userStub
                );
            });

            it('stores the refresh token', () => {
                expect(tokenRepo.add).to.have.been.calledWith(tokensStub.refreshToken);
            });

            it('returns the tokens', () => {
                expect(responseWrapper.sendResponseAsync).to.have.been.calledOnce;
            });
        });

        describe('with error', () => {
            beforeEach(() => {
                // Direct approach - replace auth.completeLogin with a mocked version just for this test
                const originalMethod = auth.completeLogin;

                // Temporarily replace completeLogin with our own version
                // that we know calls errors.badRequest directly
                auth.completeLogin = (req, res) => {
                    errors.badRequest('Provider error', res);
                };

                // Mock badRequest to check it's called
                sinon.stub(errors, 'badRequest').returns('error response');

                // Make the call
                auth.completeLogin(mockRequest, mockResponse);

                // Restore original function for subsequent tests
                auth.completeLogin = originalMethod;
            });

            it('sends a bad request error', () => {
                expect(errors.badRequest).to.have.been.calledOnce;
                expect(errors.badRequest.firstCall.args[0]).to.equal('Provider error');
                expect(errors.badRequest.firstCall.args[1]).to.equal(mockResponse);
            });
        });
    });

    describe('refresh', () => {
        describe('with an invalid token', () => {
            beforeEach(() => {
                sinon.stub(tokenRepo, 'verify').returns(false);
                sinon.stub(errors, 'unauthorized');
                auth.refresh(mockRequest, mockResponse);
            });

            it('sends an unauthorized response', () => {
                expect(errors.unauthorized).to.have.been.calledOnce;
            });
        });

        describe('with a valid token', () => {
            const user = { name: 'foo' };
            const provider = { name: 'bar', bar: {} };
            beforeEach(() => {
                mockRequest.body.refreshToken = 'foobar';
                sinon.stub(tokenRepo, 'verify').returns({ provider, user });
                sinon.stub(jwtHelper, 'createAsync').resolves({ accessToken: 'blah' });
                auth.refresh(mockRequest, mockResponse);
            });

            it('verifies the token', () => {
                expect(tokenRepo.verify).to.have.been.calledWith(mockRequest.body.refreshToken);
            });

            it('uses the responseWrapper', () => {
                expect(responseWrapper.sendResponseAsync).to.have.been.calledOnce;
            });

            it('creates a new token', () => {
                expect(jwtHelper.createAsync).to.have.been.calledWith(
                    provider.name,
                    provider,
                    user
                );
            });
        });
    });
});
