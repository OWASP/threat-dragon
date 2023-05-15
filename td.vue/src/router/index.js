import {createRouter, createWebHashHistory, createWebHistory} from 'vue-router';

import { gitRoutes } from './git.js';
import HomePage from '../views/HomePage.vue';
import { localRoutes } from './local.js';
import isElectron from 'is-electron';

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage
  },
  {
    path: '/dashboard',
    name: 'MainDashboard',
    component: () => import('../views/MainDashboard.vue')
  },
  {
    path: '/oauth-return',
    name: 'OAuthReturn',
    component: () => import('../views/OauthReturn.vue')
  },
  {
    path: '/demo/select',
    name: 'DemoSelect',
    component: () => import('../views/demo/SelectDemoModel.vue')
  },
  ...gitRoutes,
  ...localRoutes
];

const router = new createRouter({
  history: isElectron() ? createWebHashHistory() : createWebHistory(),
  routes
});

export default router;
