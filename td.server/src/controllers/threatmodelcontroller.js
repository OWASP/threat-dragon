import env from '../env/Env.js';
import loggerHelper from '../helpers/logger.helper.js';
import repositories from '../repositories/index.js';
import responseWrapper from './responseWrapper.js';
import { serverError } from './errors.js';

const logger = loggerHelper.get('controllers/threatmodelcontroller.js');

const repos = (req, res) =>
    responseWrapper.sendResponseAsync(
        async () => {
            try {
                logger.debug(`Provider from request: ${req.provider?.name || 'unknown'}`);
                logger.debug(`Access token available: ${Boolean(req.provider?.access_token)}`);

                // Set repository based on provider name
                if (req.provider && req.provider.name) {
                    logger.debug(`Setting repository to ${req.provider.name}repo`);
                    repositories.set(`${req.provider.name}repo`);
                }

                const repository = repositories.get();
                logger.debug(`Using repository: ${repository.name || 'unknown'}`);

                const page = req.query.page || 1;
                const searchQuerys = req.query.searchQuery || [];
                let reposResp;
                let repos;
                // backwardly compatible with previous use of env vars GITHUB_USE_SEARCH and GITHUB_SEARCH_QUERY
                if (
                    env.get().config.REPO_USE_SEARCH === 'true' ||
                    env.get().config.GITHUB_USE_SEARCH === 'true'
                ) {
                    logger.debug('Using searchAsync');
                    const searchQuery =
                        env.get().config.REPO_SEARCH_QUERY ?? env.get().config.GITHUB_SEARCH_QUERY;
                    logger.debug('Using searchAsync');
                    logger.debug(`Search query: ${searchQuery}`);
                    logger.debug(`Additional search queries: ${JSON.stringify(searchQuerys)}`);

                    reposResp = await repository.searchAsync(page, req.provider.access_token, [
                        searchQuery,
                        ...searchQuerys
                    ]);

                    // Handle different response formats
                    if (reposResp[0] && reposResp[0].items) {
                        logger.debug(`Search returned ${reposResp[0].items.length} items`);
                        repos = reposResp[0].items;
                    } else {
                        logger.debug(
                            `Search returned direct array with ${reposResp[0].length} items`
                        );
                        repos = reposResp[0];
                    }
                } else {
                    logger.debug('Using reposAsync');
                    logger.debug(`Search queries: ${JSON.stringify(searchQuerys)}`);

                    reposResp = await repository.reposAsync(
                        page,
                        req.provider.access_token,
                        searchQuerys
                    );

                    // Ensure repos is an array
                    if (Array.isArray(reposResp[0])) {
                        logger.debug(`Repos returned ${reposResp[0].length} items`);
                        repos = reposResp[0];
                    } else {
                        logger.error(`Unexpected repos response format: ${typeof reposResp[0]}`);
                        logger.debug(`Response: ${JSON.stringify(reposResp[0])}`);
                        repos = [];
                    }
                }
                const headers = reposResp[1];
                const pageLinks = reposResp[2];
                logger.debug(`API repos request: ${logger.transformToString(req)}`);

                const pagination = getPagination(headers, pageLinks, page);

                // Safely map repos to full_name, handling potential issues
                let repoNames = [];
                if (Array.isArray(repos)) {
                    logger.debug(`Mapping ${repos.length} repos to their full names`);
                    repoNames = repos
                        .filter((x) => x && typeof x === 'object')
                        .map((x) => {
                            if (x.full_name) {
                                return x.full_name;
                            } else if (x.name && x.owner && x.owner.login) {
                                return `${x.owner.login}/${x.name}`;
                            } else {
                                logger.warn(`Repo missing full_name: ${JSON.stringify(x)}`);
                                return null;
                            }
                        })
                        .filter(Boolean); // Remove null values
                } else {
                    logger.error(`Repos is not an array: ${typeof repos}`);
                }

                logger.debug(`Returning ${repoNames.length} repositories`);

                return {
                    repos: repoNames,
                    pagination: pagination
                };
            } catch (error) {
                logger.error(`Error in repos controller: ${error.message}`);
                logger.error(`Error stack: ${error.stack}`);

                if (error.response) {
                    logger.error(`Response status: ${error.response.status}`);
                    logger.error(`Response data: ${JSON.stringify(error.response.data || {})}`);
                }

                throw error;
            }
        },
        req,
        res,
        logger
    );

