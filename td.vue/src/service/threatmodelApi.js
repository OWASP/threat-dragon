import api from './api.js';

const resource = '/api/threatmodel';

const extractRepoParts = (fullRepoName) => {
    const org = fullRepoName.split('/')[0];
    const repo = fullRepoName.replace(`${org}/`, '');
    return { org, repo };
};

/**
 * Gets the repos for the given user
 * @param {String} token The JWT
 * @returns {Promise}
 */
const reposAsync = (token) => api.getAsync(`${resource}/repos`, token);

/**
 * Gets the branches for the given repository
 * @param {String} fullRepoName
 * @param {String} token The JWT
 * @returns {Promise}
 */
const branchesAsync = (fullRepoName, token) => {
    const { org, repo } = extractRepoParts(fullRepoName);
    return api.getAsync(`${resource}/${org}/${repo}/branches`, token);
};

/**
 * Gets them models available on a given branch in a given repo
 * @param {String} fullRepoName
 * @param {String} branch
 * @param {String} token The JWT
 * @returns {Promise}
 */
const modelsAsync = (fullRepoName, branch, token) => {
    const { org, repo } = extractRepoParts(fullRepoName);
    return api.getAsync(`${resource}/${org}/${repo}/${branch}/models`, token);
};

/**
 * Gets the given model data
 * @param {String} fullRepoName
 * @param {String} branch
 * @param {String} model
 * @param {String} token
 * @returns {Promise}
 */
const modelAsync = (fullRepoName, branch, model, token) => {
    const { org, repo } = extractRepoParts(fullRepoName);
    return api.getAsync(`${resource}/${org}/${repo}/${branch}/${model}/data`, token);
};

export default {
    branchesAsync,
    modelAsync,
    modelsAsync,
    reposAsync
};
