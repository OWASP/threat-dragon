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

    describe('oauth-return', () => {
        let oauthReturnRoute;

        beforeEach(() => {
            oauthReturnRoute = router.getRoutes()
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
});
