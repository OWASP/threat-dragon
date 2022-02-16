import github from 'octonode';

const reposAsync = (page, accessToken) => github.client(accessToken).me().
reposAsync(page);

const userAsync = async (accessToken) => {
    const resp = await github.client(accessToken).me().
infoAsync();
    return resp[0];
};

const branchesAsync = (repoInfo, accessToken) => {
    const client = github.client(accessToken);
    return client.repo(getRepoFullName(repoInfo)).branchesAsync(repoInfo.page);
};

const modelsAsync = (branchInfo, accessToken) => github.client(accessToken).
        repo(getRepoFullName(branchInfo)).
        contentsAsync('ThreatDragonModels', branchInfo.branch);

const modelAsync = (modelInfo, accessToken) => github.client(accessToken).
        repo(getRepoFullName(modelInfo)).
        contentsAsync(getModelPath(modelInfo), modelInfo.branch);

const createAsync = (modelInfo, accessToken) => github.client(accessToken).
        repo(getRepoFullName(modelInfo)).
        createContentsAsync(
            getModelPath(modelInfo),
            'Created by OWASP Threat Dragon',
            getModelContent(modelInfo),
            modelInfo.branch
        );

const updateAsync = async (modelInfo, accessToken) => {
    const original = await modelAsync(modelInfo, accessToken);
    const repo = getRepoFullName(modelInfo);
    const path = getModelPath(modelInfo);
    const modelContent = getModelContent(modelInfo);

    return github.client(accessToken).
        repo(repo).
        updateContentsAsync(
            path,
            'Updated by OWASP Threat Dragon',
            modelContent,
            original[0].sha,
            modelInfo.branch
        );
};

const deleteAsync = async (modelInfo, accessToken) => {
    const content = await modelAsync(modelInfo, accessToken);
    return github.client(accessToken).
        repo(getRepoFullName(modelInfo)).
        deleteContentsAsync(
            getModelPath(modelInfo),
            'Deleted by OWASP Threat Dragon',
            content[0].sha,
            modelInfo.branch
        );
};

const getRepoFullName = (info) => `${info.organisation}/${info.repo}`;
const getModelPath = (modelInfo) => `ThreatDragonModels/${modelInfo.model}/${modelInfo.model}.json`;
const getModelContent = (modelInfo) => JSON.stringify(modelInfo.body, null, '  ');

export default {
    branchesAsync,
    createAsync,
    deleteAsync,
    modelAsync,
    modelsAsync,
    reposAsync,
    updateAsync,
    userAsync
};
