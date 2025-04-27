import { providerTypes } from '@/service/provider/providerTypes';

const providerType = providerTypes.git;

// Updated routes to use meta.provider approach for consistency across providers
// This allows the router to set the provider in Vuex store rather than using route params
export const gitRoutes = [
    {
        path: `/${providerType}/github/repository`,
        name: `${providerType}Repository`,
        component: () =>
            import(/* webpackChunkName: "repository-access" */ '../views/git/RepositoryAccess.vue'),
        meta: { provider: 'github', requiresAuth: true }
    },
    {
        path: `/${providerType}/github/:repository/branch`,
        name: `${providerType}Branch`,
        component: () =>
            import(/* webpackChunkName: "branch-access" */ '../views/git/BranchAccess.vue'),
        meta: { provider: 'github', requiresAuth: true }
    },
    {
        path: `/${providerType}/github/:repository/:branch/threatmodels`,
        name: `${providerType}ThreatModelSelect`,
        component: () =>
            import(
                /* webpackChunkName: "threatmodel-select" */ '../views/git/ThreatModelSelect.vue'
            ),
        meta: { provider: 'github', requiresAuth: true }
    },
    {
        path: `/${providerType}/github/:repository/:branch/:threatmodel`,
        name: `${providerType}ThreatModel`,
        component: () => import(/* webpackChunkName: "threatmodel" */ '../views/ThreatModel.vue'),
        meta: { provider: 'github', requiresAuth: true }
    },
    {
        path: `/${providerType}/github/:repository/:branch/new`,
        name: `${providerType}NewThreatModel`,
        component: () =>
            import(/* webpackChunkName: "new-threatmodel" */ '../views/NewThreatModel.vue'),
        meta: { provider: 'github', requiresAuth: true }
    },
    {
        path: `/${providerType}/github/:repository/:branch/:threatmodel/create`,
        name: `${providerType}ThreatModelCreate`,
        component: () =>
            import(/* webpackChunkName: "threatmodel-edit" */ '../views/ThreatModelEdit.vue'),
        meta: { provider: 'github', requiresAuth: true }
    },
    {
        path: `/${providerType}/github/:repository/:branch/:threatmodel/edit`,
        name: `${providerType}ThreatModelEdit`,
        component: () =>
            import(/* webpackChunkName: "threatmodel-edit" */ '../views/ThreatModelEdit.vue'),
        meta: { provider: 'github', requiresAuth: true }
    },
    {
        path: `/${providerType}/github/:repository/:branch/:threatmodel/edit/:diagram`,
        name: `${providerType}DiagramEdit`,
        component: () => import(/* webpackChunkName: "diagram-edit" */ '../views/DiagramEdit.vue'),
        meta: { provider: 'github', requiresAuth: true }
    },
    {
        path: `/${providerType}/github/:repository/:branch/:threatmodel/report`,
        name: `${providerType}Report`,
        component: () => import(/* webpackChunkName: "report-model" */ '../views/ReportModel.vue'),
        meta: { provider: 'github', requiresAuth: true }
    },

    // Add similar routes for other Git providers
    // For GitLab
    {
        path: `/${providerType}/gitlab/repository`,
        name: `gitlab-${providerType}Repository`,
        component: () =>
            import(/* webpackChunkName: "repository-access" */ '../views/git/RepositoryAccess.vue'),
        meta: { provider: 'gitlab', requiresAuth: true }
    },
    {
        path: `/${providerType}/gitlab/:repository/branch`,
        name: `gitlab-${providerType}Branch`,
        component: () =>
            import(/* webpackChunkName: "branch-access" */ '../views/git/BranchAccess.vue'),
        meta: { provider: 'gitlab', requiresAuth: true }
    },
    {
        path: `/${providerType}/gitlab/:repository/:branch/threatmodels`,
        name: `gitlab-${providerType}ThreatModelSelect`,
        component: () =>
            import(
                /* webpackChunkName: "threatmodel-select" */ '../views/git/ThreatModelSelect.vue'
            ),
        meta: { provider: 'gitlab', requiresAuth: true }
    },

    // For BitBucket - complete route definitions
    {
        path: `/${providerType}/bitbucket/repository`,
        name: `bitbucket-${providerType}Repository`,
        component: () =>
            import(/* webpackChunkName: "repository-access" */ '../views/git/RepositoryAccess.vue'),
        meta: { provider: 'bitbucket', requiresAuth: true }
    },
    {
        path: `/${providerType}/bitbucket/:repository/branch`,
        name: `bitbucket-${providerType}Branch`,
        component: () =>
            import(/* webpackChunkName: "branch-access" */ '../views/git/BranchAccess.vue'),
        meta: { provider: 'bitbucket', requiresAuth: true }
    },
    {
        path: `/${providerType}/bitbucket/:repository/:branch/threatmodels`,
        name: `bitbucket-${providerType}ThreatModelSelect`,
        component: () =>
            import(
                /* webpackChunkName: "threatmodel-select" */ '../views/git/ThreatModelSelect.vue'
            ),
        meta: { provider: 'bitbucket', requiresAuth: true }
    },
    {
        path: `/${providerType}/bitbucket/:repository/:branch/:threatmodel`,
        name: `bitbucket-${providerType}ThreatModel`,
        component: () => import(/* webpackChunkName: "threatmodel" */ '../views/ThreatModel.vue'),
        meta: { provider: 'bitbucket', requiresAuth: true }
    },
    {
        path: `/${providerType}/bitbucket/:repository/:branch/new`,
        name: `bitbucket-${providerType}NewThreatModel`,
        component: () =>
            import(/* webpackChunkName: "new-threatmodel" */ '../views/NewThreatModel.vue'),
        meta: { provider: 'bitbucket', requiresAuth: true }
    },
    {
        path: `/${providerType}/bitbucket/:repository/:branch/:threatmodel/create`,
        name: `bitbucket-${providerType}ThreatModelCreate`,
        component: () =>
            import(/* webpackChunkName: "threatmodel-edit" */ '../views/ThreatModelEdit.vue'),
        meta: { provider: 'bitbucket', requiresAuth: true }
    },
    {
        path: `/${providerType}/bitbucket/:repository/:branch/:threatmodel/edit`,
        name: `bitbucket-${providerType}ThreatModelEdit`,
        component: () =>
            import(/* webpackChunkName: "threatmodel-edit" */ '../views/ThreatModelEdit.vue'),
        meta: { provider: 'bitbucket', requiresAuth: true }
    },
    {
        path: `/${providerType}/bitbucket/:repository/:branch/:threatmodel/edit/:diagram`,
        name: `bitbucket-${providerType}DiagramEdit`,
        component: () => import(/* webpackChunkName: "diagram-edit" */ '../views/DiagramEdit.vue'),
        meta: { provider: 'bitbucket', requiresAuth: true }
    },
    {
        path: `/${providerType}/bitbucket/:repository/:branch/:threatmodel/report`,
        name: `bitbucket-${providerType}Report`,
        component: () => import(/* webpackChunkName: "report-model" */ '../views/ReportModel.vue'),
        meta: { provider: 'bitbucket', requiresAuth: true }
    }
];
