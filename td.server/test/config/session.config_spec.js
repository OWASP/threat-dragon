import { expect } from 'chai';
import sinon from 'sinon';

import azureTableSession from '../../src/config/azuretablesession.config.js';
import env from '../../src/env/Env.js';
import loggers from '../../src/config/loggers.config.js';
import { getMockApp } from '../express.mocks.js';
import sessionConfig from '../../src/config/session.config.js';

describe('session config tests', () => {
    const sessionSigningKey = 'somekey';
    let mockApp;

    beforeEach(() => {
        mockApp = getMockApp();
        sinon.spy(loggers.logger, 'error');
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('dev environment', () => {
        const mockEnv = {
            config: {
                SESSION_SIGNING_KEY: sessionSigningKey,
                SESSION_STORE: 'local',
                NODE_ENV: 'development'
            }
        };
        beforeEach(() => {
            sinon.stub(env, 'get').returns(mockEnv);
            sessionConfig.config(mockApp);
        });

        it('logs an error about insecure cookies', () => {
            expect(loggers.logger.error).to.have.been.calledWith(
                { security: true },
                sinon.match('cookie')
            );
        });

        it('logs an error about local session storage', () => {
            expect(loggers.logger.error).to.have.been.calledWith(
                { security: true },
                sinon.match('local session store used')
            );
        });

        it('tells the app to use the express session', () => {
            expect(mockApp.use).to.have.been.calledOnce;
        });
    });

    describe('prod environment', () => {
        const mockEnv = {
            config: {
                SESSION_SIGNING_KEY: sessionSigningKey,
                SESSION_STORE: 'azure',
                NODE_ENV: 'simulated_production'
            }
        };
        beforeEach(() => {
            sinon.stub(env, 'get').returns(mockEnv);
            sinon.stub(loggers.logger, 'info');
            sinon.stub(azureTableSession, 'config');
            sessionConfig.config(mockApp);
        });

        afterEach(() => {
            process.env.NODE_ENV = 'development';
        });

        it('sets the secure cookie option', () => {
            expect(loggers.logger.error).not.to.have.been.called;
        });

        it('sets the session store to azure table storage', () => {
            expect(azureTableSession.config).to.have.been.calledOnce;
        });
    });
});

