import { expect } from 'chai';
import express from 'express';
import sinon from 'sinon';

import appFactory from '../src/app.js';
import envConfig from '../src/config/env.config.js';
import expressHelper from '../src/helpers/express.helper.js';
import https from '../src/config/https.config.js';
import { getMockApp } from './mocks/express.mocks.js';
import loggerHelper from '../src/helpers/logger.helper.js';
import parsersConfig from '../src/config/parsers.config.js';
import routesConfig from '../src/config/routes.config.js';
import securityHeaders from '../src/config/securityheaders.config.js';

describe.skip('app.js main application', () => {
    let mockApp;
    let sandbox;

    beforeEach(() => {
        // Create a fresh sandbox for each test
        sandbox = sinon.createSandbox();

        // Setup mocks
        mockApp = getMockApp();
        sandbox.stub(expressHelper, 'getInstance').returns(mockApp);
        sandbox.stub(express, 'static');
        sandbox.stub(securityHeaders, 'config');
        sandbox.stub(parsersConfig, 'config');
        sandbox.stub(routesConfig, 'config');
        sandbox.stub(https, 'middleware');
        sandbox.stub(loggerHelper, 'level');
    });

    afterEach(() => {
        // Restore all stubs
        sandbox.restore();
    });

    describe('without errors', () => {
        beforeEach(() => {
            process.env.NODE_ENV = 'production';
            sandbox.stub(envConfig, 'tryLoadDotEnv');
            appFactory.create();
        });

        it('sets a log level', () => {
            expect(loggerHelper.level.called).to.be.true;
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

        it('sets a port', () => {
            expect(mockApp.set).to.have.been.calledWith('port', sinon.match.any);
        });
    });

    describe('with default environment', () => {
        beforeEach(() => {
            process.env.ENV_FILE = 'none';
            sandbox.stub(envConfig, 'tryLoadDotEnv');
            appFactory.create();
        });

        it('sets a log level', () => {
            expect(loggerHelper.level.called).to.be.true;
        });

        it('sets a port', () => {
            expect(mockApp.set).to.have.been.calledWith('port', sinon.match.any);
        });
    });

    describe('with development environment', () => {
        beforeEach(() => {
            process.env.NODE_ENV = 'development';
            sandbox.stub(envConfig, 'tryLoadDotEnv');
            appFactory.create();
        });

        it('uses development environment', () => {
            expect(process.env.NODE_ENV).to.equal('development');
        });
    });

    describe('with error', () => {
        const err = new Error('whoops!');

        beforeEach(() => {
            sandbox.stub(envConfig, 'tryLoadDotEnv').throws(err);
            process.env.NODE_ENV = 'production';
        });

        it('rethrows the error', () => {
            expect(() => {
                appFactory.create();
            }).to.throw('whoops!');
        });
    });
});