const branches = (req, res) =>
    responseWrapper.sendResponseAsync(
        async () => {
            const repository = repositories.get();

            // Extract page parameter, handling both direct and nested formats
            let page = req.query.page;
            if (!page && req.query.params && req.query.params.page) {
                page = req.query.params.page;
                logger.debug(`Found page parameter in nested params object: ${page}`);
            }

            const repoInfo = {
                organisation: req.params.organisation,
                repo: req.params.repo,
                page: page || 1
            };

            logger.debug(`Branch request info: ${JSON.stringify(repoInfo)}`);
            logger.debug(`API branches request: ${logger.transformToString(req)}`);

            try {
                const branchesResp = await repository.branchesAsync(
                    repoInfo,
                    req.provider.access_token
                );

                // Log the response for debugging
                logger.debug(`Branch response received: ${JSON.stringify(branchesResp)}`);

                const branches = branchesResp[0];
                const headers = branchesResp[1];
                const pageLinks = branchesResp[2];

                // Check if branches is an array
                if (!Array.isArray(branches)) {
                    logger.error(`Branches is not an array: ${typeof branches}`);
                    logger.debug(`Branches response: ${JSON.stringify(branches)}`);

                    // If branches is not an array, return an empty array
                    return {
                        branches: [],
                        pagination: { page: repoInfo.page, next: false, prev: false }
                    };
                }

                const branchNames = branches.map((x) => ({
                    name: x.name,
                    // Protected branches are not so easy to determine from the API on Bitbucket
                    protected: x.protected || false
                }));

                const pagination = getPagination(headers, pageLinks, repoInfo.page);

                return {
                    branches: branchNames,
                    pagination: pagination
                };
            } catch (error) {
                logger.error(`Error fetching branches: ${error.message}`);
                logger.error(`Error stack: ${error.stack}`);

                if (error.response) {
                    logger.error(`Response status: ${error.response.status}`);
                    logger.error(`Response data: ${JSON.stringify(error.response.data || {})}`);
                }

                // Return empty branches array on error
                return {
                    branches: [],
                    pagination: { page: repoInfo.page, next: false, prev: false }
                };
            }
        },
        req,
        res,
        logger
    );

const models = (req, res) =>
    responseWrapper.sendResponseAsync(
        async () => {
            const repository = repositories.get();

            const branchInfo = {
                organisation: req.params.organisation,
                repo: req.params.repo,
                branch: req.params.branch
            };

            logger.debug(`Models request info: ${JSON.stringify(branchInfo)}`);
            logger.debug(`API models request: ${logger.transformToString(req)}`);

            let modelsResp;
            try {
                modelsResp = await repository.modelsAsync(branchInfo, req.provider.access_token);

                // Log the response for debugging
                logger.debug(`Models response received: ${JSON.stringify(modelsResp)}`);

                // Check if modelsResp[0] is an array
                if (!modelsResp || !modelsResp[0]) {
                    logger.error('Models response is empty or undefined');
                    return [];
                }

                if (!Array.isArray(modelsResp[0])) {
                    logger.error(`Models response is not an array: ${typeof modelsResp[0]}`);
                    logger.debug(`Models response: ${JSON.stringify(modelsResp[0])}`);
                    return [];
                }

                // Ensure we return proper string values for model names
                return modelsResp[0].map((x) => {
                    // If x.name is already a string, return it directly
                    if (typeof x.name === 'string') {
                        return x.name;
                    }

                    // If x.name is an object that looks like a character-by-character object representation of a string
                    // (which happens in some serialization scenarios), convert it back to a proper string
                    if (x.name && typeof x.name === 'object') {
                        try {
                            // Check if it's a character-by-character object (has numeric keys)
                            const keys = Object.keys(x.name);
                            if (keys.length > 0 && !isNaN(parseInt(keys[0]))) {
                                return Object.values(x.name).join('');
                            }
                        } catch (err) {
                            logger.error(`Error processing model name: ${err.message}`);
                        }
                    }

                    // Fallback: stringify the name if it's not a string
                    return String(x.name || '');
                });
            } catch (e) {
                logger.error(`Error fetching models: ${e.message}`);
                logger.error(`Error stack: ${e.stack}`);

                if (e.statusCode === 404) {
                    return [];
                }

                throw e;
            }
        },
        req,
        res,
        logger
    );

