import api from './api.js';

const resource = '/api/threatmodel';

const extractRepoParts = (fullRepoName) => {
    const org = fullRepoName.split('/')[0];
    const repo = fullRepoName.replace(`${org}/`, '');
    return { org, repo };
};

const encodeUrlComponents = (... uriComponents) => {
    return uriComponents.map(uriComponent => encodeURIComponent(uriComponent));
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
};

/**
 * Gets the branches for the given repository
 * @param {String} fullRepoName
 * @returns {Promise}
 */
const branchesAsync = (fullRepoName, page = 1) => {
    const { org, repo } = extractRepoParts(fullRepoName);
    const [ encodedOrg, encodedRepo ] = encodeUrlComponents(org, repo);
    return api.getAsync(`${resource}/${encodedOrg}/${encodedRepo}/branches`, { params: { page: page } });
};

/**
 * Gets them models available on a given branch in a given repo
 * @param {String} fullRepoName
 * @param {String} branch
 * @returns {Promise}
 */
const modelsAsync = (fullRepoName, branch) => {
    const { org, repo } = extractRepoParts(fullRepoName);
    const [ encodedOrg, encodedRepo, encodedBranch ] = encodeUrlComponents(org, repo, branch);
    return api.getAsync(`${resource}/${encodedOrg}/${encodedRepo}/${encodedBranch}/models`);
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
    const [ encodedOrg, encodedRepo, encodedBranch, encodedModel ] = encodeUrlComponents(org, repo, branch, model);
    return api.getAsync(`${resource}/${encodedOrg}/${encodedRepo}/${encodedBranch}/${encodedModel}/data`);
};

const createAsync = (fullRepoName, branch, modelName, threatModel) => {
    const { org, repo } = extractRepoParts(fullRepoName);
    const [ encodedOrg, encodedRepo, encodedBranch, encodedModelName ] = encodeUrlComponents(org, repo, branch, modelName);
    return api.postAsync(`${resource}/${encodedOrg}/${encodedRepo}/${encodedBranch}/${encodedModelName}/create`, threatModel);
};

const updateAsync = (fullRepoName, branch, modelName, threatModel) => {
    const { org, repo } = extractRepoParts(fullRepoName);
    const [ encodedOrg, encodedRepo, encodedBranch, encodedModelName ] = encodeUrlComponents(org, repo, branch, modelName);
    return api.putAsync(`${resource}/${encodedOrg}/${encodedRepo}/${encodedBranch}/${encodedModelName}/update`, threatModel);
};

export default {
    branchesAsync,
    createAsync,
    modelAsync,
    modelsAsync,
    organisationAsync,
    reposAsync,
    updateAsync
};
