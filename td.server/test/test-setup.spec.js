import bunyan from 'bunyan';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';

import { logger } from '../src/config/loggers.config.js';

/**
 * Prevent logging during testing
 */
const suppressLogging = () => {
    logger.level(bunyan.FATAL + 1);
};

before(() => {
    chai.use(sinonChai);
    chai.use(chaiAsPromised);

    suppressLogging();
});

