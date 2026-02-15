import api from './api.js';

const resource = '/api/templates';

const encodeUrlComponents = (...uriComponents) => {
    return uriComponents.map(uriComponent => encodeURIComponent(uriComponent));
};

/**
 * Gets the list of available templates
 * @returns {Promise}
 */
const fetchAllAsync = () => {
    return api.getAsync(`${resource}`);
};



/**
 * Imports a template by splitting metadata and content
 * @param {Object} template - Entire` template with metadata and content
 * @returns {Promise}
 */
const importTemplateAsync = (template) => {
    return api.postAsync(`${resource}/import`, 
        template
    );
};

/**
 * Updates a template's metadata (name, description, tags)
 * @param {Object} templateMetadata - Template object with id, name, description, tags
 * @returns {Promise}
 */
const updateTemplateAsync = (templateMetadata) => {
    const [ encodedId ] = encodeUrlComponents(templateMetadata.id);
    return api.putAsync(`${resource}/${encodedId}`, {
        name: templateMetadata.name,
        description: templateMetadata.description,
        tags: templateMetadata.tags
    });
};

/**
 * Deletes a template by its id
 * @param {String} id - The id GUID of the template to delete
 * @returns {Promise}
 */
const deleteTemplateAsync = (id) => {
    const [ encodedId ] = encodeUrlComponents(id);
    return api.deleteAsync(`${resource}/${encodedId}`);  // No body, just URL
};

const fetchModelByIdAsync = (templateId) => {
    const [ encodedId ] = encodeUrlComponents(templateId);
    return api.getAsync(`${resource}/${encodedId}/content`);
};

/**
 * Bootstraps the template repository if not already initialized
 * @returns {Promise}
 */
const bootstrapAsync = () => {
    return api.postAsync(`${resource}/bootstrap`);
};


export default {
    fetchAllAsync,
    importTemplateAsync,
    updateTemplateAsync,
    deleteTemplateAsync,
    fetchModelByIdAsync,
    bootstrapAsync

};