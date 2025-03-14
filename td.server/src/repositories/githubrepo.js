import env from '../env/Env.js';
import fetch from 'node-fetch';

const repoRootDirectory = () => env.get().config.GITHUB_REPO_ROOT_DIRECTORY || env.get().config.REPO_ROOT_DIRECTORY;

const getBaseUrl = () => {
    const enterpriseHostname = env.get().config.GITHUB_ENTERPRISE_HOSTNAME;
    if (enterpriseHostname) {
        const port = env.get().config.GITHUB_ENTERPRISE_PORT;
        const protocol = env.get().config.GITHUB_ENTERPRISE_PROTOCOL || 'https';
        return `${protocol}://${enterpriseHostname}${port ? `:${port}` : ''}/api/v3`;
    }
    return 'https://api.github.com';
};

const fetchGitHub = async (path, accessToken, options = {}) => {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}${path}`, {
        ...options,
        headers: {
            'Authorization': `token ${accessToken}`,
            'Accept': 'application/vnd.github.v3+json',
            ...options.headers
        }
    });

    if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`);
    }

    return response.json();
};

const reposAsync = async (page, accessToken) => {
    return fetchGitHub('/user/repos', accessToken, {
        method: 'GET',
        headers: {
            'Accept': 'application/vnd.github.v3+json'
        }
    });
};

const searchAsync = async (page, accessToken, searchQuery) => {
    const data = await fetchGitHub(`/search/repositories?q=${encodeURIComponent(searchQuery)}&page=${page}`, accessToken);
    return data.items;
};

const userAsync = async (accessToken) => {
    return fetchGitHub('/user', accessToken);
};

const branchesAsync = async (repoInfo, accessToken) => {
    return fetchGitHub(`/repos/${repoInfo.organisation}/${repoInfo.repo}/branches?page=${repoInfo.page}`, accessToken);
};

const modelsAsync = async (branchInfo, accessToken) => {
    return fetchGitHub(
        `/repos/${branchInfo.organisation}/${branchInfo.repo}/contents/${repoRootDirectory()}?ref=${branchInfo.branch}`,
        accessToken
    );
};

const modelAsync = async (modelInfo, accessToken) => {
    const data = await fetchGitHub(
        `/repos/${modelInfo.organisation}/${modelInfo.repo}/contents/${getModelPath(modelInfo)}?ref=${modelInfo.branch}`,
        accessToken
    );
    return [data];
};

const createAsync = async (modelInfo, accessToken) => {
    return fetchGitHub(
        `/repos/${modelInfo.organisation}/${modelInfo.repo}/contents/${getModelPath(modelInfo)}`,
        accessToken,
        {
            method: 'PUT',
            body: JSON.stringify({
                message: 'Created by OWASP Threat Dragon',
                content: Buffer.from(getModelContent(modelInfo)).toString('base64'),
                branch: modelInfo.branch
            })
        }
    );
};

const updateAsync = async (modelInfo, accessToken) => {
    const original = await modelAsync(modelInfo, accessToken);
    return fetchGitHub(
        `/repos/${modelInfo.organisation}/${modelInfo.repo}/contents/${getModelPath(modelInfo)}`,
        accessToken,
        {
            method: 'PUT',
            body: JSON.stringify({
                message: 'Updated by OWASP Threat Dragon',
                content: Buffer.from(getModelContent(modelInfo)).toString('base64'),
                sha: original[0].sha,
                branch: modelInfo.branch
            })
        }
    );
};

const deleteAsync = async (modelInfo, accessToken) => {
    const content = await modelAsync(modelInfo, accessToken);
    return fetchGitHub(
        `/repos/${modelInfo.organisation}/${modelInfo.repo}/contents/${getModelPath(modelInfo)}`,
        accessToken,
        {
            method: 'DELETE',
            body: JSON.stringify({
                message: 'Deleted by OWASP Threat Dragon',
                sha: content[0].sha,
                branch: modelInfo.branch
            })
        }
    );
};

const getModelPath = (modelInfo) => `${repoRootDirectory()}/${modelInfo.model}/${modelInfo.model}.json`;
const getModelContent = (modelInfo) => JSON.stringify(modelInfo.body, null, '  ');

export default {
    branchesAsync,
    createAsync,
    deleteAsync,
    modelAsync,
    modelsAsync,
    reposAsync,
    searchAsync,
    updateAsync,
    userAsync
};