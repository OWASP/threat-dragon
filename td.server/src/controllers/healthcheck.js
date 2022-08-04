import loggerHelper from '../helpers/logger.helper.js';

const logger = loggerHelper.get('controllers/healthcheck.js');

const healthz = (req, res) => {
    logger.debug('API healthz request:', req);
    return res.send(true);
};

export default {
    healthz
};
