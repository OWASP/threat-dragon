import { expect } from 'chai';
import sinon from 'sinon';

import env from '../../src/env/Env.js';
import homeController from '../../src/controllers/homecontroller.js';
import { getMockRequest, getMockResponse } from '../express.mocks.js';

describe('homecontroller tests', () => {
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
    });
    
    describe('logoutform', () => {
        beforeEach(() => {
            homeController.logoutform(mockRequest, mockResponse);
        });

        it('should pass the username to the logout form', () => {
            expect(mockResponse.render).to.have.been.calledWith(
                'logoutform',
                {
                    username: mockRequest.user.profile.username
                }
            );
        });
    });
    
    describe('logout', () => {
        beforeEach(() => {
            homeController.logout(mockRequest, mockResponse);
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
});
