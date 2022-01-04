import Vue from 'vue';
import VueRouter from 'vue-router';

import { gitRoutes } from './git.js';
import Home from '../views/Home.vue';
import { localRoutes } from './local.js';

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
    {
        path: '/demo/select',
        name: 'DemoSelect',
        component: () => import(/* webpackChunkName: "demo-select" */ '../views/demo/SelectDemoModel.vue')
    },
    ...gitRoutes,
    ...localRoutes
];

const get = () => {
    Vue.use(VueRouter);
    return new VueRouter({
        routes
    });
};

export default {
    get
};
