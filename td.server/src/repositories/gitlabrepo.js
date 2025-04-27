import env from '../env/Env.js';
import { Gitlab } from '@gitbeaker/rest';
import loggerHelper from '../helpers/logger.helper.js';

const logger = loggerHelper.get('repositories/gitlabrepo.js');

const repoRootDirectory = () =>
    env.get().config.GITLAB_REPO_ROOT_DIRECTORY || env.get().config.REPO_ROOT_DIRECTORY;

export class GitlabClientWrapper {
    static getClient(clientOptions) {
        return new Gitlab(clientOptions);
    }
}

export const getClient = (accessToken) => {
    const clientOptions = {
        auth: {
            oauthToken: accessToken
        }
    };
    if (env.get().config.GITLAB_HOST) {
        clientOptions.auth.host = env.get().config.GITLAB_HOST;
    }

    return GitlabClientWrapper.getClient(clientOptions.auth);
};

export const reposAsync = (page, accessToken, searchQuerys = []) =>
    searchAsync(page, accessToken, searchQuerys);

export const getPagination = (paginationInfo, page) => {
    const pagination = { page, next: false, prev: false };
    if (Number.isInteger(paginationInfo.next)) {
        pagination.next = true;
    }
    if (Number.isInteger(paginationInfo.previous)) {
        pagination.prev = true;
    }
    return pagination;
};

export const searchAsync = async (page, accessToken, searchQuerys = []) => {
    logger.debug(`GitLab searchAsync called with page: ${page}`);
    logger.debug(`GitLab searchAsync called with searchQueries:`, searchQuerys);

    const repos = await getClient(accessToken).Projects.all({
        page: page,
        membership: true,
        showExpanded: true,
        search: searchQuerys.join('&')
    });
    repos.data.map((repo) => {
        repo.full_name = repo.path_with_namespace;
        return repo;
    });

    // Add audit logging for successful repository search
    logger.audit(
        `Data access: GitLab repository search performed, page ${page}, found ${repos.data.length} repositories`
    );

    return [repos.data, null, getPagination(repos.paginationInfo)];
};

export const userAsync = (accessToken) => getClient(accessToken).Users.showCurrentUser();

export const branchesAsync = async (repoInfo, accessToken) => {
    logger.debug(
        `GitLab branchesAsync called with repo: ${getRepoFullName(repoInfo)}, page: ${
            repoInfo.page
        }`
    );

    const client = getClient(accessToken);
    const branchResponse = await client.Branches.all(getRepoFullName(repoInfo), {
        page: repoInfo.page,
        showExpanded: true
    });
    const branchesResp = [];
    branchesResp[0] = branchResponse.data;
    branchesResp[1] = null;
    branchesResp[2] = getPagination(branchResponse.paginationInfo, repoInfo.page);

    // Add audit logging for successful branch retrieval
    logger.audit(
        `Data access: Retrieved ${branchResponse.data.length} branches from ${getRepoFullName(
            repoInfo
        )}`
    );

    return branchesResp;
};

export const modelsAsync = async (branchInfo, accessToken) => {
    try {
        logger.info(
            `Fetching models from GitLab for ${getRepoFullName(
                branchInfo
            )}/${repoRootDirectory()} on branch ${branchInfo.branch}`
        );

        const models = await getClient(accessToken).Repositories.allRepositoryTrees(
            getRepoFullName(branchInfo),
            { path: repoRootDirectory(), ref: branchInfo.branch }
        );

        if (models && Array.isArray(models)) {
            logger.debug(`GitLab modelsAsync found ${models.length} items`);

            // Add audit logging for successful model retrieval
            logger.audit(
                `Data access: Retrieved ${models.length} threat models from ${getRepoFullName(
                    branchInfo
                )}/${branchInfo.branch}`
            );

            return [models];
        } else {
            logger.warn(`GitLab modelsAsync response is not an array, returning empty array`);
            return [[]];
        }
    } catch (error) {
        logger.error(`Error in GitLab modelsAsync: ${error.message}`);
        if (
            error.message &&
            (error.message.includes('Not Found') || error.message.includes('404'))
        ) {
            logger.warn(`Directory ${repoRootDirectory()} not found, returning empty array`);
        } else {
            logger.error(`Error stack: ${error.stack || 'No stack trace available'}`);
        }
        // Return empty array on error
        return [[]];
    }
};

