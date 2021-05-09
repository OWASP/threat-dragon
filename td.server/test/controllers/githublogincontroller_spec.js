import { expect } from 'chai';
import sinon from 'sinon';

import controller from '../../src/controllers/githublogincontroller.js';
import { getMockRequest, getMockResponse } from '../express.mocks.js';
import provider from '../../src/providers/github.js';
import responseWrapper from '../../src/controllers/responseWrapper.js';

describe('controllers/githubblogincontroller.js', () => {
    const code = 'mycode';
    let mockReq, mockRes;

    beforeEach(() => {
        mockReq = getMockRequest();
        mockRes = getMockResponse();
        mockReq.query.code = code;
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('login', () => {
        beforeEach(() => {
            sinon.stub(provider, 'getOauthRedirectUrl');
            sinon.stub(responseWrapper, 'sendResponse');
            controller.login(mockReq, mockRes);
        });

        it('returns the redirect url using response wrapper', () => {
            expect(responseWrapper.sendResponse).to.have.been.calledWith(provider.getOauthRedirectUrl);
        });
    });

    describe('oauthReturn', () => {
        const returnUrl = 'foo';

        beforeEach(() => {
            sinon.stub(provider, 'getOauthReturnUrl').returns(returnUrl);
            controller.oauthReturn(mockReq, mockRes);
        });

        it('gets the return url using the provided code', () => {
            expect(provider.getOauthReturnUrl).to.have.been.calledWith(code);
        });

        it('redirects to the redirect url', () => {
            expect(mockRes.redirect).to.have.been.calledWith(returnUrl);
        });
    });

    describe('completeLogin', () => {
        const sendRespAsyncStub = async (p) => await p();

        beforeEach(async () => {
            sinon.stub(responseWrapper, 'sendResponseAsync').callsFake(sendRespAsyncStub);
            sinon.stub(provider, 'completeLoginAsync');
            await controller.completeLogin(mockReq, mockRes);
        });

        it('uses the response wrapper', () => {
            expect(responseWrapper.sendResponseAsync).to.have.been.calledOnce;
        });

        it('calls provider.completeLoginAsync using the provided code', () => {
            expect(provider.completeLoginAsync).to.have.been.calledWith(code);
        });
    });
});
