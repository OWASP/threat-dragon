import env from '../env/Env.js';
import {Gitlab} from "@gitbeaker/rest";


const repoRootDirectory = () => env.get().config.GITLAB_REPO_ROOT_DIRECTORY || env.get().config.REPO_ROOT_DIRECTORY;

export class GitlabClientWrapper {
    static getClient(clientOptions) {
        return new Gitlab(clientOptions);
    }
}

export const getClient = (accessToken) => {
    const clientOptions = {
        auth: {
            oauthToken: accessToken,
        },
    };
    if (env.get().config.GITLAB_HOST) {
        clientOptions.auth.host=env.get().config.GITLAB_HOST;
    }

    return GitlabClientWrapper.getClient(clientOptions.auth);
};

export const reposAsync = (page, accessToken, searchQuerys = []) => searchAsync(page, accessToken, searchQuerys);

export const getPagination = (paginationInfo, page) => {
    const pagination = {page, next: false, prev: false};
    if (Number.isInteger(paginationInfo.next)) {
        pagination.next = true;
    }
    if (Number.isInteger(paginationInfo.previous)) {
        pagination.prev = true;
    }
    return pagination;
};

export const searchAsync = async (page, accessToken, searchQuerys = []) => {
    const repos = await getClient(accessToken).Projects.all({page: page, membership: true, showExpanded: true, search: searchQuerys.join('&')});
    repos.data.map((repo) => {
        repo.full_name = repo.path_with_namespace;
        return repo;
    });
    return [repos.data, null, getPagination(repos.paginationInfo)];
};

export const userAsync = (accessToken) => getClient(accessToken).Users.showCurrentUser();

export const branchesAsync = async (repoInfo, accessToken) => {
    const client = getClient(accessToken);
    const branchResponse = await client.Branches.all(getRepoFullName(repoInfo), {
        page: repoInfo.page,
        showExpanded: true
    });
    const branchesResp = [];
    branchesResp[0] = branchResponse.data;
    branchesResp[1] = null;
    branchesResp[2] = getPagination(branchResponse.paginationInfo, repoInfo.page);

    return branchesResp;
};

export const modelsAsync = async (branchInfo, accessToken) => {
    const models = await getClient(accessToken).Repositories.allRepositoryTrees(getRepoFullName(branchInfo), {path: repoRootDirectory(), ref:branchInfo.branch });
    return [models];
};

export const modelAsync = async (modelInfo, accessToken) => {
    const model = await getClient(accessToken).RepositoryFiles.show(getRepoFullName(modelInfo), getModelPath(modelInfo), modelInfo.branch);
    return [model];
};

export const createAsync = (modelInfo, accessToken) => {
    const client = getClient(accessToken);
    return client.RepositoryFiles.create(getRepoFullName(modelInfo),
        getModelPath(modelInfo),
        modelInfo.branch,
        getModelContent(modelInfo),
        'Created by OWASP Threat Dragon',
    );
};

export const updateAsync = (modelInfo, accessToken) => {
    const repo = getRepoFullName(modelInfo);
    const path = getModelPath(modelInfo);
    const modelContent = getModelContent(modelInfo);

    return getClient(accessToken).RepositoryFiles.edit(repo,
        path,
        modelInfo.branch,
        modelContent,
        'Updated by OWASP Threat Dragon',
    );
};

export const deleteAsync = (modelInfo, accessToken) => getClient(accessToken).RepositoryFiles.remove(getRepoFullName(modelInfo),
        getModelPath(modelInfo),
        modelInfo.branch,
        'Deleted by OWASP Threat Dragon',
    );

export const createBranchAsync = (repoInfo, accessToken) => {
    const client = getClient(accessToken);
    const repo = getRepoFullName(repoInfo);
    return client.Branches.create(repo, repoInfo.branch, repoInfo.ref);
};

const getRepoFullName = (info) => `${info.organisation}/${info.repo}`;
const getModelPath = (modelInfo) => `${repoRootDirectory()}/${modelInfo.model}/${modelInfo.model}.json`;
const getModelContent = (modelInfo) => JSON.stringify(modelInfo.body, null, '  ');

export default {
    createBranchAsync,
    branchesAsync,
    createAsync,
    deleteAsync,
    modelAsync,
    modelsAsync,
    reposAsync,
    searchAsync,
    updateAsync,
    userAsync,
};
