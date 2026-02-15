
export const getTemplateRoutes = (providerType,pathPrefix) => [
    {
        path: `${pathPrefix}/export-template`,
        name: `${providerType}ThreatModelExportTemplate`,
        component: () => import(/* webpackChunkName: "export-template" */ '../views/ExportTemplate.vue'),
    },
    {
        path: `${pathPrefix}/templates`,
        name: `${providerType}TemplateGallery`,
        component: () => import(/* webpackChunkName: "template-gallery" */ '../views/TemplateGallery.vue')
    },
];

export const adminTemplateRoutes = [
    {
        path: '/admin/templates',
        name: 'ManageTemplates',
        component: () => import(/* webpackChunkName: "manage-templates" */ '../views/ManageTemplates.vue'),
        meta: { requiresAdmin: true }
    },
];