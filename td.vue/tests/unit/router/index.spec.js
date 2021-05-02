import VueRouter from 'vue-router';

import router from '@/router/index.js';

describe('router', () => {
    it('creates a vue router', () => {
        expect(router).toBeInstanceOf(VueRouter);
    });

    describe('home', () => {
        let homeRoute;

        beforeEach(() => {
            homeRoute = router.getRoutes()
                .find(x => x.name === 'Home');
        });

        it('is the default path', () => {
            expect(homeRoute.path).toEqual('');
        });

        it('uses the home view', () => {
            expect(homeRoute.components.default.name).toEqual('Home');
        });
    });

    describe('dashboard', () => {
        let dashboardRoute;

        beforeEach(() => {
            dashboardRoute = router.getRoutes()
                .find(x => x.name === 'Dashboard');
        });

        it('uses the /dashboard path', () => {
            expect(dashboardRoute.path).toEqual('/dashboard');
        });

        describe('lazily loaded component', () => {
            let dashboardComponent;

            beforeEach(async () => {
                dashboardComponent = await dashboardRoute.components.default();
            });

            it('uses the dashboard view', () => {
                expect(dashboardComponent.default.name).toEqual('Dashboard');
            });
        });
    });

    describe('repository', () => {
        let repositoryRoute;

        beforeEach(() => {
            repositoryRoute = router.getRoutes()
                .find(x => x.name === 'Repository');
        });

        it('uses the /repository path', () => {
            expect(repositoryRoute.path).toEqual('/repository');
        });

        describe('lazily loaded component', () => {
            let repositoryComponent;

            beforeEach(async () => {
                repositoryComponent = await repositoryRoute.components.default();
            });

            it('uses the repository view', () => {
                expect(repositoryComponent.default.name).toEqual('Repository');
            });
        });
    });

    describe('branch', () => {
        let branchRoute;

        beforeEach(() => {
            branchRoute = router.getRoutes()
                .find(x => x.name === 'Branch');
        });

        it('uses the /branch path', () => {
            expect(branchRoute.path).toEqual('/branch');
        });

        describe('lazily loaded component', () => {
            let branchComponent;

            beforeEach(async () => {
                branchComponent = await branchRoute.components.default();
            });

            it('uses the branch view', () => {
                expect(branchComponent.default.name).toEqual('Branch');
            });
        });
    });

    describe('threatmodel-select', () => {
        let threatmodelSelectRoute;

        beforeEach(() => {
            threatmodelSelectRoute = router.getRoutes()
                .find(x => x.name === 'ThreatmodelSelect');
        });

        it('uses the /threatmodel-select path', () => {
            expect(threatmodelSelectRoute.path).toEqual('/threatmodel-select');
        });

        describe('lazily loaded component', () => {
            let threatmodelSelectComponent;

            beforeEach(async () => {
                threatmodelSelectComponent = await threatmodelSelectRoute.components.default();
            });

            it('uses the threatmodel select view', () => {
                expect(threatmodelSelectComponent.default.name).toEqual('ThreatmodelSelect');
            });
        });
    });
});