import { expect } from 'chai';
import { createLogger, transports } from 'winston';
import { Writable } from 'stream';

import loggerHelper from '../../src/helpers//logger.helper.js';

describe('helpers/logger.helper.js', () => {
    let logger, winstonLogger;
    let output = '';

    before(() => {
        const levels = {
            audit: 0,
            error: 1,
            warn: 2,
            info: 3,
            debug: 4,
            silly: 5
        };
        const stream = new Writable();
        stream._write = (chunk, encoding, next) => {
            output = output += chunk.toString();
            next();
        };
        const streamTransport = new transports.Stream({
            stream,
            silent: false
        });
        winstonLogger = createLogger({
            transports: streamTransport,
            level: 'silly',
            levels
        });
        logger = new loggerHelper.Logger('logger.helper.spec.js', winstonLogger);
    });

    beforeEach(() => {
        output = '';
    });

    it('logs a message at a defined level', () => {
        logger.log('warn', 'whatever');
        expect(output.trim().includes('whatever')).to.be.true;
        expect(output.trim().includes('warn')).to.be.true;
    });

    it('logs an audit message', () => {
        logger.audit('some message');
        expect(output.trim().includes('some message')).to.be.true;
    });

    it('logs an error message', () => {
        logger.error('some message');
        expect(output.trim().includes('some message')).to.be.true;
        expect(output.trim().includes('error')).to.be.true;
    });

    it('logs a warn message', () => {
        logger.warn('some message');
        expect(output.trim().includes('some message')).to.be.true;
        expect(output.trim().includes('warn')).to.be.true;
    });

    it('logs an info message', () => {
        logger.info('some message');
        expect(output.trim().includes('some message')).to.be.true;
        expect(output.trim().includes('info')).to.be.true;
    });

    it('logs a debug message', () => {
        logger.debug('some message');
        expect(output.trim().includes('some message')).to.be.true;
        expect(output.trim().includes('debug')).to.be.true;
    });

    it('logs a silly message', () => {
        logger.silly('some message');
        expect(output.trim().includes('some message')).to.be.true;
        expect(output.trim().includes('silly')).to.be.true;
    });

    it('throws an error for an unknown level', () => {
        expect(() => logger.fatal('fatal')).to.throw;
    });

    it('stringifies complex objects', () => {
        const complexObject = {a: 'a', b: { ba: 'ba', bb: 'bb'}};
        let objectString = logger.transformToString(complexObject);
        expect(objectString).to.equal('{"a":"a","b":{"ba":"ba","bb":"bb"}}');
        complexObject.b.bb = complexObject.b
        objectString = logger.transformToString(complexObject);
        expect(objectString).to.equal('{"a":"a","b":{"ba":"ba","bb":"[Circular]"}}');
    })
});