import repository from '../repositories/threatmodelrepository.js';
import { serverError } from './errors.js';

const repos = async (req, res) => {
    const page = req.query.page || 1;
    try {
        const reposResp = await repository.reposAsync(page, req.user.accessToken);
        const repos = reposResp[0];
        const headers = reposResp[1];
        const repoNames = repos.map((x) => x.full_name);
        return res.status(200).json({
            repos: repoNames,
            pagination: getPagination(headers, page)
        });
    } catch (err) {
        req.log.error({ security: false, userName: req.user.profile.username }, err);
        return serverError('Error fetching repositories', res);
    }
};

const branches = async (req, res) => {
    const repoInfo = {
        organisation: req.params.organisation,
        repo: req.params.repo,
        page: req.query.page || 1
    };

    try {
        const branchesResp = await repository.branchesAsync(repoInfo, req.user.accessToken);
        const branches = branchesResp[0],
            headers = branchesResp[1];
        const branchNames = branches.map((x) => x.name);

        return res.status(200).json({
            branches: branchNames,
            pagination: getPagination(headers, repoInfo.page)
        });
    } catch (err) {
        req.log.error({ security: false, userName: req.user.profile.username }, err);
        return serverError('Error fetching branches', res);
    }
};

const models = async (req, res) => {
    const branchInfo = {
        organisation: req.params.organisation,
        repo: req.params.repo,
        branch: req.params.branch
    };

    try {
        const modelsResp = await repository.modelsAsync(branchInfo, req.user.accessToken);
        const modelNames = modelsResp[0].map((x) => x.name);

        return res.status(200).json(modelNames);
    } catch (err) {
        req.log.error({ security: false, userName: req.user.profile.username }, err);
        return serverError('Error fetching models', res);
    }
};

const model = async (req, res) => {
    const modelInfo = {
        organisation: req.params.organisation,
        repo: req.params.repo,
        branch: req.params.branch,
        model: req.params.model
    };

    try {
        const modelResp = await repository.modelAsync(modelInfo, req.user.accessToken);
        return res.status(200).send(Buffer.from(modelResp[0].content, 'base64').toString('utf8'));
    } catch (err) {
        req.log.error({ security: false, userName: req.user.profile.username }, err);
        return serverError('Error fetching model', res);
    }
};

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
