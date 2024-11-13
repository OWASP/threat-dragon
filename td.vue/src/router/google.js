import { providerTypes } from '@/service/provider/providerTypes';

const providerType = providerTypes.google;

export const googleRoutes = [
    {
        path: `/${providerType}/:provider/folder`,
        name: `${providerType}Folder`,
        component: () => import(/* webpackChunkName: "folder-access" */ '../views/google/DriveAccess.vue')
    },
    {
        path: `/${providerType}/:provider/:folder/:threatmodel`,
        name: `${providerType}ThreatModel`,
        component: () => import(/* webpackChunkName: "threatmodel" */ '../views/ThreatModel.vue')
    },
    {
        path: `/${providerType}/:provider/:folder/new`,
        name: `${providerType}NewThreatModel`,
        component: () => import(/* webpackChunkName: "new-threatmodel" */ '../views/NewThreatModel.vue')
    },
    {
        path: `/${providerType}/:provider/:folder/:threatmodel/create`,
        name: `${providerType}ThreatModelCreate`,
        component: () => import(/* webpackChunkName: "threatmodel-edit" */ '../views/ThreatModelEdit.vue')
    },
    {
        path: `/${providerType}/:provider/:folder/:threatmodel/edit`,
        name: `${providerType}ThreatModelEdit`,
        component: () => import(/* webpackChunkName: "threatmodel-edit" */ '../views/ThreatModelEdit.vue')
    },
    {
        path: `/${providerType}/:provider/:folder/:threatmodel/edit/:diagram`,
        name: `${providerType}DiagramEdit`,
        component: () => import(/* webpackChunkName: "diagram-edit" */ '../views/DiagramEdit.vue')
    },
    {
        path: `/${providerType}/:provider/:folder/:threatmodel/report`,
        name: `${providerType}Report`,
        component: () => import(/* webpackChunkName: "report-model" */ '../views/ReportModel.vue')
    }
];
