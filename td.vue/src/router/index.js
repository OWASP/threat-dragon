import Vue from 'vue';
import VueRouter from 'vue-router';

import { gitRoutes } from './git.js';
import Home from '../views/Home.vue';
import { localRoutes } from './local.js';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboard.vue')   
    },
    {
        path: '/oauth-return',
        name: 'OAuthReturn',
        component: () => import(/* webpackChunkName: "oauth-return" */ '../views/OauthReturn.vue')
    },
    ...gitRoutes,
    ...localRoutes
];

const router = new VueRouter({
    routes
});

export default router;
