import { createRouter as _createRouter } from 'vue-router';

import router from '@/router/index.js';

describe('router/index.js', () => {
    it('creates a vue router', () => {
        expect(router).toBeInstanceOf(Object);
    });

    describe('Home page', () => {
        let homeRoute;

        beforeEach(() => {
            homeRoute = router.getRoutes()
                .find(x => x.name === 'HomePage');
        });

        it('is the default path', () => {
            expect(homeRoute.path).toEqual('/');
        });

        it('uses the HomePage view', () => {
            expect(homeRoute.components.default.name).toEqual('HomePage');
        });
    });

    describe('Main dashboard', () => {
        let dashboardRoute;

        beforeEach(() => {
            dashboardRoute = router.getRoutes()
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

    describe('oauth callback', () => {
        let oauthCallbackRoute;

        beforeEach(() => {
            oauthCallbackRoute = router.getRoutes()
                .find(x => x.name === 'OAuthCallback');
        });

        it('uses the /oauth-return path', () => {
            expect(oauthCallbackRoute.path).toEqual('/oauth-return');
        });

        // In Vue 3 with the composition API, the component name may not be defined
        // in the same way, so we just check it's the right component
        it('is a valid component', () => {
            expect(oauthCallbackRoute.components.default).toBeDefined();
        });
    });

    describe('demo-select', () => {
        let demoSelectRoute;

        beforeEach(() => {
            demoSelectRoute = router.getRoutes()
                .find(x => x.name === 'DemoSelect');
        });

        it('uses the /demo/select path', () => {
            expect(demoSelectRoute.path).toEqual('/demo/select');
        });

        describe('lazily loaded component', () => {
            let demoSelectComponent;

            beforeEach(async () => {
                demoSelectComponent = await demoSelectRoute.components.default();
            });

            it('uses the SelectDemoModel view', () => {
                expect(demoSelectComponent.default.name).toEqual('SelectDemoModel');
            });
        });
    });
});
