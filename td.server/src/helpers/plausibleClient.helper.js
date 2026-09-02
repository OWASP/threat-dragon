import http from 'http';
import https from 'https';

const requestAsync = (client, options, body) => new Promise((resolve, reject) => {
    const request = client.request(options, (response) => {
        response.resume();
        response.on('end', () => {
            if (response.statusCode >= 200 && response.statusCode < 300) {
                resolve(response.statusCode);
            } else {
                reject(new Error('Plausible event request failed'));
            }
        });
    });

    request.setTimeout(2000, () => request.destroy(new Error('Plausible request timed out')));
    request.on('error', reject);
    request.end(body);
});

export const createPlausibleClient = (httpDep, httpsDep) => (config, payload, requestMetadata) => {
    const url = new URL(config.PLAUSIBLE_EVENT_URL);
    const body = JSON.stringify(payload);
    const client = url.protocol === 'https:' ? httpsDep : httpDep;
    const options = {
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port || undefined,
        path: `${url.pathname}${url.search}`,
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'content-length': Buffer.byteLength(body),
            'user-agent': requestMetadata.userAgent || 'Threat-Dragon',
            'x-forwarded-for': requestMetadata.ip || '',
            'x-plausible-ip': requestMetadata.ip || ''
        }
    };

    if (url.protocol === 'https:') {
        options.rejectUnauthorized = !config.PLAUSIBLE_ALLOW_INSECURE;
    }

    return requestAsync(client, options, body);
};

export const sendEvent = createPlausibleClient(http, https);
