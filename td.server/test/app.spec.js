import { expect } from 'chai';
import express from 'express';
import sinon from 'sinon';

import appFactory from '../src/app.js';
import envConfig from '../src/config/env.config.js';
import expressHelper from '../src/helpers/express.helper.js';
import https from '../src/config/https.config.js';
import { getMockApp } from './mocks/express.mocks.js';
import parsersConfig from '../src/config/parsers.config.js';
import routesConfig from '../src/config/routes.config.js';
import securityHeaders from '../src/config/securityheaders.config.js';

describe('app tests', () => {
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
    });

    describe('without errors', () => {
        beforeEach(() => {
            sinon.stub(envConfig, 'tryLoadDotEnv');
            appFactory.create();
        });

        it('trusts proxies', () => {
            expect(mockApp.set).to.have.been.calledWith('trust proxy', true);
        });

        it('uses views', () => {
            expect(mockApp.set).to.have.been.calledWith('views', sinon.match('views'));
        });

        it('adds the https middleware', () => {
            expect(mockApp.use).to.have.been.calledWith(https.middleware);
        });

        it('uses the pug view engine', () => {
            expect(mockApp.set).to.have.been.calledWith('view engine', 'pug');
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
    });

    describe('with error', () => {
        const err = new Error('whoops!');

        beforeEach(() => {
            sinon.stub(envConfig, 'tryLoadDotEnv').throws(err);
            // appFactory.create();
        });

        it('rethrows the error', () => {
            expect(() => {
                appFactory.create();
            }).to.throw('whoops!');
        });
    });
});



