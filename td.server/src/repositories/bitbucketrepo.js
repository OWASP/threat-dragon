import pkg from 'bitbucket';
const { Bitbucket } = pkg;
import env from '../env/Env.js';
import loggerHelper from '../helpers/logger.helper.js';

const logger = loggerHelper.get('repositories/bitbucketrepo.js');

const repoRootDirectory = () => {
    const config = env.get().config;
    return config.BITBUCKET_REPO_ROOT_DIRECTORY || config.REPO_ROOT_DIRECTORY || '';
};

export class BitbucketClientWrapper {
    static getClient(clientOptions) {
        return new Bitbucket(clientOptions);
    }
}

export const getClient = (accessToken) => {
    const enterpriseHostname = env.get().config.BITBUCKET_ENTERPRISE_HOSTNAME;
    if (enterpriseHostname) {
        throw new Error(`Bitbucket Enterprise is not supported yet`);
    }
    const clientOptions = {
        auth: {
            token: accessToken
        }
    };
    return BitbucketClientWrapper.getClient(clientOptions);
};

export const reposAsync = async (page, accessToken, searchQuerys = []) => {
    logger.debug(`Bitbucket reposAsync called with page: ${page}`);
    logger.debug(`Bitbucket reposAsync called with searchQueries:`, searchQuerys);

    const workspace = env.get().config.BITBUCKET_WORKSPACE;
    const repos = await getClient(accessToken).repositories.list({
        workspace: workspace,
        page: page,
        pagelen: 10,
        q: searchQuerys.join(' AND ')
    });

    const responseRepos = repos.data.values.map((x) => {
        const newX = {};
        newX.full_name = x.full_name.toLowerCase().replace(workspace.toLowerCase() + '/', '');
        return newX;
    });

    // Add audit logging for successful repository retrieval
    logger.audit(
        `Data access: Retrieved ${responseRepos.length} repositories from Bitbucket workspace ${workspace}, page ${page}`
    );

    return [responseRepos, null, { prev: hasPreviousPage(repos), next: hasNextPage(repos) }];
};

const hasNextPage = (response) => response.data.next !== undefined && response.data.next !== null;

const hasPreviousPage = (response) =>
    response.data.previous !== undefined && response.data.previous !== null;

// Note: searchAsync was previously defined but not implemented properly
// The Bitbucket API's search functionality is handled via the reposAsync function with search queries
export const searchAsync = (page, accessToken, searchQueries) =>
    reposAsync(page, accessToken, searchQueries);

export const userAsync = async (accessToken) => {
    logger.debug('Fetching authenticated user information from Bitbucket');

    try {
        // Get the basic user information
        const client = getClient(accessToken);
        const userResponse = await client.users.getAuthedUser();

        // Extract the user data
        const userData = userResponse.data;

        // Add the nickname/account_id as the actual username
        // The nickname is typically closer to what we consider a username
        // If nickname is not available, we'll use account_id or uuid as fallback
        userData.actual_username =
            userData.nickname || userData.account_id || userData.uuid || userData.display_name;

        // Use a simple string format for logging to avoid colorize issues
        logger.debug(
            `Retrieved Bitbucket user info: display_name=${userData.display_name}, actual_username=${userData.actual_username}`
        );

        return userData;
    } catch (error) {
        // Simplify error logging to avoid colorize issues
        let errorMessage = 'Error fetching Bitbucket user info: ';

        if (typeof error === 'string') {
            errorMessage += error;
        } else if (error && error.message) {
            errorMessage += error.message;
        } else {
            errorMessage += 'Unknown error';
        }

        logger.error(errorMessage);

        // Log stack trace as a separate, simple string
        if (error && error.stack) {
            logger.error(`Error stack: ${error.stack}`);
        }

        throw error;
    }
};

