import api from './api.js';
import store from '../store/index.js';

const resource = '/api/threatmodel';

const extractRepoParts = (fullRepoName) => {
    const org = fullRepoName.split('/')[0];
    const repo = fullRepoName.replace(`${org}/`, '');
    return { org, repo };
};

const reposAsync = () => api.getAsync(`${resource}/repos`, store.state.auth.jwt);

const branchesAsync = (fullRepoName) => {
    const { org, repo } = extractRepoParts(fullRepoName);
    return api.getAsync(`${resource}/${org}/${repo}/branches`, store.state.auth.jwt);
};

const modelsAsync = (fullRepoName, branch) => {
    const { org, repo } = extractRepoParts(fullRepoName);
    return api.getAsync(`${resource}/${org}/${repo}/${branch}/models`, store.state.auth.jwt);
};

const modelAsync = (fullRepoName, branch, model) => {
    const { org, repo } = extractRepoParts(fullRepoName);
    return api.getAsync(`${resource}/${org}/${repo}/${branch}/${model}/data`, store.state.auth.jwt);
}

export default {
    branchesAsync,
    modelAsync,
    modelsAsync,
    reposAsync
};
