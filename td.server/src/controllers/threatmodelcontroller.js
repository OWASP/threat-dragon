import env from '../env/Env.js';
import loggerHelper from '../helpers/logger.helper.js';
import repositories from "../repositories";
import responseWrapper from './responseWrapper.js';
import { serverError } from './errors.js';

const logger = loggerHelper.get('controllers/threatmodelcontroller.js');

const repos = (req, res) => responseWrapper.sendResponseAsync(async () => {
    const repository = repositories.get();

    const page = req.query.page || 1;
    const searchQuerys = req.query.searchQuery || [];
    let reposResp;
    let repos;
    // backwardly compatible with previous use of env vars GITHUB_USE_SEARCH and GITHUB_SEARCH_QUERY
    if (env.get().config.REPO_USE_SEARCH === 'true' || env.get().config.GITHUB_USE_SEARCH === 'true') {
        logger.debug('Using searchAsync');
        const searchQuery = env.get().config.REPO_SEARCH_QUERY ?? env.get().config.GITHUB_SEARCH_QUERY;
        reposResp = await repository.searchAsync(page, req.provider.access_token, [searchQuery, ...searchQuerys]);
        repos = reposResp[0].items ?? reposResp[0];
    } else {
        logger.debug('Using reposAsync');
        reposResp = await repository.reposAsync(page, req.provider.access_token, [searchQuerys]);
        repos = reposResp[0];
    }
    const headers = reposResp[1];
    const pageLinks = reposResp[2];
    logger.debug(`API repos request: ${logger.transformToString(req)}`);

    const pagination = getPagination(headers, pageLinks, page);

    return {
        repos: repos.map((x) => x.full_name),
        pagination: pagination
    };
}, req, res, logger);



const branches = (req, res) => responseWrapper.sendResponseAsync(async () => {

    const repository = repositories.get();

    const repoInfo = {
        organisation: req.params.organisation,
        repo: req.params.repo,
        page: req.query.page || 1
    };
    logger.debug(`API branches request: ${logger.transformToString(req)}`);

    const branchesResp = await repository.branchesAsync(repoInfo, req.provider.access_token);
    const branches = branchesResp[0];
    const headers = branchesResp[1];
    const pageLinks = branchesResp[2];

    const branchNames = branches.map((x) => ({
        name: x.name,
        // Protected branches are not so easy to determine from the API on Bitbucket
        protected: x.protected||false
    }));

    const pagination = getPagination(headers, pageLinks, repoInfo.page);

    return {
        branches: branchNames,
        pagination: pagination
    };
}, req, res, logger);

const models = (req, res) => responseWrapper.sendResponseAsync(async () => {
    const repository = repositories.get();

    const branchInfo = {
        organisation: req.params.organisation,
        repo: req.params.repo,
        branch: req.params.branch
    };
    logger.debug(`API models request: ${logger.transformToString(req)}`);

    let modelsResp;
    try {
        modelsResp = await repository.modelsAsync(branchInfo, req.provider.access_token);
    } catch (e) {
        if (e.statusCode === 404) {
            return [];
        }

        throw e;
    }
    return modelsResp[0].map((x) => x.name);
}, req, res, logger);

const model = (req, res) => responseWrapper.sendResponseAsync(async () => {
    const repository = repositories.get();
    const modelInfo = {
        organisation: req.params.organisation,
        repo: req.params.repo,
        branch: req.params.branch,
        model: req.params.model
    };
    logger.debug(`API model request: ${logger.transformToString(req)}`);

    const modelResp = await repository.modelAsync(modelInfo, req.provider.access_token);
    return JSON.parse(Buffer.from(modelResp[0].content, 'base64').toString('utf8'));
}, req, res, logger);

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
        return res.send(deleteResp);
    } catch (err) {
        logger.error(err);
        return serverError('Error deleting model', res, logger);
    }
};

const getPagination = (headers, pageLinks, page) => {

    if(headers === undefined || headers === null || (Object.keys(headers).length === 0) || headers?.link === null){
        if (pageLinks === undefined || pageLinks === null || (Object.keys(pageLinks).length === 0)) {
            return {page, next: false, prev: false};
        }
        return getPaginationFromPageLinks(pageLinks, page);
    } 
        return getPaginationFromHeaders(headers, page);
    
};

const getPaginationFromPageLinks = (pageLinks, page) => {
    const pagination = {page, next: false, prev: false};
    pagination.next = pageLinks.next;
    pagination.prev = pageLinks.prev;
    return pagination;
};

const getPaginationFromHeaders = (headers, page) => {
    const pagination = {page, next: false, prev: false};
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
        hostname: env.get().config.GITHUB_ENTERPRISE_HOSTNAME || 'www.github.com',
        port: env.get().config.GITHUB_ENTERPRISE_PORT || '',
    };
    logger.debug(`API organisation request: ${logger.transformToString(req)}`);

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
        const createBranchResp = await repository.createBranchAsync(branchInfo, req.provider.access_token);
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
