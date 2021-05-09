import { expect } from 'chai';
import sinon from 'sinon';

import env from '../../src/env/Env.js';
import homeController from '../../src/controllers/homecontroller.js';
import { getMockRequest, getMockResponse } from '../express.mocks.js';

xdescribe('homecontroller tests', () => {
    let mockRequest, mockResponse;

    beforeEach(() => {
        mockRequest = getMockRequest();
        mockResponse = getMockResponse();
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('index', () => {
        beforeEach(() => {
            const mockEnv = {
                config: {
                    NODE_ENV: 'development'
                }
            };
            sinon.stub(env, 'get').returns(mockEnv);
            homeController.index(mockRequest, mockResponse);
        });

        it('should send the home page file', () => {
            expect(mockResponse.sendFile).to.have.been.calledWith(sinon.match(/index\.html$/));
        });
        
        it('should set the csrf cookie', () => {
            expect(mockResponse.cookie).to.have.been.calledWith(
                'XSRF-TOKEN',
                mockRequest.csrfToken(),
                { httpOnly: false, secure: false }
            );
        });

        it('should log the insecure csrf cookie', () => {
            expect(mockRequest.log.error).to.have.been.calledWith(
                { security: true },
                sinon.match.string
            );
        });
    });

    describe('login', () => {
        beforeEach(() => {
            homeController.login(mockRequest, mockResponse);
        });

        it('should pass the csrf token to the login page', () => {
            expect(mockResponse.render).to.have.been.calledWith(
                'login',
                { csrfToken: mockRequest.csrfToken() }
            );
        });
    });
    
    describe('logoutform', () => {
        beforeEach(() => {
            homeController.logoutform(mockRequest, mockResponse);
        });

        it('should pass the csrf token and username to the logout form', () => {
            expect(mockResponse.render).to.have.been.calledWith(
                'logoutform',
                {
                    csrfToken: mockRequest.csrfToken(),
                    username: mockRequest.user.profile.username
                }
            );
        });
    });
    
    describe('logout', () => {
        beforeEach(() => {
            homeController.logout(mockRequest, mockResponse);
        });

        it('should clear the CSRF cookie', () => {
            expect(mockResponse.clearCookie).to.have.been.calledWith('XSRF-TOKEN');
        });

        it('should clear the session cookie', () => {
            expect(mockResponse.clearCookie).to.have.been.calledWith('connect.sid');
        });

        it('should destroy the session', () => {
            expect(mockRequest.session.destroy).to.have.been.calledOnce;
        });

        it('should write the logout to the log', () => {
            expect(mockRequest.log.info).to.have.been.calledWith(
                {
                    security: true,
                    userName: mockRequest.user.profile.username,
                    idp: mockRequest.user.profile.provider
                },
                sinon.match.string
            );
        });

        it('should redirect the user', () => {
            expect(mockResponse.redirect).to.have.been.calledWith('/');
        });
    });
    
    describe('simulated production environment tests', function() {
        beforeEach(() => {
            const mockEnv = {
                config: {
                    NODE_ENV: 'simulated_production'
                }
            };
            sinon.stub(env, 'get').returns(mockEnv);
            homeController.index(mockRequest, mockResponse);
        });
        
        it('should set the secure flag on the XSRF cookie', function() {
            expect(mockResponse.cookie).to.have.been.calledWith(
                'XSRF-TOKEN',
                mockRequest.csrfToken(),
                {
                    httpOnly: false,
                    secure: true
                }
            );
        });
    });
});