export const branchesAsync = async (repoInfo, accessToken) => {
    logger.debug(
        `Bitbucket branchesAsync called with repo: ${repoInfo.repo}, page: ${repoInfo.page}`
    );

    const workspace = env.get().config.BITBUCKET_WORKSPACE;
    const client = getClient(accessToken);
    const branches = await client.repositories.listBranches({
        workspace: workspace,
        repo_slug: repoInfo.repo,
        page: repoInfo.page,
        pagelen: 10
    });
    const branchesResponse = branches.data.values;

    // Add audit logging for successful branch retrieval
    logger.audit(
        `Data access: Retrieved ${branchesResponse.length} branches from ${repoInfo.repo}`
    );

    return [
        branchesResponse,
        null,
        { prev: hasPreviousPage(branches), next: hasNextPage(branches) }
    ];
};

export const modelsAsync = async (branchInfo, accessToken) => {
    logger.info(`Fetching models from Bitbucket for ${branchInfo.repo}/${branchInfo.branch}`);

    const workspace = env.get().config.BITBUCKET_WORKSPACE;

    try {
        const client = getClient(accessToken);

        const { data } = await client.repositories.getBranch({
            workspace: workspace,
            repo_slug: branchInfo.repo,
            name: branchInfo.branch
        });
        const commitId = data.target.hash;

        try {
            const tree = await client.source.read({
                path: repoRootDirectory(),
                workspace: workspace,
                repo_slug: branchInfo.repo,
                commit: commitId
            });

            // If we have values, process them
            if (tree.data && tree.data.values && Array.isArray(tree.data.values)) {
                tree.data.values.map((x) => {
                    x.name = x.path.replace(`${repoRootDirectory()}/`, '');
                    return x;
                });

                // Add audit logging for successful model retrieval
                logger.audit(
                    `Data access: Retrieved ${tree.data.values.length} threat models from ${branchInfo.repo}/${branchInfo.branch}`
                );

                return [tree.data.values];
            } else {
                // No values found, return empty array
                logger.info(
                    `No threat models found in ${repoRootDirectory()} for ${branchInfo.repo}/${
                        branchInfo.branch
                    }`
                );
                return [[]];
            }
        } catch (error) {
            // Handle "file not found" or other errors when reading the directory
            logger.info(`Error reading ${repoRootDirectory()} directory: ${error.message}`);
            if (
                error.message &&
                (error.message.includes('Not Found') || error.message.includes('404'))
            ) {
                // Directory doesn't exist, return empty array
                logger.info(`Directory ${repoRootDirectory()} not found, returning empty array`);
                return [[]];
            }
            throw error;
        }
    } catch (error) {
        logger.error(`Error in modelsAsync: ${error.message}`);
        if (error.stack) {
            logger.error(`Error stack: ${error.stack}`);
        }
        // Return empty array instead of throwing
        return [[]];
    }
};

export const modelAsync = async (modelInfo, accessToken) => {
    logger.info(
        `Fetching model from Bitbucket: ${modelInfo.model} from ${modelInfo.repo}/${modelInfo.branch}`
    );

    const workspace = env.get().config.BITBUCKET_WORKSPACE;

    try {
        const client = getClient(accessToken);
        const { data } = await client.repositories.getBranch({
            workspace: workspace,
            repo_slug: modelInfo.repo,
            name: modelInfo.branch
        });
        const commitId = data.target.hash;

        try {
            const tree = await client.source.read({
                path: getModelPath(modelInfo),
                workspace: workspace,
                repo_slug: modelInfo.repo,
                commit: commitId
            });
            tree.content = Buffer.from(tree.data).toString('base64');

            // Add audit logging for successful model retrieval
            logger.audit(
                `Data access: Retrieved threat model ${modelInfo.model} from ${modelInfo.repo}/${modelInfo.branch}`
            );

            return [tree];
        } catch (error) {
            logger.error(`Error reading model file: ${error.message}`);
            if (error.stack) {
                logger.error(`Error stack: ${error.stack}`);
            }

            if (
                error.message &&
                (error.message.includes('Not Found') || error.message.includes('404'))
            ) {
                logger.warn(
                    `Model file ${getModelPath(modelInfo)} not found, returning empty object`
                );
                return [{ data: {}, content: '' }];
            }
            throw error;
        }
    } catch (error) {
        logger.error(`Error in modelAsync: ${error.message}`);
        if (error.stack) {
            logger.error(`Error stack: ${error.stack}`);
        }
        // Return empty object instead of throwing, similar to how we handle model file not found
        return [{ data: {}, content: '' }];
    }
};