export const modelAsync = async (modelInfo, accessToken) => {
    try {
        logger.info(
            `Fetching model from GitLab: ${getRepoFullName(modelInfo)}/${getModelPath(
                modelInfo
            )} on branch ${modelInfo.branch}`
        );

        const model = await getClient(accessToken).RepositoryFiles.show(
            getRepoFullName(modelInfo),
            getModelPath(modelInfo),
            modelInfo.branch
        );

        // Add audit logging for successful model retrieval
        logger.audit(
            `Data access: Retrieved threat model ${modelInfo.model} from ${getRepoFullName(
                modelInfo
            )}/${modelInfo.branch}`
        );

        return [model];
    } catch (error) {
        logger.error(`Error in GitLab modelAsync: ${error.message}`);
        if (
            error.message &&
            (error.message.includes('Not Found') || error.message.includes('404'))
        ) {
            logger.warn(`Model file ${getModelPath(modelInfo)} not found, returning empty object`);
            return [{}];
        }
        throw error;
    }
};

export const createAsync = async (modelInfo, accessToken) => {
    logger.info(`Creating model: ${modelInfo.model} in ${getRepoFullName(modelInfo)}`);

    const client = getClient(accessToken);
    const result = await client.RepositoryFiles.create(
        getRepoFullName(modelInfo),
        getModelPath(modelInfo),
        modelInfo.branch,
        getModelContent(modelInfo),
        'Created by OWASP Threat Dragon'
    );

    // Add audit logging for successful model creation
    logger.audit(
        `Data modification: Created threat model ${modelInfo.model} in ${getRepoFullName(
            modelInfo
        )}/${modelInfo.branch}`
    );

    return result;
};

export const updateAsync = async (modelInfo, accessToken) => {
    logger.info(`Updating model: ${modelInfo.model} in ${getRepoFullName(modelInfo)}`);

    const repo = getRepoFullName(modelInfo);
    const path = getModelPath(modelInfo);
    const modelContent = getModelContent(modelInfo);

    const result = await getClient(accessToken).RepositoryFiles.edit(
        repo,
        path,
        modelInfo.branch,
        modelContent,
        'Updated by OWASP Threat Dragon'
    );

    // Add audit logging for successful model update
    logger.audit(
        `Data modification: Updated threat model ${modelInfo.model} in ${getRepoFullName(
            modelInfo
        )}/${modelInfo.branch}`
    );

    return result;
};

export const deleteAsync = async (modelInfo, accessToken) => {
    logger.info(`Deleting model: ${modelInfo.model} from ${getRepoFullName(modelInfo)}`);

    const result = await getClient(accessToken).RepositoryFiles.remove(
        getRepoFullName(modelInfo),
        getModelPath(modelInfo),
        modelInfo.branch,
        'Deleted by OWASP Threat Dragon'
    );

    // Add audit logging for successful model deletion
    logger.audit(
        `Data modification: Deleted threat model ${modelInfo.model} from ${getRepoFullName(
            modelInfo
        )}/${modelInfo.branch}`
    );

    return result;
};

export const createBranchAsync = async (repoInfo, accessToken) => {
    logger.info(
        `Creating branch: ${repoInfo.branch} from ${repoInfo.ref} in ${getRepoFullName(repoInfo)}`
    );

    const client = getClient(accessToken);
    const repo = getRepoFullName(repoInfo);
    const result = await client.Branches.create(repo, repoInfo.branch, repoInfo.ref);

    // Add audit logging for successful branch creation
    logger.audit(
        `Data modification: Created new branch ${repoInfo.branch} from ${
            repoInfo.ref
        } in ${getRepoFullName(repoInfo)}`
    );

    return result;
};

const getRepoFullName = (info) => `${info.organisation}/${info.repo}`;
const getModelPath = (modelInfo) =>
    `${repoRootDirectory()}/${modelInfo.model}/${modelInfo.model}.json`;
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
    userAsync
};
