import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import { gitRoutes } from './git.js';
import { localRoutes } from './local.js';
import { desktopRoutes } from './desktop.js';
import { googleRoutes } from './google.js';
import OAuthCallback from '../views/OAuthCallback.vue';
import ToSPage from '../views/ToSPage.vue';
import PrivacyPage from '../views/PrivacyPage.vue';

const routes = [
    {
        path: '/oauth-return',
        name: 'OAuthCallback',
        component: OAuthCallback,
    },
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
        path: '/tos',
        name: 'ToSPage',
        component: ToSPage
    },
    {
        path: '/privacy',
        name: 'PrivacyPage',
        component: PrivacyPage
    },
    {
        path: '/demo/select',
        name: 'DemoSelect',
        component: () => import(/* webpackChunkName: "demo-select" */ '../views/demo/SelectDemoModel.vue')
    },
    ...desktopRoutes,
    ...gitRoutes,
    ...localRoutes,
    ...googleRoutes,
];

const router = createRouter({
    history: createWebHistory(), // This removes the hash from URLs
    routes,
  });

export default router;