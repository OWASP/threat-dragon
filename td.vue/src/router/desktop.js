import { providerTypes } from '../service/provider/providerTypes.js';

const providerType = providerTypes.desktop;

export const desktopRoutes = [
    {
        path: `/${providerType}/:threatmodel`,
        name: `${providerType}ThreatModel`,
        component: () => import(/* webpackChunkName: "threatmodel" */ '../views/ThreatModel.vue'),
        meta: { provider: 'desktop', requiresAuth: true }
    },
    {
        path: `/${providerType}/:threatmodel/edit`,
        name: `${providerType}ThreatModelEdit`,
        component: () =>
            import(/* webpackChunkName: "threatmodel-edit" */ '../views/ThreatModelEdit.vue'),
        meta: { provider: 'desktop', requiresAuth: true }
    },
    {
        path: `/${providerType}/:threatmodel/edit/:diagram`,
        name: `${providerType}DiagramEdit`,
        component: () => import(/* webpackChunkName: "diagram-edit" */ '../views/DiagramEdit.vue'),
        meta: { provider: 'desktop', requiresAuth: true }
    },
    {
        path: `/${providerType}/threatmodel/import`,
        name: `${providerType}ThreatModelImport`,
        component: () =>
            import(/* webpackChunkName: "threatmodel-import" */ '../views/ImportModel.vue'),
        meta: { provider: 'desktop', requiresAuth: true }
    },
    {
        path: `/${providerType}/threatmodel/new`,
        name: `${providerType}NewThreatModel`,
        component: () =>
            import(/* webpackChunkName: "new-threatmodel" */ '../views/NewThreatModel.vue'),
        meta: { provider: 'desktop', requiresAuth: true }
    },
    {
        path: `/${providerType}/:threatmodel/report`,
        name: `${providerType}Report`,
        component: () => import(/* webpackChunkName: "report-model" */ '../views/ReportModel.vue'),
        meta: { provider: 'desktop', requiresAuth: true }
    }
];
