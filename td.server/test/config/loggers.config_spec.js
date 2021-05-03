import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';

import loggers from '../../src/config/loggers.config.js';

describe('loggers config tests', () => {
    let app;
    
    beforeEach(() => {
        app = require('express')();
    });
    
    it('should set the logger on requests', (done) => {
        loggers.configLoggers(app);
        app.get('/test', (req, res) => {
            expect(req.log).not.to.be.undefined;
            res.status(200).send('result');
        });
        
        request(app)
            .get('/test')
            .expect(200)
            .end(done);
    });
    
    it('should log to stdout', function() {
        const testMessage = 'test log';
        const logger = loggers.logger;
        sinon.spy(process.stdout, 'write');
        logger.info(testMessage);
        const message = JSON.parse(process.stdout.write.getCall(0).args[0]);
        expect(message.name).to.eq('threatdragon');
        expect(message.msg).to.eq(testMessage);
    });
});