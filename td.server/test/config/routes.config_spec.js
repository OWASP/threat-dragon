import express from 'express';
import { expect } from 'chai';
import sinon from 'sinon';

import githubController from '../../src/controllers/githublogincontroller.js';
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
        delete: () => {}
    };

    beforeEach(() => {
        mockApp = getMockApp();
        sinon.stub(express, 'Router').returns(mockRouter);
        sinon.spy(mockRouter, 'get');
        sinon.spy(mockRouter, 'post');
        sinon.spy(mockRouter, 'put');
        sinon.spy(mockRouter, 'delete');
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
                sinon.match.any, // csrf protection,
                homeController.ensureLoggedIn,
                homeController.index
            );
        });

        it('routes GET /healthz', () => {
            expect(mockRouter.get).to.have.been.calledWith('/', sinon.match.func);
        });
    });

    describe('login and logout', () => {
        it('routes GET /login', () => {
            expect(mockRouter.get).to.have.been.calledWith(
                '/login',
                sinon.match.any, // csrf protection
                homeController.login
            );
        });

        it('routes GET /logoutform', () => {
            expect(mockRouter.get).to.have.been.calledWith(
                '/logoutform',
                sinon.match.any, // csrf protection
                homeController.logoutform
            );
        });

        it('routes POST /logout', () => {
            expect(mockRouter.post).to.have.been.calledWith(
                '/logout',
                sinon.match.any, // csrf protection
                homeController.logout
            );
        });
    });

    describe('github sign in', () => {
        it('routes POST /login', () => {
            expect(mockRouter.post).to.have.been.calledWith(
                '/login',
                sinon.match.any, // csrf protection
                githubController.doLogin
            );
        });

        it('routes GET /login/github', () => {
            expect(mockRouter.get).to.have.been.calledWith(
                '/login/github',
                githubController.doLogin
            );
        });

        it('routes GET /oauth/github', () => {
            expect(mockRouter.get).to.have.been.calledWith(
                '/oauth/github',
                githubController.doLogin,
                githubController.completeLogin
            );
        });
    });

    describe('threat models', () => {
        it('routes GET /threatmodel/repos', () => {
            expect(mockRouter.get).to.have.been.calledWith(
                '/threatmodel/repos',
                homeController.ensureLoggedIn,
                threatmodelController.repos
            );
        });
        
        it('routes GET /threatmodel/:organisation/:repo/branches', () => {
            expect(mockRouter.get).to.have.been.calledWith(
                '/threatmodel/:organisation/:repo/branches',
                homeController.ensureLoggedIn,
                threatmodelController.branches
            );
        });
        
        it('routes GET /threatmodel/:organisation/:repo/:branch/models', () => {
            expect(mockRouter.get).to.have.been.calledWith(
                '/threatmodel/:organisation/:repo/:branch/models',
                homeController.ensureLoggedIn,
                threatmodelController.models
            );
        });
        
        it('routes GET /threatmodel/:organisation/:repo/:branch/:model/data', () => {
            expect(mockRouter.get).to.have.been.calledWith(
                '/threatmodel/:organisation/:repo/:branch/:model/data',
                homeController.ensureLoggedIn,
                threatmodelController.model
            );
        });
        
        it('routes DELETE /threatmodel/:organisation/:repo/:branch/:model', () => {
            expect(mockRouter.delete).to.have.been.calledWith(
                '/threatmodel/:organisation/:repo/:branch/:model',
                sinon.match.any, // csrf protection
                homeController.ensureLoggedIn,
                threatmodelController.deleteModel
            );
        });
        
        it('routes PUT /threatmodel/:organisation/:repo/:branch/:model/create', () => {
            expect(mockRouter.put).to.have.been.calledWith(
                '/threatmodel/:organisation/:repo/:branch/:model/create',
                sinon.match.any, // csrf protection
                homeController.ensureLoggedIn,
                threatmodelController.create
            );
        });
        
        it('routes PUT /threatmodel/:organisation/:repo/:branch/:model/update', () => {
            expect(mockRouter.put).to.have.been.calledWith(
                '/threatmodel/:organisation/:repo/:branch/:model/update',
                sinon.match.any, // csrf protection
                homeController.ensureLoggedIn,
                threatmodelController.update
            );
        });
    });
});
