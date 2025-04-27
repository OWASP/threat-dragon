import { providerTypes } from '@/service/provider/providerTypes';

const providerType = providerTypes.google;

export const googleRoutes = [
    {
        path: '/drive/folder',
        name: `${providerType}Folder`,
        component: () =>
            import(/* webpackChunkName: "folder-access" */ '../views/google/DriveAccess.vue'),
        meta: { provider: 'google' }
    },
    {
        path: '/drive/new',
        name: `${providerType}New`,
        component: () =>
            import(/* webpackChunkName: "new-threatmodel" */ '../views/NewThreatModel.vue'),
        meta: { provider: 'google' }
    },
    {
        path: '/drive/save',
        name: `${providerType}SaveModel`,
        component: () =>
            import(/* webpackChunkName: "folder-access" */ '../views/google/DriveAccess.vue'),
        props: (route) => {
            // Convert the threatModel object from route params to a proper object
            const threatModel = route.params && route.params.threatModel;
            
            return { 
                mode: 'save', 
                threatModel 
            };
        },
        meta: { provider: 'google' }
    },
    {
        path: '/drive/:folder/:threatmodel',
        name: `${providerType}ThreatModel`,
        component: () => import(/* webpackChunkName: "threatmodel" */ '../views/ThreatModel.vue'),
        meta: { provider: 'google' }
    },
    {
        path: '/drive/:folder/new',
        name: `${providerType}NewThreatModel`,
        component: () =>
            import(/* webpackChunkName: "new-threatmodel" */ '../views/NewThreatModel.vue'),
        meta: { provider: 'google' }
    },
    {
        path: '/drive/:folder/:threatmodel/create',
        name: `${providerType}ThreatModelCreate`,
        component: () =>
            import(/* webpackChunkName: "threatmodel-edit" */ '../views/ThreatModelEdit.vue'),
        meta: { provider: 'google' }
    },
    {
        path: '/drive/:folder/:threatmodel/edit',
        name: `${providerType}ThreatModelEdit`,
        component: () =>
            import(/* webpackChunkName: "threatmodel-edit" */ '../views/ThreatModelEdit.vue'),
        props: true,
        meta: { provider: 'google' }
    },
    {
        path: '/drive/:folder/:threatmodel/edit/:diagram',
        name: `${providerType}DiagramEdit`,
        component: () => import(/* webpackChunkName: "diagram-edit" */ '../views/DiagramEdit.vue'),
        meta: { provider: 'google' }
    },
    {
        path: '/drive/:folder/:threatmodel/report',
        name: `${providerType}Report`,
        component: () => import(/* webpackChunkName: "report-model" */ '../views/ReportModel.vue'),
        meta: { provider: 'google' }
    }
];
