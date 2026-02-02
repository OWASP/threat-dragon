import Vue from 'vue';
import VueRouter from 'vue-router';

import { gitRoutes } from './git.js';
import HomePage from '../views/HomePage.vue';
import { localRoutes } from './local.js';
import { desktopRoutes } from './desktop.js';
import { googleRoutes } from './google.js';
import store from '@/store';

const routes = [
    {
        path: '/',
        name: 'HomePage',
        component: HomePage
    },
    {
        path: '/dashboard',
        name: 'MainDashboard',
        component: () => import(/* webpackChunkName: "main-dashboard" */ '../views/MainDashboard.vue')
    },
    {
        path: '/oauth-return',
        name: 'OAuthReturn',
        component: () => import(/* webpackChunkName: "oauth-return" */ '../views/OauthReturn.vue')
    },
    {
        path: '/demo/select',
        name: 'DemoSelect',
        component: () => import(/* webpackChunkName: "demo-select" */ '../views/demo/SelectDemoModel.vue')
    },
    ...desktopRoutes,
    ...gitRoutes,
    ...localRoutes,
    ...googleRoutes
];

const get = () => {
    Vue.use(VueRouter);
    const router = new VueRouter({
        routes
    });

    // Navigation guard for admin routes
    router.beforeEach((to, _from, next) => {
        if (to.meta.requiresAdmin) {
            const isAdmin = store.get().getters.isAdmin;

            if (!isAdmin) {
                console.warn('Access denied: Admin route requires admin permissions');
                next('/dashboard');
            } else {
                next();
            }
        } else {
            next();
        }
    });

    return router;
};

export default {
    get
};
