import { providerTypes } from '../service/provider/providerTypes.js';

const providerType = providerTypes.local;

export const localRoutes = [
    {
        path: `/${providerType}/threatmodels`,
        name: `${providerType}ThreatModelSelect`,
        component: () => import(/* webpackChunkName: "threatmodel-select" */ '../views/ThreatModelSelect.vue')
    },
    {
        path: `/${providerType}/:threatmodel`,
        name: `${providerType}ThreatModel`,
        component: () => import(/* webpackChunkName: "threatmodel" */ '../views/ThreatModel.vue')
    },
    {
        path: `/${providerType}/:threatmodel/edit`,
        name: `${providerType}ThreatModelEdit`,
        component: () => import(/* webpackChunkName: "threatmodel-edit" */ '../views/ThreatModelEdit.vue')
    }
];
