import { providerTypes } from '@/service/provider/providerTypes';

const providerType = providerTypes.local;

export const localRoutes = [
  {
    path: `/${providerType}/:threatmodel`,
    name: `${providerType}ThreatModel`,
    component: () => import('../views/ThreatModel.vue')
  },
  {
    path: `/${providerType}/:threatmodel/edit`,
    name: `${providerType}ThreatModelEdit`,
    component: () => import('../views/ThreatModelEdit.vue')
  },
  {
    path: `/${providerType}/:threatmodel/edit/:diagram`,
    name: `${providerType}DiagramEdit`,
    component: () => import('../views/DiagramEdit.vue')
  },
  {
    path: `/${providerType}/threatmodel/import`,
    name: `${providerType}ThreatModelImport`,
    component: () => import('../views/ImportModel.vue')
  },
  {
    path: `/${providerType}/threatmodel/new`,
    name: `${providerType}NewThreatModel`,
    component: () => import('../views/NewThreatModel.vue')
  },
  {
    path: `/${providerType}/:threatmodel/report`,
    name: `${providerType}Report`,
    component: () => import('../views/ReportModel.vue')
  }
];
