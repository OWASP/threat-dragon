export const TEMPLATE_FETCH_ALL = 'TEMPLATE_FETCH_ALL';
export const TEMPLATE_CLEAR = 'TEMPLATE_CLEAR';
export const TEMPLATE_CREATE = 'TEMPLATE_CREATE';
export const TEMPLATE_UPDATE = 'TEMPLATE_UPDATE';
export const TEMPLATE_DELETE = 'TEMPLATE_DELETE';
export const TEMPLATE_FETCH_MODEL_BY_ID = 'TEMPLATE_FETCH_MODEL_BY_ID';
export const TEMPLATE_SET_TEMPLATES = 'TEMPLATE_SET_TEMPLATES';// mutation ot set templates fetched from backend
export const TEMPLATE_BOOTSTRAP = 'TEMPLATE_BOOTSTRAP';
export const TEMPLATE_SET_CONTENT_REPO_STATUS = 'TEMPLATE_SET_CONTENT_REPO_STATUS';// mutation to set content repo status

export default {
    fetchAll: TEMPLATE_FETCH_ALL,
    clear: TEMPLATE_CLEAR,
    create: TEMPLATE_CREATE,
    update: TEMPLATE_UPDATE,
    delete: TEMPLATE_DELETE,
    fetchModelById: TEMPLATE_FETCH_MODEL_BY_ID,
    bootstrap: TEMPLATE_BOOTSTRAP
};