const model = (req, res) =>
    responseWrapper.sendResponseAsync(
        async () => {
            const repository = repositories.get();

            const modelInfo = {
                organisation: req.params.organisation,
                repo: req.params.repo,
                branch: req.params.branch,
                model: req.params.model
            };

            logger.debug(`Model request info: ${JSON.stringify(modelInfo)}`);
            logger.debug(`API model request: ${logger.transformToString(req)}`);

            try {
                const modelResp = await repository.modelAsync(modelInfo, req.provider.access_token);

                if (!modelResp || !modelResp[0]) {
                    logger.error('Empty model response received');
                    return res.status(404).json({
                        status: 'error',
                        message: 'The requested threat model file was not found',
                        code: 'FILE_NOT_FOUND'
                    });
                }

                let jsonContent;

                try {
                    // Handle different repository response formats

                    // For GitHub, GitLab, and Bitbucket repositories that return content in base64
                    if (modelResp[0].content) {
                        jsonContent = JSON.parse(
                            Buffer.from(modelResp[0].content, 'base64').toString('utf8')
                        );
                    }
                    // For Google Drive and other repositories that might return direct JSON
                    else if (typeof modelResp[0] === 'object') {
                        // If it's already a JSON object (Google Drive returns parsed JSON)
                        jsonContent = modelResp[0];
                    } else {
                        logger.error(`Unexpected model response format: ${typeof modelResp[0]}`);
                        return res.status(400).json({
                            status: 'error',
                            message: 'Unexpected response format from repository',
                            code: 'UNEXPECTED_RESPONSE_FORMAT'
                        });
                    }

                    // Validate if this is a valid threat model JSON
                    // A valid threat model should have at least summary and detail properties
                    // or be in Open Threat Model format with otmVersion
                    if (
                        !jsonContent ||
                        typeof jsonContent !== 'object' ||
                        (!jsonContent.summary && !jsonContent.otmVersion)
                    ) {
                        logger.warn(`Invalid threat model format: ${modelInfo.model}`);
                        return res.status(400).json({
                            status: 'error',
                            message: 'The selected file is not a valid threat model',
                            code: 'INVALID_THREAT_MODEL_FORMAT'
                        });
                    }

                    // Add audit logging for successful threat model access
                    logger.audit(
                        `Data access: User ${
                            req.user?.username || 'unknown'
                        } accessed threat model ${modelInfo.model} in ${modelInfo.organisation}/${
                            modelInfo.repo
                        }/${modelInfo.branch} from IP ${req.ip || 'unknown'}`
                    );

                    return jsonContent;
                } catch (parseError) {
                    logger.error(`Error parsing JSON content: ${parseError.message}`);
                    return res.status(400).json({
                        status: 'error',
                        message: 'The selected file is not valid JSON',
                        code: 'INVALID_JSON_FORMAT'
                    });
                }
            } catch (error) {
                logger.error(`Error fetching model: ${error.message}`);
                if (error.stack) {
                    logger.error(`Error stack: ${error.stack}`);
                }

                // Handle file not found errors with a specific message
                if (
                    error.message &&
                    (error.message.includes('Not Found') || error.message.includes('404'))
                ) {
                    return res.status(404).json({
                        status: 'error',
                        message: 'The requested threat model file was not found',
                        code: 'FILE_NOT_FOUND'
                    });
                }

                // Re-throw other errors to be handled by the response wrapper
                throw error;
            }
        },
        req,
        res,
        logger
    );

const create = async (req, res) => {
    const repository = repositories.get();

    const modelBody = {
        organisation: req.params.organisation,
        repo: req.params.repo,
        branch: req.params.branch,
        model: req.params.model,
        body: req.body
    };
    logger.debug(`API create request: ${logger.transformToString(req)}`);

    try {
        const createResp = await repository.createAsync(modelBody, req.provider.access_token);

        // Add audit logging for threat model creation
        logger.audit(
            `Data modification: User ${req.user?.username || 'unknown'} created new threat model ${
                modelBody.model
            } in ${modelBody.organisation}/${modelBody.repo}/${modelBody.branch} from IP ${
                req.ip || 'unknown'
            }`
        );

        return res.status(201).send(createResp);
    } catch (err) {
        logger.error(err);
        return serverError('Error creating model', res, logger);
    }
};

const update = async (req, res) => {
    const repository = repositories.get();

    const modelBody = {
        organisation: req.params.organisation,
        repo: req.params.repo,
        branch: req.params.branch,
        model: req.params.model,
        body: req.body
    };
    logger.debug(`API update request: ${logger.transformToString(req)}`);

    try {
        const updateResp = await repository.updateAsync(modelBody, req.provider.access_token);

        // Add audit logging for threat model update
        logger.audit(
            `Data modification: User ${req.user?.username || 'unknown'} updated threat model ${
                modelBody.model
            } in ${modelBody.organisation}/${modelBody.repo}/${modelBody.branch} from IP ${
                req.ip || 'unknown'
            }`
        );

        return res.send(updateResp);
    } catch (err) {
        logger.error(err);
        return serverError('Error updating model', res, logger);
    }
};

