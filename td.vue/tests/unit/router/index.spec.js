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
            expect(homeRoute.components.default.name).toEqual('Home')
        });
    });

    it('defines a home route', () => {
        const homeRoute = router.getRoutes()
            .find(x => x.name === 'Home');
        expect(homeRoute.path).toEqual('');
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
});