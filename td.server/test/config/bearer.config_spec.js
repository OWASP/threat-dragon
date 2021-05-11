import { expect } from 'chai';
import sinon from 'sinon';

import bearer from '../../src/config/bearer.config.js';
import errors from '../../src/controllers/errors.js';
import { getMockRequest, getMockResponse } from '../express.mocks.js';
import jwt from '../../src/helpers/jwt.helper.js';

describe('config/bearer.config.js', () => {
    const validToken = 'asdf.asdf.asdf';
    let req, res, next;

    beforeEach(() => {
        req = getMockRequest();
        res = getMockResponse();
        next = sinon.spy();
        sinon.stub(errors, 'unauthorized');
        sinon.stub(errors, 'badRequest');
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('with a valid JWT', () => {
        const provider = { foo: 'bar' };
        const verifyResult = {
            provider: {
                'foobar': provider
            },
            user: {
                username: 'whatever'
            }
        };

        beforeEach(() => {
            req.headers.authorization = `Bearer ${validToken}`;
            sinon.stub(jwt, 'verifyToken').returns(verifyResult);
            bearer.middleware(req, res, next);
        });

        it('does not log an error', () => {
            expect(req.log.error).not.to.have.been.called;
        });

        it('sets the provider', () => {
            expect(req.provider).to.deep.eq(verifyResult.provider);
        });

        it('sets the user', () => {
            expect(req.user).to.deep.eq(verifyResult.user);
        });

        it('calls next', () => {
            expect(next).to.have.been.calledOnce;
        });
    });

    describe('without a bearer token', () => {
        beforeEach(() => {
            req.headers.authorization = validToken;
            bearer.middleware(req, res, next);
        });

        it('logs an informational message', () => {
            expect(req.log.info).to.have.been.calledOnce;
        });

        ('returns an unauthorized response', () => {
            expect(errors.unauthorized).to.have.been.calledWith(res);
        });
    });

    describe('without an auth header', () => {
        beforeEach(() => {
            bearer.middleware(req, res, next);
        });

        it('logs an informational message', () => {
            expect(req.log.info).to.have.been.calledOnce;
        });

        ('returns an unauthorized response', () => {
            expect(errors.unauthorized).to.have.been.calledWith(res);
        });
    });

    describe('with a generic error', () => {
        beforeEach(() => {
            req.headers.authorization = `Bearer ${validToken}`;
            sinon.stub(jwt, 'verifyToken').throws('Invalid JWT');
            bearer.middleware(req, res, next);
        });

        it('logs the error at the error level', () => {
            expect(req.log.error).to.have.been.calledTwice;
        });

        it('returns a badRequest response', () => {
            expect(errors.badRequest).to.have.been.calledWith('Invalid JWT', res);
        });
    });
});
