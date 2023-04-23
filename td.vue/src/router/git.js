import { providerTypes } from '@/service/provider/providerTypes';

const providerType = providerTypes.git;

// While state is maintained via Vuex, this will allow for deep-linking of threat models
export const gitRoutes = [
  {
    path: `/${providerType}/:provider/repository`,
    name: `${providerType}Repository`,
    component: () => import('../views/git/RepositoryAccess.vue')
  },
  {
    path: `/${providerType}/:provider/:repository/branch`,
    name: `${providerType}Branch`,
    component: () => import('../views/git/BranchAccess.vue')
  },
  {
    path: `/${providerType}/:provider/:repository/:branch/threatmodels`,
    name: `${providerType}ThreatModelSelect`,
    component: () => import('../views/git/ThreatModelSelect.vue')
  },
  {
    path: `/${providerType}/:provider/:repository/:branch/:threatmodel`,
    name: `${providerType}ThreatModel`,
    component: () => import('../views/ThreatModel.vue')
  },
  {
    path: `/${providerType}/:provider/:repository/:branch/new`,
    name: `${providerType}NewThreatModel`,
    component: () => import('../views/NewThreatModel.vue')
  },
  {
    path: `/${providerType}/:provider/:repository/:branch/:threatmodel/create`,
    name: `${providerType}ThreatModelCreate`,
    component: () => import('../views/ThreatModelEdit.vue')
  },
  {
    path: `/${providerType}/:provider/:repository/:branch/:threatmodel/edit`,
    name: `${providerType}ThreatModelEdit`,
    component: () => import('../views/ThreatModelEdit.vue')
  },
  {
    path: `/${providerType}/:provider/:repository/:branch/:threatmodel/edit/:diagram`,
    name: `${providerType}DiagramEdit`,
    component: () => import('../views/DiagramEdit.vue')
  },
  {
    path: `/${providerType}/:provider/:repository/:branch/:threatmodel/report`,
    name: `${providerType}Report`,
    component: () => import('../views/ReportModel.vue')
  }
];
