import VueRouter from 'vue-router';

import router from '@/router/index.js';

describe('router/index.js', () => {
    it('creates a vue router', () => {
        expect(router.get()).toBeInstanceOf(VueRouter);
    });

    describe('Home page', () => {
        let homeRoute;

        beforeEach(() => {
            homeRoute = router.get().getRoutes()
                .find(x => x.name === 'HomePage');
        });

        it('is the default path', () => {
            expect(homeRoute.path).toEqual('');
        });

        it('uses the HomePage view', () => {
            expect(homeRoute.components.default.name).toEqual('HomePage');
        });
    });

    describe('Main dashboard', () => {
        let dashboardRoute;

        beforeEach(() => {
            dashboardRoute = router.get().getRoutes()
                .find(x => x.name === 'MainDashboard');
        });

        it('uses the /dashboard path', () => {
            expect(dashboardRoute.path).toEqual('/dashboard');
        });

        describe('lazily loaded component', () => {
            let dashboardComponent;

            beforeEach(async () => {
                dashboardComponent = await dashboardRoute.components.default();
            });

            it('uses the MainDashboard view', () => {
                expect(dashboardComponent.default.name).toEqual('MainDashboard');
            });
        });
    });

    describe('oauth-return', () => {
        let oauthReturnRoute;

        beforeEach(() => {
            oauthReturnRoute = router.get().getRoutes()
                .find(x => x.name === 'OAuthReturn');
        });

        it('uses the /oauth-return path', () => {
            expect(oauthReturnRoute.path).toEqual('/oauth-return');
        });

        describe('lazily loaded component', () => {
            let oauthReturnComponent;

            beforeEach(async () => {
                oauthReturnComponent = await oauthReturnRoute.components.default();
            });

            it('uses the branch view', () => {
                expect(oauthReturnComponent.default.name).toEqual('OAuthReturn');
            });
        });
    });

    describe('demo-select', () => {
        let demoSelectRoute;

        beforeEach(() => {
            demoSelectRoute = router.get().getRoutes()
                .find(x => x.name === 'DemoSelect');
        });

        it('uses the /dashboard path', () => {
            expect(demoSelectRoute.path).toEqual('/demo/select');
        });

        describe('lazily loaded component', () => {
            let demoSelectComponent;

            beforeEach(async () => {
                demoSelectComponent = await demoSelectRoute.components.default();
            });

            it('uses the dashboard view', () => {
                expect(demoSelectComponent.default.name).toEqual('SelectDemoModel');
            });
        });
    });

});
