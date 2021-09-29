import { providerTypes } from '../service/provider/providerTypes.js';

const providerType = providerTypes.local;

export const localRoutes = [
    {
        path: `/${providerType}/:threatmodel`,
        name: `${providerType}ThreatModel`,
        component: () => import(/* webpackChunkName: "threatmodel" */ '../views/ThreatModel.vue')
    },
    {
        path: `/${providerType}/:threatmodel/edit`,
        name: `${providerType}ThreatModelEdit`,
        component: () => import(/* webpackChunkName: "threatmodel-edit" */ '../views/ThreatModelEdit.vue')
    },
    {
        path: `/${providerType}/:threatmodel/edit/:diagram`,
        name: `${providerType}DiagramEdit`,
        component: () => import(/* webpackChunkName: "diagram-edit" */ '../views/Diagram.vue')
    },
    {
        path: `/${providerType}/threatmodel/new`,
        name: `${providerType}NewThreatModel`,
        component: () => import(/* webpackChunkName: "new-threatmodel" */ '../views/NewThreatModel.vue')
    }
];
