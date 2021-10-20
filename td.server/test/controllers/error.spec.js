import { expect } from 'chai';
import sinon from 'sinon';

import error from '../../src/controllers/errors.js';
import { getMockResponse } from '../mocks/express.mocks.js';

describe('controllers/error.js', () => {
    const errorMsg = 'Whoopsies';
    let logger, mockResponse;

    beforeEach(() => {
        mockResponse = getMockResponse();
        logger = { debug: () => {} };
    });

    describe('internal server error', () => {
        let res;

        beforeEach(() => {
            res = error.serverError(errorMsg, mockResponse, logger);
        });

        it('defines a serverError function', () => {
            expect(error.serverError).to.be.a('function');
        });

        it('responds with a status code of 500', () => {
            expect(mockResponse.status).to.have.been.calledWith(500);
        });

        it('sets the json body', () => {
            const expected = {
                status: 500,
                message: 'Internal Server Error',
                details: errorMsg
            };
            expect(mockResponse.json).to.have.been.calledWith(expected);
        });

        it('returns the res object', () => {
            expect(res).to.deep.equal(mockResponse);
        });
    });

    describe('not found', () => {
        let res;

        beforeEach(() => {
            res = error.notFound(errorMsg, mockResponse, logger);
        });

        it('defines a notFound function', () => {
            expect(error.notFound).to.be.a('function');
        });

        it('responds with a status code of 404', () => {
            expect(mockResponse.status).to.have.been.calledWith(404);
        });

        it('sets the json body', () => {
            const expected = {
                status: 404,
                message: 'Not Found',
                details: errorMsg
            };
            expect(mockResponse.json).to.have.been.calledWith(expected);
        });

        it('returns the res object', () => {
            expect(res).to.deep.equal(mockResponse);
        });
    });

    describe('bad request', () => {
        let res;

        beforeEach(() => {
            res = error.badRequest(errorMsg, mockResponse, logger);
        });

        it('defines a badRequest function', () => {
            expect(error.badRequest).to.be.a('function');
        });

        it('responds with a status code of 400', () => {
            expect(mockResponse.status).to.have.been.calledWith(400);
        });

        it('sets the json body', () => {
            const expected = {
                status: 400,
                message: 'Bad Request',
                details: errorMsg
            };
            expect(mockResponse.json).to.have.been.calledWith(expected);
        });

        it('returns the res object', () => {
            expect(res).to.deep.equal(mockResponse);
        });
    });

    describe('Forbidden', () => {
        let res;

        beforeEach(() => {
            res = error.forbidden(mockResponse, logger);
        });

        it('defines a forbidden function', () => {
            expect(error.forbidden).to.be.a('function');
        });

        it('responds with a status code of 403', () => {
            expect(mockResponse.status).to.have.been.calledWith(403);
        });

        it('sets the json body', () => {
            const expected = {
                status: 403,
                message: 'Forbidden',
                details: 'Forbidden'
            };
            expect(mockResponse.json).to.have.been.calledWith(expected);
        });

        it('returns the res object', () => {
            expect(res).to.deep.equal(mockResponse);
        });
    });

    describe('Unauthorized', () => {
        let res;

        beforeEach(() => {
            res = error.unauthorized(mockResponse, logger);
        });

        it('defines an unauthorized function', () => {
            expect(error.unauthorized).to.be.a('function');
        });

        it('responds with a status code of 401', () => {
            expect(mockResponse.status).to.have.been.calledWith(401);
        });

        it('sets the json body', () => {
            const expected = {
                status: 401,
                message: 'Unauthorized',
                details: 'You must login to continue'
            };
            expect(mockResponse.json).to.have.been.calledWith(expected);
        });

        it('returns the res object', () => {
            expect(res).to.deep.equal(mockResponse);
        });
    });


});
