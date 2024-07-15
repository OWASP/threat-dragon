import { expect } from 'chai';
import sinon from 'sinon';

import { getMockResponse } from '../mocks/express.mocks.js';
import healthcheck from '../../src/controllers/healthz.js';

describe('controllers/healthz.js', () => {
    let mockResponse;

    beforeEach(() => {
        mockResponse = getMockResponse();
        healthcheck.healthz({}, mockResponse);
    });

    it('sends a true response', () => {
        expect(mockResponse.status).to.have.been.calledWith(200);
    });
});
