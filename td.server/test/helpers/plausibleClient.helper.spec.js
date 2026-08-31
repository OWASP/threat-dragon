import { EventEmitter } from 'events';
import { expect } from 'chai';
import sinon from 'sinon';

import { createPlausibleClient } from '../../src/helpers/plausibleClient.helper.js';

const getClient = ({ statusCode = 202, timeout = false } = {}) => {
    const response = new EventEmitter();
    response.statusCode = statusCode;
    response.resume = sinon.stub();
    const request = new EventEmitter();
    let timeoutCallback;
    request.setTimeout = sinon.stub().callsFake((_duration, callback) => { timeoutCallback = callback; });
    request.destroy = sinon.stub().callsFake(error => request.emit('error', error));
    request.end = sinon.stub().callsFake(() => {
        if (timeout) {
            setImmediate(timeoutCallback);
            return;
        }
        response.emit('end');
    });
    return {
        request: sinon.stub().callsFake((_options, callback) => {
            callback(response);
            return request;
        }),
        requestObject: request
    };
};

describe('helpers/plausibleClient.helper.js', () => {
    const payload = { domain: 'threatdragon.test', name: 'EVENT', url: 'https://threatdragon.test/analytics' };

    it('uses verified TLS for HTTPS by default', async () => {
        const client = getClient();
        const sendEvent = createPlausibleClient(client, client);
        await sendEvent({ PLAUSIBLE_EVENT_URL: 'https://plausible.test/api/event', PLAUSIBLE_ALLOW_INSECURE: false }, payload,
            { ip: '192.0.2.1', userAgent: 'agent' });
        expect(client.request.firstCall.args[0].rejectUnauthorized).to.equal(true);
    });

    it('forwards the visitor IP in the Plausible IP header', async () => {
        const client = getClient();
        const sendEvent = createPlausibleClient(client, client);
        await sendEvent({ PLAUSIBLE_EVENT_URL: 'https://plausible.test/api/event', PLAUSIBLE_ALLOW_INSECURE: false }, payload,
            { ip: '192.0.2.1', userAgent: 'agent' });
        expect(client.request.firstCall.args[0].headers['x-plausible-ip']).to.equal('192.0.2.1');
    });

    it('also forwards the visitor IP in the standard proxy header', async () => {
        const client = getClient();
        const sendEvent = createPlausibleClient(client, client);
        await sendEvent({ PLAUSIBLE_EVENT_URL: 'https://plausible.test/api/event', PLAUSIBLE_ALLOW_INSECURE: false }, payload,
            { ip: '192.0.2.1', userAgent: 'agent' });
        expect(client.request.firstCall.args[0].headers['x-forwarded-for']).to.equal('192.0.2.1');
    });

    it('forwards the browser user agent', async () => {
        const client = getClient();
        const sendEvent = createPlausibleClient(client, client);
        await sendEvent({ PLAUSIBLE_EVENT_URL: 'https://plausible.test/api/event', PLAUSIBLE_ALLOW_INSECURE: false }, payload,
            { ip: '192.0.2.1', userAgent: 'test-agent' });
        expect(client.request.firstCall.args[0].headers['user-agent']).to.equal('test-agent');
    });

    it('permits invalid TLS certificates only for explicitly insecure configuration', async () => {
        const client = getClient();
        const sendEvent = createPlausibleClient(client, client);
        await sendEvent({ PLAUSIBLE_EVENT_URL: 'https://plausible.test/api/event', PLAUSIBLE_ALLOW_INSECURE: true }, payload,
            {});
        expect(client.request.firstCall.args[0].rejectUnauthorized).to.equal(false);
    });

    it('uses the configured HTTP client for insecure HTTP testing', async () => {
        const client = getClient();
        const sendEvent = createPlausibleClient(client, client);
        await sendEvent({ PLAUSIBLE_EVENT_URL: 'http://plausible.test/api/event', PLAUSIBLE_ALLOW_INSECURE: true }, payload,
            {});
        expect(client.request.firstCall.args[0].protocol).to.equal('http:');
    });

    it('rejects unsuccessful Plausible responses', async () => {
        const client = getClient({ statusCode: 500 });
        const sendEvent = createPlausibleClient(client, client);
        const request = sendEvent({ PLAUSIBLE_EVENT_URL: 'https://plausible.test/api/event', PLAUSIBLE_ALLOW_INSECURE: false }, payload,
            {});
        await expect(request).to.be.rejectedWith('Plausible event request failed');
    });

    it('rejects timed out Plausible requests', async () => {
        const client = getClient({ timeout: true });
        const sendEvent = createPlausibleClient(client, client);
        const request = sendEvent({ PLAUSIBLE_EVENT_URL: 'https://plausible.test/api/event', PLAUSIBLE_ALLOW_INSECURE: false }, payload,
            {});
        await expect(request).to.be.rejectedWith('Plausible request timed out');
    });

    it('keeps an explicitly configured endpoint port', async () => {
        const client = getClient();
        const sendEvent = createPlausibleClient(client, client);
        await sendEvent({ PLAUSIBLE_EVENT_URL: 'https://plausible.test:8443/api/event', PLAUSIBLE_ALLOW_INSECURE: false }, payload,
            {});
        expect(client.request.firstCall.args[0].port).to.equal('8443');
    });
});
