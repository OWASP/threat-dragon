// healthcheck is called periodically from within the docker container

import loggerHelper from './helpers/logger.helper.js';

const logger = loggerHelper.get('healthcheck.js');
const http = require('http');

const req = 'http://localhost:' + (process.env.PORT || '3000') + '/healthz';

http.get(req, (res) => {
    const { statusCode } = res;
    logger.debug('Health check request: ' + req);

    if (statusCode !== 200) {
        logger.error(`Healthcheck failure: invalid status code: ${statusCode}`);
        process.exit(1);
    }

    process.exit(0);
}).on('error', (e) => {
    logger.error(`Healthcheck failure: ${e.message}`);
    process.exit(1);
});
