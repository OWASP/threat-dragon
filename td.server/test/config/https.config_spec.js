import { expect } from 'chai';
import sinon from 'sinon';

import env from '../../src/env/Env.js';
import { getMockRequest, getMockResponse } from '../express.mocks.js';
import httpsConfig from '../../src/config/https.config.js';

describe('config/https.config.js', () => {
    let req, res, next;

    beforeEach(() => {
        req = getMockRequest();
        res = getMockResponse();
        next = sinon.spy();
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('simulated production', () => {
        describe('upgrading an insecure request', () => {
            beforeEach(() => {
                res.secure = false;
                sinon.stub(env, 'get').returns({ config: { NODE_ENV: 'simulated_production' }});
                req.get.returns('http');
                httpsConfig.middleware(req, res, next);
            });

            it('redirects to https if the secure flag is not set', () => {
                expect(res.redirect).to.have.been.calledOnce;
            });

            it('does not call next', () => {
                expect(next).not.to.have.been.called;
            });
        });

        describe('allowing a secure request to continue', () => {
            beforeEach(() => {
                res.secure = true;
                sinon.stub(env, 'get').returns({ config: { NODE_ENV: 'simulated_production' }});
                req.get.returns('https');
                httpsConfig.middleware(req, res, next);
            });

            it('does not redirect', () => {
                expect(res.redirect).not.to.have.been.calledOnce;
            });

            it('calls next', () => {
                expect(next).to.have.been.calledOnce;
            });
        });
    });

    describe('development', () => {
        beforeEach(() => {
            res.secure = false;
            sinon.stub(env, 'get').returns({ config: { NODE_ENV: 'development' }});
            httpsConfig.middleware(req, res, next);
        });

        it('does not redirect', () => {
            expect(res.redirect).not.to.have.been.calledOnce;
        });

        it('calls next', () => {
            expect(next).to.have.been.calledOnce;
        });
    });
});
