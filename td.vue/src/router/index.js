import { createRouter, createWebHashHistory } from 'vue-router';

import { gitRoutes } from './git.js';
import HomePage from '../views/HomePage.vue';
import { localRoutes } from './local.js';
import { desktopRoutes } from './desktop.js';
import { googleRoutes } from './google.js';
import store from '@/store';
import analytics from '@/service/analytics.js';

const pageViewEvents = Object.freeze({
    MainDashboard: 'PAGE_VIEW_DASHBOARD',
    DemoSelect: 'PAGE_VIEW_DEMO_MODEL_SELECT',
    gitRepository: 'PAGE_VIEW_REPOSITORY_SELECT',
    gitBranch: 'PAGE_VIEW_BRANCH_SELECT',
    gitThreatModelSelect: 'PAGE_VIEW_THREAT_MODEL_SELECT',
    googleFolder: 'PAGE_VIEW_GOOGLE_FOLDER_SELECT',
    localThreatModelImport: 'PAGE_VIEW_IMPORT_MODEL',
    localNewThreatModel: 'PAGE_VIEW_NEW_THREAT_MODEL',
    gitNewThreatModel: 'PAGE_VIEW_NEW_THREAT_MODEL',
    googleNewThreatModel: 'PAGE_VIEW_NEW_THREAT_MODEL',
    localThreatModel: 'PAGE_VIEW_THREAT_MODEL',
    gitThreatModel: 'PAGE_VIEW_THREAT_MODEL',
    googleThreatModel: 'PAGE_VIEW_THREAT_MODEL',
    localThreatModelEdit: 'PAGE_VIEW_THREAT_MODEL_EDIT',
    gitThreatModelEdit: 'PAGE_VIEW_THREAT_MODEL_EDIT',
    googleThreatModelEdit: 'PAGE_VIEW_THREAT_MODEL_EDIT',
    localDiagramEdit: 'PAGE_VIEW_DIAGRAM_EDITOR',
    gitDiagramEdit: 'PAGE_VIEW_DIAGRAM_EDITOR',
    googleDiagramEdit: 'PAGE_VIEW_DIAGRAM_EDITOR',
    localReport: 'PAGE_VIEW_THREAT_MODEL_REPORT',
    gitReport: 'PAGE_VIEW_THREAT_MODEL_REPORT',
    googleReport: 'PAGE_VIEW_THREAT_MODEL_REPORT'
});

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

let routerInstance = null;

const get = () => {
    if (routerInstance === null) {
        routerInstance = createRouter({
            history: createWebHashHistory(),
            routes
        });

        // Navigation guard for admin routes
        routerInstance.beforeEach((to, _from, next) => {
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

        routerInstance.afterEach((to) => analytics.track(pageViewEvents[to.name]));
    }

    return routerInstance;
};

export default {
    get
};
