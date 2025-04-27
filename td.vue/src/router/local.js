import { providerTypes } from '../service/provider/providerTypes.js';

const providerType = providerTypes.local;

export const localRoutes = [
    {
        path: '/models/:threatmodel',
        // Use both the standard name format and the direct 'localThreatModel' name for compatibility with SelectDemoModel
        name: 'localThreatModel',
        component: () => import(/* webpackChunkName: "threatmodel" */ '../views/ThreatModel.vue'),
        meta: { provider: 'local' }
    },
    {
        path: '/models/:threatmodel/edit',
        name: `${providerType}ThreatModelEdit`,
        component: () =>
            import(/* webpackChunkName: "threatmodel-edit" */ '../views/ThreatModelEdit.vue'),
        meta: { provider: 'local' }
    },
    {
        path: '/models/:threatmodel/edit/:diagram',
        name: 'localDiagramEdit', // Use a consistent name for local routes
        component: () => import(/* webpackChunkName: "diagram-edit" */ '../views/DiagramEdit.vue'),
        meta: { provider: 'local' }
    },
    {
        path: '/local/threatmodel/import',
        name: `${providerType}ThreatModelImport`,
        component: () =>
            import(/* webpackChunkName: "threatmodel-import" */ '../views/ImportModel.vue'),
        meta: { provider: 'local' }
    },
    {
        path: '/local/threatmodel/new',
        name: `${providerType}NewThreatModel`,
        component: () =>
            import(/* webpackChunkName: "new-threatmodel" */ '../views/NewThreatModel.vue'),
        meta: { provider: 'local' }
    },
    {
        path: '/models/:threatmodel/report',
        name: `${providerType}Report`,
        component: () => import(/* webpackChunkName: "report-model" */ '../views/ReportModel.vue'),
        meta: { provider: 'local' }
    }
];
