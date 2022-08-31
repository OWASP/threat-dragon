import { expect } from 'chai';
import sinon from 'sinon';

import env from '../../src/env/Env.js';
import homeController from '../../src/controllers/homecontroller.js';
import { getMockRequest, getMockResponse } from '../mocks/express.mocks.js';

describe('controllers/homecontroller.js', () => {
    let mockRequest, mockResponse;

    beforeEach(() => {
        mockRequest = getMockRequest();
        mockResponse = getMockResponse();
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
});
