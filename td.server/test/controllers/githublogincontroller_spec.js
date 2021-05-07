import { expect } from 'chai';
import passport from 'passport';
import sinon from 'sinon';

import cryptoPromise from '../../src/helpers/crypto.promise.js';
import githubLoginController from '../../src/controllers/githublogincontroller.js';

describe('githublogincontroller tests', () => {
    let mockRequest, next;
    const mockResponse = {
        status: () => {},
        send: () => {},
        redirect: () => {},
        json: () => {}
    };

    beforeEach(() => {
        mockRequest = {
            session: {},
            query: {},
            log: {
                info: () => {},
                error: () => {}
            },
            user: {
                profile: {
                    username: 'test user',
                    provider: 'github'
                }
            }
        };
        next = sinon.spy();
        sinon.stub(mockResponse, 'status').returns(mockResponse);
    });
    
    afterEach(() => {
        sinon.restore();
    });

    describe('doLogin', () => {
        describe('without oauth state', () => {
            const buff = Buffer.from('asdfasdf');

            beforeEach(async () => {
                sinon.stub(cryptoPromise, 'randomBytes').resolves(buff);
                sinon.spy(passport, 'authenticate');
                await githubLoginController.doLogin(mockRequest, mockResponse, next);
            });

            it('should set the github oauth state', () => {
                expect(mockRequest.session.githubOauthState.length).to.be.greaterThan(1);
            });

            it('should authenticate with passport', () => {
                expect(passport.authenticate).to.have.been.calledWith(
                    'github',
                    { state: buff.toString('hex') }
                );
            });
        });

        describe('with oauth state', () => {
            const oauthState = 'test value';

            beforeEach(async () => {
                mockRequest.session.githubOauthState = oauthState;
                sinon.spy(passport, 'authenticate');
                await githubLoginController.doLogin(mockRequest, mockResponse, next);
            });

            it('should not set the oauth state', () => {
                expect(mockRequest.session.githubOauthState).to.eq(oauthState);
            });

            it('should authenticate with passport', () => {
                expect(passport.authenticate).to.have.been.calledWith('github');
            });
        });

    });


    describe('completeLogin', () => {
        beforeEach(() => {

        });

        describe('with error', () => {
            beforeEach(() => {
                sinon.spy(mockRequest.log, 'error');
                sinon.spy(mockResponse, 'send');
            });

            it('logs an error for invalid oauth state', () => {
                mockRequest.session.githubOauthState = 'aaaa';
                mockRequest.query.state = 'bbbbb';
                githubLoginController.completeLogin(mockRequest, mockResponse, next);
                expect(mockRequest.log.error).to.have.been.calledWith(
                    {
                        security: true,
                        idp: 'github'
                    },
                    sinon.match('invalid oauth state value')
                );
            });

            it('logs an error for missing oauth state', () => {
                mockRequest.session.githubOauthState = 'aaaa';
                githubLoginController.completeLogin(mockRequest, mockResponse, next);
                expect(mockRequest.log.error).to.have.been.calledWith(
                    {
                        security: true,
                        idp: 'github'
                    },
                    sinon.match('invalid oauth state value')
                );
            });
        });

        describe('without error', () => {
            beforeEach(() => {
                mockRequest.session.githubOauthState = 'aaaa';
                mockRequest.query.state = 'aaaa';
                sinon.spy(mockRequest.log, 'info');
                sinon.spy(mockResponse, 'redirect');
            });

            it('logs a successful login', () => {
                githubLoginController.completeLogin(mockRequest, mockResponse, next);
                expect(mockRequest.log.info).to.have.been.calledWith(
                    {
                        security: true,
                        userName: mockRequest.user.profile.username,
                        idp: mockRequest.user.profile.provider
                    },
                    'logged in'
                );
            });

            it('redirects to the default route', () => {
                githubLoginController.completeLogin(mockRequest, mockResponse, next);
                expect(mockResponse.redirect).to.have.been.calledWith('/');
            });

            it('redirects to the specified route', () => {
                const returnTo = '/somewhere/else';
                mockRequest.session.returnTo = returnTo;
                githubLoginController.completeLogin(mockRequest, mockResponse, next);
                expect(mockResponse.redirect).to.have.been.calledWith(returnTo);
            });

            it('deletes the returnTo property', () => {
                const returnTo = '/somewhere/else';
                mockRequest.session.returnTo = returnTo;
                githubLoginController.completeLogin(mockRequest, mockResponse, next);
                expect(mockRequest.session.returnTo).to.be.undefined;
            });

            it('deletes the oauth state property', () => {
                githubLoginController.completeLogin(mockRequest, mockResponse, next);
                expect(mockRequest.session.githubOauthState).to.be.undefined;
            });
        });

    });
});
