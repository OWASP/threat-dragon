import repository from '../repositories/threatmodelrepository.js';
import responseWrapper from './responseWrapper.js';
import { serverError } from './errors.js';

const repos = (req, res) => responseWrapper.sendResponseAsync(async () => {
    const page = req.query.page || 1;
    const reposResp = await repository.reposAsync(page, req.provider.access_token);
    const repos = reposResp[0];
    const headers = reposResp[1];

    return {
        repos: repos.map((x) => x.full_name),
        pagination: getPagination(headers, page)
    };
}, req, res);


const branches = (req, res) => responseWrapper.sendResponseAsync(async () => {
    const repoInfo = {
        organisation: req.params.organisation,
        repo: req.params.repo,
        page: req.query.page || 1
    };

    const branchesResp = await repository.branchesAsync(repoInfo, req.provider.access_token);
    const branches = branchesResp[0],
        headers = branchesResp[1];
    const branchNames = branches.map((x) => x.name);
    
    return {
        branches: branchNames,
        pagination: getPagination(headers, repoInfo.page)
    };
}, req, res);

const models = (req, res) => responseWrapper.sendResponseAsync(async () => {
    const branchInfo = {
        organisation: req.params.organisation,
        repo: req.params.repo,
        branch: req.params.branch
    };
    const modelsResp = await repository.modelsAsync(branchInfo, req.provider.access_token);
    return modelsResp[0].map((x) => x.name);
}, req, res);

const model = (req, res) => responseWrapper.sendResponseAsync(async () => {
    const modelInfo = {
        organisation: req.params.organisation,
        repo: req.params.repo,
        branch: req.params.branch,
        model: req.params.model
    };
    const modelResp = await repository.modelAsync(modelInfo, req.provider.access_token);
    return JSON.parse(Buffer.from(modelResp[0].content, 'base64').toString('utf8'));
}, req, res);

const create = async (req, res) => {
    const modelInfo = {
        organisation: req.params.organisation,
        repo: req.params.repo,
        branch: req.params.branch,
        model: req.params.model,
        body: req.body        
    };

    try {
        const modelResp = await repository.createAsync(modelInfo, req.user.accessToken);
        return res.status(201).send(modelResp);
    } catch (err) {
        req.log.error({ security: false, userName: req.user.profile.username }, err);
        return serverError('Error creating model', res);
    }
};

const update = async (req, res) => {
    const modelInfo = {
        organisation: req.params.organisation,
        repo: req.params.repo,
        branch: req.params.branch,
        model: req.params.model,
        body: req.body        
    };

    try {
        const modelResp = await repository.updateAsync(modelInfo, req.user.accessToken);
        return res.send(modelResp);
    } catch (err) {
        req.log.error({ security: false, userName: req.user.profile.username }, err);
        return serverError('Error updating model', res);
    }
};

const deleteModel = async (req, res) => {
    const modelInfo = {
        organisation: req.params.organisation,
        repo: req.params.repo,
        branch: req.params.branch,
        model: req.params.model,      
    };

    try {
        const delResp = await repository.deleteAsync(modelInfo, req.user.accessToken);
        return res.send(delResp);
    } catch (err) {
        req.log.error({ security: false, userName: req.user.profile.username }, err);
        return serverError('Error deleting model', res);
    }
};

const getPagination = (headers, page) => {
    const pagination = { page: page, next: false, prev: false };
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

export default {
    branches,
    create,
    deleteModel,
    model,
    models,
    repos,
    update
};
