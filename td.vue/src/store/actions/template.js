export const templateFetchAll = 'TEMPLATE_FETCH_ALL';
export const templateClear = 'TEMPLATE_CLEAR';
export const templateCreate = 'TEMPLATE_CREATE';
export const templateUpdate = 'TEMPLATE_UPDATE';
export const templateDelete = 'TEMPLATE_DELETE';
export const templateFetchModelById = 'TEMPLATE_FETCH_MODEL_BY_ID';
export const templateSetTemplates = 'TEMPLATE_SET_TEMPLATES';// mutation ot set templates fetched from backend
export const templateBootstrap = 'TEMPLATE_BOOTSTRAP';
export const templateSetContentRepoStatus = 'TEMPLATE_SET_CONTENT_REPO_STATUS';// mutation to set content repo status
export const templateDownload = 'THREATMODEL_TEMPLATE_DOWNLOAD';
export const templateLoad = 'TEMPLATE_LOAD';

export default {
    fetchAll: templateFetchAll,
    clear: templateClear,
    create: templateCreate,
    update: templateUpdate,
    delete: templateDelete,
    fetchModelById: templateFetchModelById,
    bootstrap: templateBootstrap,
    templateDownload: templateDownload,
    templateLoad: templateLoad
};