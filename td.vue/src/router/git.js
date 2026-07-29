import { providerTypes } from '@/service/provider/providerTypes';

const providerType = providerTypes.git;

// While state is maintained via Vuex, this will allow for deep-linking of threat models
export const gitRoutes = [
    {
        path: `/${providerType}/:provider/repository`,
        name: `${providerType}Repository`,
        component: () => import(/* webpackChunkName: "repository-access" */ '../views/git/RepositoryAccess.vue')
    },
    {
        path: `/${providerType}/:provider/:repository/branch`,
        name: `${providerType}Branch`,
        component: () => import(/* webpackChunkName: "branch-access" */ '../views/git/BranchAccess.vue')
    },
    {
        path: `/${providerType}/:provider/:repository/:branch/threatmodels`,
        name: `${providerType}ThreatModelSelect`,
        component: () => import(/* webpackChunkName: "threatmodel-select" */ '../views/git/ThreatModelSelect.vue')
    },
    {
        path: `/${providerType}/:provider/:repository/:branch/:threatmodel`,
        name: `${providerType}ThreatModel`,
        component: () => import(/* webpackChunkName: "threatmodel" */ '../views/ThreatModel.vue')
    },
    {
        path: `/${providerType}/:provider/:repository/:branch/new`,
        name: `${providerType}NewThreatModel`,
        component: () => import(/* webpackChunkName: "new-threatmodel" */ '../views/NewThreatModel.vue')
    },
    {
        path: `/${providerType}/:provider/:repository/:branch/:threatmodel/create`,
        name: `${providerType}ThreatModelCreate`,
        component: () => import(/* webpackChunkName: "threatmodel-edit" */ '../views/ThreatModelEdit.vue')
    },
    {
        path: `/${providerType}/:provider/:repository/:branch/:threatmodel/edit`,
        name: `${providerType}ThreatModelEdit`,
        component: () => import(/* webpackChunkName: "threatmodel-edit" */ '../views/ThreatModelEdit.vue')
    },
    {
        path: `/${providerType}/:provider/:repository/:branch/:threatmodel/edit/:diagram`,
        name: `${providerType}DiagramEdit`,
        component: () => import(/* webpackChunkName: "diagram-edit" */ '../views/DiagramEdit.vue')
    },
    {
        path: `/${providerType}/:provider/:repository/:branch/:threatmodel/report`,
        name: `${providerType}Report`,
        component: () => import(/* webpackChunkName: "report-model" */ '../views/ReportModel.vue')
    }
];
