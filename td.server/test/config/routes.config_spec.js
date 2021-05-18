import express from 'express';
import { expect } from 'chai';
import sinon from 'sinon';

import auth from '../../src/controllers/auth.js';
import bearer from '../../src/config/bearer.config.js';
import healthcheck from '../../src/controllers/healthcheck.js';
import homeController from '../../src/controllers/homecontroller.js';
import { getMockApp } from '../express.mocks.js';
import routeConfig from '../../src/config/routes.config.js';
import threatmodelController from '../../src/controllers/threatmodelcontroller.js';

describe('route config tests', () => {
    let mockApp;
    const mockRouter = {
        get: () => {},
        post: () => {},
        put: () => {},
        delete: () => {},
        use: () => {}
    };

    beforeEach(() => {
        mockApp = getMockApp();
        sinon.stub(express, 'Router').returns(mockRouter);
        sinon.stub(mockRouter, 'get');
        sinon.spy(mockRouter, 'post');
        sinon.spy(mockRouter, 'put');
        sinon.spy(mockRouter, 'delete');
        sinon.spy(mockRouter, 'use');
        routeConfig.config(mockApp);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('tells the app to use the router', () => {
        expect(mockApp.use).to.have.been.calledWith('/', mockRouter);
    });

    describe('Main application entry point and health check', () => {
        it('routes GET /', () => {
            expect(mockRouter.get).to.have.been.calledWith(
                '/',
                homeController.index
            );
        });

        it('routes GET /healthz', () => {
            expect(mockRouter.get).to.have.been.calledWith('/healthz', healthcheck.healthz);
        });
    });

    describe('login/logout', () => {
        it('routes GET /api/login/:provider', () => {
            expect(mockRouter.get).to.have.been.calledWith(
                '/api/login/:provider',
                auth.login
            );
        });

        it('routes POST /api/logout', () => {
            expect(mockRouter.post).to.have.been.calledWith(
                '/api/logout',
                auth.logout
            );
        });
    });

    describe('github sign in', () => {
        it('routes GET /api/oauth/provider', () => {
            expect(mockRouter.get).to.have.been.calledWith(
                '/api/oauth/:provider',
                auth.completeLogin
            );
        });

        it('routes GET /api/oauth/return', () => {
            expect(mockRouter.get).to.have.been.calledWith(
                '/api/oauth/return',
                auth.oauthReturn
            );
        });
    });

    describe('threat models', () => {
        it('routes GET /api/threatmodel/repos', () => {
            expect(mockRouter.get).to.have.been.calledWith(
                '/api/threatmodel/repos',
                threatmodelController.repos
            );
        });
        
        it('routes GET /api/threatmodel/:organisation/:repo/branches', () => {
            expect(mockRouter.get).to.have.been.calledWith(
                '/api/threatmodel/:organisation/:repo/branches',
                threatmodelController.branches
            );
        });
        
        it('routes GET /api/threatmodel/:organisation/:repo/:branch/models', () => {
            expect(mockRouter.get).to.have.been.calledWith(
                '/api/threatmodel/:organisation/:repo/:branch/models',
                threatmodelController.models
            );
        });
        
        it('routes GET /api/threatmodel/:organisation/:repo/:branch/:model/data', () => {
            expect(mockRouter.get).to.have.been.calledWith(
                '/api/threatmodel/:organisation/:repo/:branch/:model/data',
                threatmodelController.model
            );
        });
        
        it('routes DELETE /threatmodel/:organisation/:repo/:branch/:model', () => {
            expect(mockRouter.delete).to.have.been.calledWith(
                '/threatmodel/:organisation/:repo/:branch/:model',
                threatmodelController.deleteModel
            );
        });
        
        it('routes PUT /threatmodel/:organisation/:repo/:branch/:model/create', () => {
            expect(mockRouter.put).to.have.been.calledWith(
                '/threatmodel/:organisation/:repo/:branch/:model/create',
                threatmodelController.create
            );
        });
        
        it('routes PUT /threatmodel/:organisation/:repo/:branch/:model/update', () => {
            expect(mockRouter.put).to.have.been.calledWith(
                '/threatmodel/:organisation/:repo/:branch/:model/update',
                threatmodelController.update
            );
        });
    });

    it('adds bearer token middleware', () => {
        expect(mockRouter.use).to.have.been.calledWith(bearer.middleware);
    });
});
