import { expect } from 'chai';
import sinon from 'sinon';

import error from '../../src/controllers/errors.js';
import { logger } from '../../src/config/loggers.config.js';

describe('controllers/error.js', () => {
    const errorMsg = 'Whoopsies';
    const resStub = {
        status: () => {},
        json: () => {}
    };

    beforeEach(() => {
        sinon.stub(resStub, 'status').returns(resStub);
        sinon.stub(resStub, 'json').returns(resStub);
        sinon.stub(logger, 'debug');
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('internal server error', () => {
        let res;

        beforeEach(() => {
            res = error.serverError(errorMsg, resStub);
        });

        it('defines a serverError function', () => {
            expect(error.serverError).to.be.a('function');
        });

        it('responds with a status code of 500', () => {
            expect(resStub.status).to.have.been.calledWith(500);
        });

        it('sets the json body', () => {
            const expected = {
                status: 500,
                message: 'Internal Server Error',
                details: errorMsg
            };
            expect(resStub.json).to.have.been.calledWith(expected);
        });

        it('returns the res object', () => {
            expect(res).to.deep.equal(resStub);
        });

        it('logs the error to the debug log', () => {
            expect(logger.debug).to.have.been.calledOnce;
        });
    });

    describe('not found', () => {
        let res;

        beforeEach(() => {
            res = error.notFound(errorMsg, resStub);
        });

        it('defines a notFound function', () => {
            expect(error.notFound).to.be.a('function');
        });

        it('responds with a status code of 404', () => {
            expect(resStub.status).to.have.been.calledWith(404);
        });

        it('sets the json body', () => {
            const expected = {
                status: 404,
                message: 'Not Found',
                details: errorMsg
            };
            expect(resStub.json).to.have.been.calledWith(expected);
        });

        it('returns the res object', () => {
            expect(res).to.deep.equal(resStub);
        });

        it('logs the error to the debug log', () => {
            expect(logger.debug).to.have.been.calledOnce;
        });
    });

    describe('bad request', () => {
        let res;

        beforeEach(() => {
            res = error.badRequest(errorMsg, resStub);
        });

        it('defines a badRequest function', () => {
            expect(error.badRequest).to.be.a('function');
        });

        it('responds with a status code of 400', () => {
            expect(resStub.status).to.have.been.calledWith(400);
        });

        it('sets the json body', () => {
            const expected = {
                status: 400,
                message: 'Bad Request',
                details: errorMsg
            };
            expect(resStub.json).to.have.been.calledWith(expected);
        });

        it('returns the res object', () => {
            expect(res).to.deep.equal(resStub);
        });

        it('logs the error to the debug log', () => {
            expect(logger.debug).to.have.been.calledOnce;
        });
    });

    describe('Forbidden', () => {
        let res;

        beforeEach(() => {
            res = error.forbidden(resStub);
        });

        it('defines a forbidden function', () => {
            expect(error.forbidden).to.be.a('function');
        });

        it('responds with a status code of 403', () => {
            expect(resStub.status).to.have.been.calledWith(403);
        });

        it('sets the json body', () => {
            const expected = {
                status: 403,
                message: 'Forbidden',
                details: 'Forbidden'
            };
            expect(resStub.json).to.have.been.calledWith(expected);
        });

        it('returns the res object', () => {
            expect(res).to.deep.equal(resStub);
        });

        it('logs the error to the debug log', () => {
            expect(logger.debug).to.have.been.calledOnce;
        });
    });


});
