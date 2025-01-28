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
const reposAsync = (page = 1, searchQuery = '') => {
    return api.getAsync(`${resource}/repos`, {
        params: { page: page, searchQuery: searchQuery },
    });
};

/**
 * Gets the branches for the given repository
 * @param {String} fullRepoName
 * @param {Number} page
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

/**
 * create Model
 * @param fullRepoName
 * @param branch
 * @param modelName
 * @param threatModel
 * @returns {Promise<*>}
 */
const createAsync = (fullRepoName, branch, modelName, threatModel) => {
    const { org, repo } = extractRepoParts(fullRepoName);
    const [ encodedOrg, encodedRepo, encodedBranch, encodedModelName ] = encodeUrlComponents(org, repo, branch, modelName);
    return api.postAsync(`${resource}/${encodedOrg}/${encodedRepo}/${encodedBranch}/${encodedModelName}/create`, threatModel);
};

/**
 * Updates the given model
 * @param fullRepoName
 * @param branch
 * @param modelName
 * @param threatModel
 * @returns {Promise<*>}
 */
const updateAsync = (fullRepoName, branch, modelName, threatModel) => {
    const { org, repo } = extractRepoParts(fullRepoName);
    const [ encodedOrg, encodedRepo, encodedBranch, encodedModelName ] = encodeUrlComponents(org, repo, branch, modelName);
    return api.putAsync(`${resource}/${encodedOrg}/${encodedRepo}/${encodedBranch}/${encodedModelName}/update`, threatModel);
};

/**
 * Creates a new branch on the given repository
 * @param fullRepoName
 * @param branchName
 * @param refBranch - the branch to base the new branch on
 * @returns {Promise<*>}
 */
const createBranchAsync = (fullRepoName, branchName, refBranch) => {
    const { org, repo } = extractRepoParts(fullRepoName);
    const [ encodedOrg, encodedRepo, encodedBranchName, encodedRefBranch ] = encodeUrlComponents(org, repo, branchName, refBranch);
    return api.postAsync(`${resource}/${encodedOrg}/${encodedRepo}/${encodedBranchName}/createBranch`, { refBranch: encodedRefBranch });
};

export default {
    branchesAsync,
    createAsync,
    modelAsync,
    modelsAsync,
    organisationAsync,
    reposAsync,
    updateAsync,
    createBranchAsync
};
