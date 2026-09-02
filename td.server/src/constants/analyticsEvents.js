export const analyticsEvents = Object.freeze({
    PAGE_VIEW_HOME: 'PAGE_VIEW_HOME',
    PAGE_VIEW_DASHBOARD: 'PAGE_VIEW_DASHBOARD',
    PAGE_VIEW_DEMO_MODEL_SELECT: 'PAGE_VIEW_DEMO_MODEL_SELECT',
    PAGE_VIEW_REPOSITORY_SELECT: 'PAGE_VIEW_REPOSITORY_SELECT',
    PAGE_VIEW_BRANCH_SELECT: 'PAGE_VIEW_BRANCH_SELECT',
    PAGE_VIEW_THREAT_MODEL_SELECT: 'PAGE_VIEW_THREAT_MODEL_SELECT',
    PAGE_VIEW_GOOGLE_FOLDER_SELECT: 'PAGE_VIEW_GOOGLE_FOLDER_SELECT',
    PAGE_VIEW_IMPORT_MODEL: 'PAGE_VIEW_IMPORT_MODEL',
    PAGE_VIEW_NEW_THREAT_MODEL: 'PAGE_VIEW_NEW_THREAT_MODEL',
    PAGE_VIEW_THREAT_MODEL: 'PAGE_VIEW_THREAT_MODEL',
    PAGE_VIEW_THREAT_MODEL_EDIT: 'PAGE_VIEW_THREAT_MODEL_EDIT',
    PAGE_VIEW_DIAGRAM_EDITOR: 'PAGE_VIEW_DIAGRAM_EDITOR',
    PAGE_VIEW_THREAT_MODEL_REPORT: 'PAGE_VIEW_THREAT_MODEL_REPORT',
    PROVIDER_SELECTED: 'PROVIDER_SELECTED',
    PROVIDER_AUTHENTICATION_SUCCEEDED: 'PROVIDER_AUTHENTICATION_SUCCEEDED',
    THREAT_MODEL_OPENED: 'THREAT_MODEL_OPENED',
    THREAT_MODEL_CREATED: 'THREAT_MODEL_CREATED',
    THREAT_MODEL_SAVED: 'THREAT_MODEL_SAVED',
    APPLICATION_LANGUAGE_USED: 'APPLICATION_LANGUAGE_USED',
    THREAT_MODEL_EDIT_SESSION_ENDED: 'THREAT_MODEL_EDIT_SESSION_ENDED',
    DIAGRAM_CREATED: 'DIAGRAM_CREATED',
    DIAGRAM_METHODOLOGY_USED: 'DIAGRAM_METHODOLOGY_USED',
    THREAT_CREATED_MANUALLY: 'THREAT_CREATED_MANUALLY',
    THREAT_UPDATED: 'THREAT_UPDATED',
    THREAT_STATUS_UPDATED: 'THREAT_STATUS_UPDATED',
    THREAT_DELETED: 'THREAT_DELETED',
    THREAT_SUGGESTIONS_REQUESTED: 'THREAT_SUGGESTIONS_REQUESTED',
    THREAT_SUGGESTION_APPLIED: 'THREAT_SUGGESTION_APPLIED',
    THREAT_MODEL_TMBOM_EXPORTED: 'THREAT_MODEL_TMBOM_EXPORTED',
    DIAGRAM_EXPORTED: 'DIAGRAM_EXPORTED',
    THREAT_MODEL_REPORT_PRINT_REQUESTED: 'THREAT_MODEL_REPORT_PRINT_REQUESTED'
});

export const analyticsEventNames = Object.freeze(Object.values(analyticsEvents));

const providerValues = Object.freeze(['local', 'github', 'gitlab', 'bitbucket', 'google']);
const remoteProviderValues = Object.freeze(['github', 'gitlab', 'bitbucket', 'google']);

export const analyticsEventProperties = Object.freeze({
    [analyticsEvents.PROVIDER_SELECTED]: Object.freeze({ provider: providerValues }),
    [analyticsEvents.PROVIDER_AUTHENTICATION_SUCCEEDED]: Object.freeze({ provider: remoteProviderValues }),
    [analyticsEvents.THREAT_MODEL_OPENED]: Object.freeze({
        source: Object.freeze([...remoteProviderValues, 'import', 'demo'])
    }),
    [analyticsEvents.THREAT_MODEL_CREATED]: Object.freeze({ provider: providerValues }),
    [analyticsEvents.THREAT_MODEL_SAVED]: Object.freeze({ provider: providerValues }),
    [analyticsEvents.APPLICATION_LANGUAGE_USED]: Object.freeze({
        language: Object.freeze(['ar', 'de', 'el', 'en', 'es', 'fi', 'fr', 'hi', 'id', 'ja', 'ms', 'pt', 'pt-BR', 'zh'])
    }),
    [analyticsEvents.THREAT_MODEL_EDIT_SESSION_ENDED]: Object.freeze({
        duration_bucket: Object.freeze([
            'LESS_THAN_5_MINUTES',
            'FIVE_TO_FIFTEEN_MINUTES',
            'FIFTEEN_TO_THIRTY_MINUTES',
            'THIRTY_TO_SIXTY_MINUTES',
            'SIXTY_PLUS_MINUTES'
        ])
    }),
    [analyticsEvents.DIAGRAM_METHODOLOGY_USED]: Object.freeze({
        methodology: Object.freeze(['CIA', 'CIADIE', 'LINDDUN', 'PLOT4AI', 'STRIDE', 'EOP', 'GENERIC'])
    }),
    [analyticsEvents.THREAT_STATUS_UPDATED]: Object.freeze({
        status: Object.freeze(['NotApplicable', 'Open', 'Mitigated', 'Accepted', 'Transferred', 'Avoided', 'Eliminated'])
    }),
    [analyticsEvents.THREAT_SUGGESTIONS_REQUESTED]: Object.freeze({
        source: Object.freeze(['type', 'context'])
    }),
    [analyticsEvents.THREAT_SUGGESTION_APPLIED]: Object.freeze({
        source: Object.freeze(['type', 'context'])
    }),
    [analyticsEvents.DIAGRAM_EXPORTED]: Object.freeze({ format: Object.freeze(['PNG', 'SVG']) })
});

export const pageViewPaths = Object.freeze({
    [analyticsEvents.PAGE_VIEW_HOME]: '/',
    [analyticsEvents.PAGE_VIEW_DASHBOARD]: '/dashboard',
    [analyticsEvents.PAGE_VIEW_DEMO_MODEL_SELECT]: '/demo-models',
    [analyticsEvents.PAGE_VIEW_REPOSITORY_SELECT]: '/repository-selection',
    [analyticsEvents.PAGE_VIEW_BRANCH_SELECT]: '/branch-selection',
    [analyticsEvents.PAGE_VIEW_THREAT_MODEL_SELECT]: '/threat-model-selection',
    [analyticsEvents.PAGE_VIEW_GOOGLE_FOLDER_SELECT]: '/google-folder-selection',
    [analyticsEvents.PAGE_VIEW_IMPORT_MODEL]: '/import-model',
    [analyticsEvents.PAGE_VIEW_NEW_THREAT_MODEL]: '/new-threat-model',
    [analyticsEvents.PAGE_VIEW_THREAT_MODEL]: '/threat-model',
    [analyticsEvents.PAGE_VIEW_THREAT_MODEL_EDIT]: '/threat-model-edit',
    [analyticsEvents.PAGE_VIEW_DIAGRAM_EDITOR]: '/diagram-editor',
    [analyticsEvents.PAGE_VIEW_THREAT_MODEL_REPORT]: '/threat-model-report'
});
