import api from './api.js';

const resource = '/api/threatmodel';

const extractRepoParts = (fullRepoName) => {
    const org = fullRepoName.split('/')[0];
    const repo = fullRepoName.replace(`${org}/`, '');
    return { org, repo };
};


/**
 * Gets the organisation data configured for the express server
 * @returns {Promise}
 */
const organisationAsync = () => api.getAsync(`${resource}/organisation`);

/**
 * Gets the repos for the given user
 * @returns {Promise}
 */
const reposAsync = (page = 1) => {
    return api.getAsync(`${resource}/repos`, { params: { page: page } });
}

/**
 * Gets the branches for the given repository
 * @param {String} fullRepoName
 * @returns {Promise}
 */
const branchesAsync = (fullRepoName, page = 1) => {
    const { org, repo } = extractRepoParts(fullRepoName);
    return api.getAsync(`${resource}/${org}/${repo}/branches`, { params: { page: page } });
};

/**
 * Gets them models available on a given branch in a given repo
 * @param {String} fullRepoName
 * @param {String} branch
 * @returns {Promise}
 */
const modelsAsync = (fullRepoName, branch) => {
    const { org, repo } = extractRepoParts(fullRepoName);
    return api.getAsync(`${resource}/${org}/${repo}/${encodeURIComponent(branch)}/models`);
};

/**
 * Gets the given model data
 * @param {String} fullRepoName
 * @param {String} branch
 * @param {String} model
 * @returns {Promise}
 */
const modelAsync = (fullRepoName, branch, model) => {
    const { org, repo } = extractRepoParts(fullRepoName);
    return api.getAsync(`${resource}/${org}/${repo}/${branch}/${model}/data`);
};

const createAsync = (fullRepoName, branch, modelName, threatModel) => {
    const { org, repo } = extractRepoParts(fullRepoName);
    return api.postAsync(`${resource}/${org}/${repo}/${branch}/${modelName}/create`, threatModel);
};

const updateAsync = (fullRepoName, branch, modelName, threatModel) => {
    const { org, repo } = extractRepoParts(fullRepoName);
    return api.putAsync(`${resource}/${org}/${repo}/${branch}/${modelName}/update`, threatModel);
};

export default {
    branchesAsync,
    modelAsync,
    modelsAsync,
    organisationAsync,
    reposAsync,
    createAsync,
    updateAsync
};
