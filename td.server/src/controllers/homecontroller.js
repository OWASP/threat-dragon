// index page

import loggerHelper from '../helpers/logger.helper.js';

const logger = loggerHelper.get('controllers/homecontroller.js');

const index = (req, res) => {
    logger.debug('index request');
    res.send('Threat Dragon back-end server');
};


export default {
    index
};