export const createAsync = async (modelInfo, accessToken) => {
    logger.info(`Creating model: ${modelInfo.model} in ${modelInfo.repo}/${modelInfo.branch}`);

    const workspace = env.get().config.BITBUCKET_WORKSPACE;

    const client = getClient(accessToken);

    let created = await client.source.createFileCommit({
        [getModelPath(modelInfo)]: getModelContent(modelInfo),
        repo_slug: getRepoFullName(modelInfo),
        files: getModelPath(modelInfo),
        branch: modelInfo.branch,
        workspace: workspace,
        message: 'Created by OWASP Threat Dragon'
    });

    created = created.data.values;

    // Add audit logging for successful model creation
    logger.audit(
        `Data modification: Created threat model ${modelInfo.model} in ${modelInfo.repo}/${modelInfo.branch}`
    );

    return [created];
};

export const updateAsync = async (modelInfo, accessToken) => {
    logger.info(`Updating model: ${modelInfo.model} in ${modelInfo.repo}/${modelInfo.branch}`);

    const workspace = env.get().config.BITBUCKET_WORKSPACE;

    const client = getClient(accessToken);

    let created = await client.source.createFileCommit({
        [getModelPath(modelInfo)]: getModelContent(modelInfo),
        repo_slug: getRepoFullName(modelInfo),
        files: getModelPath(modelInfo),
        branch: modelInfo.branch,
        workspace: workspace,
        message: 'Updated by OWASP Threat Dragon'
    });

    created = created.data.values;

    // Add audit logging for successful model update
    logger.audit(
        `Data modification: Updated threat model ${modelInfo.model} in ${modelInfo.repo}/${modelInfo.branch}`
    );

    return [created];
};

// Not implemented as not used
/* eslint-disable-next-line no-unused-vars, require-await */
export const deleteAsync = async (modelInfo, accessToken) => {
    throw new Error(`Bitbucket deleteAsync is not implemented yet`);
};

export const createBranchAsync = async (repoInfo, accessToken) => {
    logger.info(`Creating branch: ${repoInfo.branch} from ${repoInfo.ref} in ${repoInfo.repo}`);

    const workspace = env.get().config.BITBUCKET_WORKSPACE;

    const client = getClient(accessToken);
    const repo = getRepoFullName(repoInfo);

    const result = await client.refs.createBranch({
        _body: {
            name: repoInfo.branch,
            target: {
                hash: repoInfo.ref
            }
        },
        repo_slug: repo,
        workspace: workspace
    });

    // Add audit logging for successful branch creation
    logger.audit(
        `Data modification: Created new branch ${repoInfo.branch} from ${repoInfo.ref} in ${repoInfo.repo}`
    );

    return result;
};

const getRepoFullName = (info) => (info && info.repo ? `${info.repo}` : '');

const getModelPath = (modelInfo) => {
    if (!modelInfo || !modelInfo.model) {
        logger.error('Invalid model info provided to getModelPath', modelInfo);
        throw new Error('Invalid model info: model name is required');
    }

    const rootDir = repoRootDirectory();
    // If root directory is empty, don't add a leading slash
    if (rootDir === '') {
        return `${modelInfo.model}/${modelInfo.model}.json`;
    }
    return `${rootDir}/${modelInfo.model}/${modelInfo.model}.json`;
};

const getModelContent = (modelInfo) => {
    if (!modelInfo || !modelInfo.body) {
        logger.error('Invalid model info provided to getModelContent', modelInfo);
        throw new Error('Invalid model info: body is required');
    }
    return JSON.stringify(modelInfo.body, null, '  ');
};

export default {
    branchesAsync,
    createAsync,
    deleteAsync,
    modelAsync,
    modelsAsync,
    reposAsync,
    searchAsync,
    updateAsync,
    userAsync,
    getClient,
    createBranchAsync
};
