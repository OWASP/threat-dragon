import { expect } from 'chai';

import { getMockApp } from '../express.mocks.js';
import loggers from '../../src/config/loggers.config.js';

describe('loggers config tests', () => {
    let mockApp;
    
    beforeEach(() => {
        mockApp = getMockApp();
    });

    it('should set the logger using expressBunyan', () => {
        loggers.configLoggers(mockApp);
        expect(mockApp.use).to.have.been.calledOnce;
    });

    it('should create a logger', () => {
        expect(loggers.logger.info).to.be.a('function');
    });
});