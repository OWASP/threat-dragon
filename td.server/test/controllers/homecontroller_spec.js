import { expect } from 'chai';
import sinon from 'sinon';

import homeController from '../../src/controllers/homecontroller.js';
import loggers from '../../src/config/loggers.config.js';

describe('homecontroller tests', () => {
    const mockRequest = {
        log: {
            info: () => {}
        },
        csrfToken: () => 'some_token',
        logOut: () => {},
        user: {
            profile: {
                username: 'test user',
                provider: 'idp'
            }
        },
        session: {
            destroy: () => {}
        }
    };

    const mockResponse = {
        sendFile: () => {},
        cookie: () => {},
        clearCookie: () => {},
        render: () => {},
        redirect: () => {}
    };
    
    afterEach(() => {
        sinon.restore();
    });

    describe('index', () => {
        beforeEach(() => {
            sinon.spy(mockResponse, 'cookie');
            sinon.spy(mockResponse, 'sendFile');
            sinon.spy(loggers.logger, 'error');
            homeController.index(mockRequest, mockResponse);
        });

        it('should send the home page file', () => {
            expect(mockResponse.sendFile).to.have.been.calledWith(sinon.match(/index\.html$/));
        });
        
        it('should set the csrf cookie', () => {
            expect(mockResponse.cookie).to.have.been.calledWith(
                'XSRF-TOKEN',
                mockRequest.csrfToken(),
                { httpOnly: false }
            );
        });

        it('should log the insecure csrf cookie', () => {
            expect(loggers.logger.error).to.have.been.calledWith(
                { security: true },
                sinon.match.string
            );
        });
    });

    describe('login', () => {
        beforeEach(() => {
            sinon.spy(mockResponse, 'render');
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
            sinon.spy(mockResponse, 'render');
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
            const mockDestroy = (cb) => cb();
            sinon.spy(mockRequest, 'logOut');
            sinon.spy(mockResponse, 'clearCookie');
            sinon.stub(mockRequest.session, 'destroy').callsFake(mockDestroy);
            sinon.spy(mockRequest.log, 'info');
            sinon.spy(mockResponse, 'redirect');
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
            process.env.NODE_ENV = 'simulated_production';
            sinon.spy(mockResponse, 'cookie');
            homeController.index(mockRequest, mockResponse);
        });

        afterEach(() => {
            process.env.NODE_ENV = 'development';
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
