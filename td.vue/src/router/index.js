import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from '../views/Home.vue';

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
        path: '/repository',
        name: 'Repository',
        component: () => import(/* webpackChunkName: "repository" */ '../views/Repository.vue')
    },
    {
        path: '/branch',
        name: 'Branch',
        component: () => import(/* webpackChunkName: "branch" */ '../views/Branch.vue')
    }
];

const router = new VueRouter({
    routes
});

export default router;
