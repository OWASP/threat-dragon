import { expect } from 'chai';
import sinon from 'sinon';

import errors from '../../src/controllers/errors.js';
import { getMockRequest, getMockResponse } from '../mocks/express.mocks.js';
import responseWrapper from '../../src/controllers/responseWrapper.js';

describe('controllers/responseWrapper.js', () => {
    const err = new Error('whoops!');
    const data = 'foobar';
    let logger, req, res;

    beforeEach(() => {
        req = getMockRequest();
        res = getMockResponse();
        logger = {
            error: () => {}
        }
        sinon.stub(errors, 'serverError');
    });

    describe('sendResponse', () => {
        const functions = {
            noError: () => data,
            withError: () => { throw err; }
        };

        describe('without error', () => {
            beforeEach(() => {
                sinon.spy(functions, 'noError');
                responseWrapper.sendResponse(functions.noError, req, res, logger);
            });

            it('executes the function', () => {
                expect(functions.noError).to.have.been.calledOnce;
            });

            it('sets the status to 200', () => {
                expect(res.status).to.have.been.calledWith(200);
            });

            it('sends the data as JSON', () => {
                expect(res.json).to.have.been.calledWith({
                    status: 200,
                    data
                });
            });
        });

        describe('with error', () => {
            beforeEach(() => {
                sinon.spy(functions, 'withError');
                responseWrapper.sendResponse(functions.withError, req, res, logger);
            });

            it('calls the function', () => {
                expect(functions.withError).to.have.been.calledOnce;
            });

            it('returns a server error', () => {
                expect(errors.serverError).to.have.been.calledWith(
                    'Internal Server Error',
                    res
                );
            });
        });
    });

    describe('sendResponseAsync', () => {
        const functions = {
            noError: () => Promise.resolve(data),
            withError: () => Promise.reject('whoops!')
        };

        describe('without error', () => {
            beforeEach(async () => {
                sinon.spy(functions, 'noError');
                await responseWrapper.sendResponseAsync(functions.noError, req, res, logger);
            });

            it('resolves the promise', () => {
                expect(functions.noError).to.have.been.calledOnce;
            });

            it('sets the status to 200', () => {
                expect(res.status).to.have.been.calledWith(200);
            });

            it('sends the data as JSON', () => {
                expect(res.json).to.have.been.calledWith({
                    status: 200,
                    data
                });
            });
        });

        describe('with error', () => {
            beforeEach(async () => {
                sinon.stub(functions, 'withError').rejects(err);
                await responseWrapper.sendResponseAsync(functions.withError, req, res, logger);
            });

            it('attempts to resolve the promise', () => {
                expect(functions.withError).to.have.been.calledOnce;
            });

            it('returns a server error', () => {
                expect(errors.serverError).to.have.been.calledWith(
                    'Internal Server Error',
                    res
                );
            });
        });
    });
});
