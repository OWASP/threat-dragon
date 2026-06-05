const express = require('express');
const cfg = require('./dataset-github');
const gitlabCfg = require('./dataset-gitlab');
const { generateItems } = require('./data-generator');
const { buildPagedResponse } = require('./response-builder');

const createdGitLabBranches = [];

const getAllRepos = () => {
    const { names, total, orgs } = cfg.repos;
    return generateItems(names, total).map((name, idx) => ({
        id: idx + 1,
        full_name: `${orgs[idx % orgs.length]}/${name}`,
        name,
        owner: { login: orgs[idx % orgs.length] },
        private: idx % 3 === 0,
        html_url: `https://github.com/${orgs[idx % orgs.length]}/${name}`,
        description: `Fake repository #${idx + 1} for testing pagination`,
        fork: false,
        language: ['JavaScript', 'TypeScript', 'Python', 'Go', 'Rust'][idx % 5],
    }));
};

const getAllBranches = (provider = 'github') => {
    if (provider === 'gitlab') {
        return [...gitlabCfg.branches.names, ...createdGitLabBranches].map((name, idx) => ({
            name,
            commit: { sha: `gitlab123def${idx}` },
            protected: idx === 0,
        }));
    }

    const { names, total } = cfg.branches;
    return generateItems(names, total).map((name, idx) => ({
        name,
        commit: { sha: `abc123def${idx}` },
        protected: idx === 0 || idx % 6 === 0,
    }));
};

const createFakeJwt = () => {
    const jwtPayload = Buffer.from(JSON.stringify({
        provider: { github: 'fake-encrypted-token' },
        user: { login: 'test-user', name: 'Test User' }
    })).toString('base64');
    return `header.${jwtPayload}.fake-signature`;
};

const isGitLabRepo = (organisation, repo) => organisation === gitlabCfg.repos.org && repo === gitlabCfg.repos.subgroupRepo;

const repoPathFromParams = (params, repoParamName = 'repo') => {
    if (Array.isArray(params[1])) {
        return params[1].join('/');
    }
    return params[repoParamName] || params[1];
};

const getBranchResponse = (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const organisation = req.params.organisation || req.params[0];
    const repo = repoPathFromParams(req.params);
    const provider = isGitLabRepo(organisation, repo) ? 'gitlab' : 'github';
    const allBranches = getAllBranches(provider);
    const perPage = provider === 'gitlab' ? allBranches.length : cfg.branches.perPage;
    const { items, pagination } = buildPagedResponse(allBranches, page, perPage);
    res.status(200).json({
        status: 200,
        data: {
            branches: items.map(b => ({ name: b.name, protected: b.protected })),
            pagination,
        }
    });
};

const getModelsResponse = (req, res) => {
    const organisation = req.params.organisation || req.params[0];
    const repo = repoPathFromParams(req.params);
    const models = isGitLabRepo(organisation, repo)
        ? gitlabCfg.models.names
        : ['Demo Threat Model', 'Web Application', 'API Gateway'];

    res.status(200).json({
        status: 200,
        data: models
    });
};

const getModelDataResponse = (_req, res) => {
    res.status(200).json({
        status: 200,
        data: gitlabCfg.models.data
    });
};

const createBranchResponse = (req, res) => {
    const branchName = req.params.branch || req.params[2];

    if (!createdGitLabBranches.includes(branchName)) {
        createdGitLabBranches.push(branchName);
    }

    res.status(200).json({
        status: 200,
        data: { name: branchName }
    });
};

const createMockApp = () => {
    const app = express();
    app.use(express.json());

    app.get('/api/config', (_req, res) => {
        res.status(200).json({
            status: 200,
            data: {
                githubEnabled: true, bitbucketEnabled: false, gitlabEnabled: true,
                googleEnabled: false, localEnabled: true,
                allowedLocales: ['en'], defaultLocale: 'en',
            }
        });
    });

    app.get('/api/login/:provider', (_req, res) => {
        res.status(200).json({
            status: 200,
            data: 'http://localhost:3000/api/oauth/return?code=fake-code'
        });
    });

    app.get('/api/oauth/return', (req, res) => {
        res.redirect(`http://localhost:8080/#/oauth-return?code=${req.query.code || 'fake-code'}`);
    });

    app.get('/api/oauth/:provider', (_req, res) => {
        const fakeJwt = createFakeJwt();
        res.status(200).json({
            status: 200,
            data: { accessToken: fakeJwt, refreshToken: fakeJwt, }
        });
    });

    app.post('/api/auth/local', (_req, res) => {
        const fakeJwt = createFakeJwt();
        res.status(200).json({
            status: 200,
            data: {
                accessToken: fakeJwt,
                refreshToken: fakeJwt,
                user: { login: 'local-user', name: 'Local User', provider: 'local' }
            }
        });
    });

    app.get('/api/threatmodel/organisation', (req, res) => {
        const hostname = req.query.provider === 'gitlab' ? 'gitlab.example.test' : 'api.github.com';
        res.status(200).json({
            status: 200,
            data: { protocol: 'https', hostname, port: '', }
        });
    });

    app.get('/api/threatmodel/repos', (req, res) => {
        const page = parseInt(req.query.page, 10) || 1;
        const searchQuery = (req.query.searchQuery || '').toLowerCase();
        const allRepos = getAllRepos();
        const matched = searchQuery
            ? allRepos.filter(r => r.full_name.toLowerCase().includes(searchQuery))
            : allRepos;
        const { items, pagination } = buildPagedResponse(matched, page, cfg.repos.perPage);
        res.status(200).json({
            status: 200,
            data: {
                repos: items.map(r => r.full_name),
                pagination: {
                    ...pagination,
                    next: items.length > 0 && pagination.next,
                }
            }
        });
    });

    app.get('/api/threatmodel/:organisation/:repo/branches', getBranchResponse);
    app.get(/^\/api\/threatmodel\/([^/]+)\/(.+)\/branches$/, getBranchResponse);

    app.get('/api/threatmodel/:organisation/:repo/:branch/models', getModelsResponse);
    app.get(/^\/api\/threatmodel\/([^/]+)\/(.+)\/([^/]+)\/models$/, getModelsResponse);

    app.get('/api/threatmodel/:organisation/:repo/:branch/:model/data', getModelDataResponse);
    app.get(/^\/api\/threatmodel\/([^/]+)\/(.+)\/([^/]+)\/([^/]+)\/data$/, getModelDataResponse);

    app.post('/api/threatmodel/:organisation/:repo/:branch/createBranch', createBranchResponse);
    app.post(/^\/api\/threatmodel\/([^/]+)\/(.+)\/([^/]+)\/createBranch$/, createBranchResponse);

    return app;
};

module.exports = { createMockApp };
