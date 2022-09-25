import Vue from 'vue';
import VueRouter from 'vue-router';

import { getProviderType } from '@/service/provider/providers.js';
import { gitRoutes } from './git.js';
import HomePage from '../views/HomePage.vue';
import { localRoutes } from './local.js';
import storeFactory from '../store/index.js';

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
    ...gitRoutes,
    ...localRoutes
];

const upgradeGuard = (to, from, next) => {
    const ignoreMatchers = [
        'OAuthReturn',
        'Upgrade'
    ];
    if (!to.name || ignoreMatchers.some(x => to.name.indexOf(x) !== -1)) {
        return next();
    }

    const store = storeFactory.get();
    if (store.getters.isV1Model) {
    // upgrade version 1.x diagrams to latest version
        return next({ name: `${getProviderType(store.state.provider.selected)}Upgrade`, params: to.params });
    }

    return next();
};

const get = () => {
    Vue.use(VueRouter);
    const router = new VueRouter({
        routes
    });
    router.beforeEach(upgradeGuard);
    return router;
};

export default {
    get,
    upgradeGuard
};
