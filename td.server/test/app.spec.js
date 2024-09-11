import { expect } from 'chai';
import express from 'express';
import sinon from 'sinon';
import rateLimiter from 'express-rate-limit';

import appFactory from '../src/app.js';
import envConfig from '../src/config/env.config.js';
import expressHelper from '../src/helpers/express.helper.js';
import https from '../src/config/https.config.js';
import { getMockApp } from './mocks/express.mocks.js';
import loggerHelper from '../src/helpers/logger.helper.js';
import parsersConfig from '../src/config/parsers.config.js';
import routesConfig from '../src/config/routes.config.js';
import securityHeaders from '../src/config/securityheaders.config.js';

describe('app.js main application', () => {
    let mockApp;
    const mockLogger = {
        info: () => {},
        error: () => {}
    };

    beforeEach(() => {
        mockApp = getMockApp();
        sinon.stub(expressHelper, 'getInstance').returns(mockApp);
        sinon.stub(express, 'static');

        sinon.stub(securityHeaders, 'config');
        sinon.stub(parsersConfig, 'config');
        sinon.stub(routesConfig, 'config');
        sinon.stub(https, 'middleware');
        sinon.stub(loggerHelper, 'level');
        sinon.stub(rateLimiter, 'rateLimit');
    });

    describe('without errors', () => {
        beforeEach(() => {
            process.env.NODE_ENV = 'production';
            sinon.stub(envConfig, 'tryLoadDotEnv');
            appFactory.create();
        });

        it('sets the log level', () => {
            expect(loggerHelper.level).to.have.been.calledWith('warn');
        });

        it('trusts proxies', () => {
            expect(mockApp.set).to.have.been.calledWith('trust proxy', true);
        });

        it('adds the https middleware', () => {
            expect(mockApp.use).to.have.been.calledWith(https.middleware);
        });

        it('uses dotenv config', () => {
            expect(envConfig.tryLoadDotEnv).to.have.been.calledOnce;
        });
        
        it('uses /public for static content', () => {
            expect(mockApp.use).to.have.been.calledWith('/public', sinon.match.any);
            expect(express.static).to.have.been.calledWith(sinon.match('dist'));
        });

        it('uses the security headers config', () => {
            expect(securityHeaders.config).to.have.been.calledOnce;
        });

        it('uses the parsers config', () => {
            expect(parsersConfig.config).to.have.been.calledOnce;
        });

        it('uses the routes config', () => {
            expect(routesConfig.config).to.have.been.calledOnce;
        });

        it('sets the port', () => {
            expect(mockApp.set).to.have.been.calledWith('port', 3000);
        });
    });

    describe('with default environment', () => {
        beforeEach(() => {
            process.env.ENV_FILE = 'none';
            sinon.stub(envConfig, 'tryLoadDotEnv');
            appFactory.create();
        });

        it('sets the default log level', () => {
            expect(loggerHelper.level).to.have.been.calledWith('warn');
        });

        it('sets the default port', () => {
            expect(mockApp.set).to.have.been.calledWith('port', 3000);
        });
    });

    describe('with development environment', () => {
        beforeEach(() => {
            process.env.NODE_ENV = 'development';
            sinon.stub(envConfig, 'tryLoadDotEnv');
            appFactory.create();
        });

        it('disables the rate limiting', () => {
            expect(rateLimiter.rateLimit).not.to.have.been.called;
        });
    });

    describe('with error', () => {
        const err = new Error('whoops!');

        beforeEach(() => {
            sinon.stub(envConfig, 'tryLoadDotEnv').throws(err);
            process.env.NODE_ENV = 'production';
        });

        it('rethrows the error', () => {
            expect(() => {
                appFactory.create();
            }).to.throw('whoops!');
        });
    });
});



