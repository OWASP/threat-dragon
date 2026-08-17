/**
 * Analytics event names tracked by Plausible.
 * This enum is the single source of truth for all tracked events.
 * It is referenced by both the tracking code and the transparency (analytics) page.
 *
 * No user-identifiable data is ever sent with any of these events.
 */
export const analyticsEvents = Object.freeze({
    DOCS_LINK_CLICKED: 'docs_link_clicked',
    OWASP_LINK_CLICKED: 'owasp_link_clicked',
    LANGUAGE_CHANGED: 'language_changed',
    LOGIN: 'login',
    LOGOUT: 'logout',
    CREATE_NEW_MODEL: 'create_new_model',
    OPEN_EXISTING_MODEL: 'open_existing_model',
    SAVE_MODEL: 'save_model',
    IMPORT_MODEL: 'import_model',
    EXPORT_MODEL: 'export_model',
    GENERATE_REPORT: 'generate_report',
    ADD_DIAGRAM: 'add_diagram',
    OPEN_DIAGRAM: 'open_diagram'
});

/**
 * Human-readable descriptions for each analytics event.
 * Used on the transparency page so users understand what is tracked.
 */
export const analyticsEventDescriptions = Object.freeze({
    [analyticsEvents.DOCS_LINK_CLICKED]: 'User clicked a link to the documentation site',
    [analyticsEvents.OWASP_LINK_CLICKED]: 'User clicked a link to an OWASP resource',
    [analyticsEvents.LANGUAGE_CHANGED]: 'User changed the interface language (language value not recorded)',
    [analyticsEvents.LOGIN]: 'User logged in via a provider (provider type only, no username)',
    [analyticsEvents.LOGOUT]: 'User logged out',
    [analyticsEvents.CREATE_NEW_MODEL]: 'User created a new threat model (no model data recorded)',
    [analyticsEvents.OPEN_EXISTING_MODEL]: 'User opened an existing threat model (no model data recorded)',
    [analyticsEvents.SAVE_MODEL]: 'User saved a threat model (no model data recorded)',
    [analyticsEvents.IMPORT_MODEL]: 'User imported a threat model file (no file data recorded)',
    [analyticsEvents.EXPORT_MODEL]: 'User exported a threat model (no file data recorded)',
    [analyticsEvents.GENERATE_REPORT]: 'User generated a report (no report data recorded)',
    [analyticsEvents.ADD_DIAGRAM]: 'User added a new diagram to a threat model',
    [analyticsEvents.OPEN_DIAGRAM]: 'User opened a diagram for editing'
});