const deleteModel = async (req, res) => {
    const repository = repositories.get();

    const modelInfo = {
        organisation: req.params.organisation,
        repo: req.params.repo,
        branch: req.params.branch,
        model: req.params.model
    };
    logger.debug(`API deleteModel request: ${logger.transformToString(req)}`);

    try {
        const deleteResp = await repository.deleteAsync(modelInfo, req.provider.access_token);

        // Add audit logging for threat model deletion
        logger.audit(
            `Data modification: User ${req.user?.username || 'unknown'} deleted threat model ${
                modelInfo.model
            } in ${modelInfo.organisation}/${modelInfo.repo}/${modelInfo.branch} from IP ${
                req.ip || 'unknown'
            }`
        );

        return res.send(deleteResp);
    } catch (err) {
        logger.error(err);
        return serverError('Error deleting model', res, logger);
    }
};

const getPagination = (headers, pageLinks, page) => {
    if (
        headers === undefined ||
        headers === null ||
        Object.keys(headers).length === 0 ||
        headers?.link === null
    ) {
        if (pageLinks === undefined || pageLinks === null || Object.keys(pageLinks).length === 0) {
            return { page, next: false, prev: false };
        }
        return getPaginationFromPageLinks(pageLinks, page);
    }
    return getPaginationFromHeaders(headers, page);
};

const getPaginationFromPageLinks = (pageLinks, page) => {
    const pagination = { page, next: false, prev: false };
    pagination.next = pageLinks.next;
    pagination.prev = pageLinks.prev;
    return pagination;
};

const getPaginationFromHeaders = (headers, page) => {
    const pagination = { page, next: false, prev: false };
    const linkHeader = headers.link;
    if (linkHeader) {
        linkHeader.split(',').forEach((link) => {
            const isLinkType = (type) => link.split(';')[1].split('=')[1] === type;

            if (isLinkType('"next"')) {
                pagination.next = true;
            }

            if (isLinkType('"prev"')) {
                pagination.prev = true;
            }
        });
    }
    return pagination;
};

const organisation = (req, res) => {
    const organisation = {
        protocol: env.get().config.ENTERPRISE_PROTOCOL || 'https',
        hostname: 'www.github.com',
        port: ''
    };

    // Get provider from request
    const providerName = req.provider?.name;
    logger.debug(`API organisation request for provider: ${providerName || 'unknown'}`);

    // Set provider-specific information
    if (providerName === 'github') {
        organisation.hostname = env.get().config.GITHUB_ENTERPRISE_HOSTNAME || 'www.github.com';
        organisation.port = env.get().config.GITHUB_ENTERPRISE_PORT || '';
    } else if (providerName === 'gitlab') {
        organisation.hostname = env.get().config.GITLAB_ENTERPRISE_HOSTNAME || 'www.gitlab.com';
        organisation.port = env.get().config.GITLAB_ENTERPRISE_PORT || '';
    } else if (providerName === 'bitbucket') {
        organisation.hostname =
            env.get().config.BITBUCKET_ENTERPRISE_HOSTNAME || 'www.bitbucket.org';
        organisation.port = env.get().config.BITBUCKET_ENTERPRISE_PORT || '';
    }

    logger.debug(`Returning organisation: ${JSON.stringify(organisation)}`);
    return res.status(200).send(organisation);
};

const createBranch = async (req, res) => {
    const repository = repositories.get();

    const branchInfo = {
        organisation: req.params.organisation,
        repo: req.params.repo,
        branch: req.params.branch,
        ref: req.body.refBranch
    };
    logger.debug(`API createBranch request: ${logger.transformToString(req)}`);

    try {
        const createBranchResp = await repository.createBranchAsync(
            branchInfo,
            req.provider.access_token
        );

        // Add audit logging for branch creation
        logger.audit(
            `Data modification: User ${req.user?.username || 'unknown'} created new branch ${
                branchInfo.branch
            } from ${branchInfo.ref} in ${branchInfo.organisation}/${branchInfo.repo} from IP ${
                req.ip || 'unknown'
            }`
        );

        return res.status(201).send(createBranchResp);
    } catch (err) {
        logger.error(err);
        return serverError('Error creating branch', res, logger);
    }
};

export default {
    branches,
    create,
    deleteModel,
    model,
    models,
    organisation,
    repos,
    update,
    createBranch
};
