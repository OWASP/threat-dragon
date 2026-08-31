import { expect } from 'chai';
import sinon from 'sinon';

import { getMockRequest, getMockResponse } from '../mocks/express.mocks.js';
import { analyticsEvents } from '../../src/constants/analyticsEvents.js';
import { createAnalyticsController } from '../../src/controllers/analyticscontroller.js';

describe('controllers/analyticscontroller.js', () => {
    const configured = {
        PLAUSIBLE_ENABLED: true,
        PLAUSIBLE_DOMAIN: 'threatdragon.test'
    };

    it('does not forward when analytics is disabled', async () => {
        const sendEventDep = sinon.stub();
        const controller = createAnalyticsController({
            envDep: { get: () => ({ config: { PLAUSIBLE_ENABLED: false } }) },
            sendEventDep
        });
        const response = getMockResponse();
        await controller.track(getMockRequest(), response);
        expect(sendEventDep).not.to.have.been.called;
    });

    it('returns no content when analytics is disabled', async () => {
        const controller = createAnalyticsController({
            envDep: { get: () => ({ config: { PLAUSIBLE_ENABLED: false } }) }
        });
        const response = getMockResponse();
        await controller.track(getMockRequest(), response);
        expect(response.status).to.have.been.calledWith(204);
    });

    it('rejects arbitrary browser event names', async () => {
        const controller = createAnalyticsController({ envDep: { get: () => ({ config: configured }) } });
        const request = getMockRequest();
        request.body = { event: 'THREAT_MODEL_NAME' };
        const response = getMockResponse();
        await controller.track(request, response);
        expect(response.status).to.have.been.calledWith(400);
    });

    it('rejects arbitrary browser properties', async () => {
        const controller = createAnalyticsController({ envDep: { get: () => ({ config: configured }) } });
        const request = getMockRequest();
        request.body = {
            event: analyticsEvents.PROVIDER_SELECTED,
            props: { provider: 'model name' }
        };
        const response = getMockResponse();
        await controller.track(request, response);
        expect(response.status).to.have.been.calledWith(400);
    });

    it('rejects a configured request with no body', async () => {
        const controller = createAnalyticsController({ envDep: { get: () => ({ config: configured }) } });
        const response = getMockResponse();
        const request = getMockRequest();
        request.body = null;
        await controller.track(request, response);
        expect(response.status).to.have.been.calledWith(400);
    });

    it('forwards an allowlisted event with request metadata', async () => {
        const sendEventDep = sinon.stub().resolves();
        const controller = createAnalyticsController({ envDep: { get: () => ({ config: configured }) }, sendEventDep });
        const request = getMockRequest();
        request.ip = '192.0.2.1';
        request.get.withArgs('user-agent').returns('test-agent');
        request.body = { event: analyticsEvents.DIAGRAM_CREATED };
        const response = getMockResponse();
        await controller.track(request, response);
        expect(sendEventDep).to.have.been.calledWith(
            configured,
            sinon.match({ name: analyticsEvents.DIAGRAM_CREATED }),
            { ip: '192.0.2.1', userAgent: 'test-agent' }
        );
    });

    it('returns no content after forwarding an event', async () => {
        const controller = createAnalyticsController({
            envDep: { get: () => ({ config: configured }) },
            sendEventDep: sinon.stub().resolves()
        });
        const request = getMockRequest();
        request.body = { event: analyticsEvents.DIAGRAM_CREATED };
        const response = getMockResponse();
        await controller.track(request, response);
        expect(response.status).to.have.been.calledWith(204);
    });

    it('returns success when upstream forwarding fails', async () => {
        const loggerDep = { warn: sinon.stub() };
        const controller = createAnalyticsController({
            envDep: { get: () => ({ config: configured }) },
            sendEventDep: sinon.stub().rejects(new Error('unavailable')),
            loggerDep
        });
        const request = getMockRequest();
        request.body = { event: analyticsEvents.DIAGRAM_CREATED };
        const response = getMockResponse();
        await controller.track(request, response);
        expect(loggerDep.warn).to.have.been.calledWith('Plausible event forwarding failed.');
    });
});
