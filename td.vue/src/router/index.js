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
        path: '/datasource',
        name: 'Datasource',
        component: () => import(/* webpackChunkName: "datasource" */ '../views/Datasource.vue')   
    }
];

const router = new VueRouter({
    routes
});

export default router;
