const express = require('express');
const cfg = require('./dataset-github');
const { generateItems } = require('./data-generator');
const { buildPagedResponse } = require('./response-builder');

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

const getAllBranches = () => {
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

const createMockApp = () => {
    const app = express();
    app.use(express.json());

    app.get('/api/config', (_req, res) => {
        res.status(200).json({
            status: 200,
            data: {
                githubEnabled: true, bitbucketEnabled: false, gitlabEnabled: false,
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

    app.get('/api/threatmodel/organisation', (_req, res) => {
        res.status(200).json({
            status: 200,
            data: { protocol: 'https', hostname: 'api.github.com', port: '', }
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

    app.get('/api/threatmodel/:organisation/:repo/branches', (req, res) => {
        const page = parseInt(req.query.page, 10) || 1;
        const allBranches = getAllBranches();
        const { items, pagination } = buildPagedResponse(allBranches, page, cfg.branches.perPage);
        res.status(200).json({
            status: 200,
            data: {
                branches: items.map(b => ({ name: b.name, protected: b.protected })),
                pagination,
            }
        });
    });

    app.get('/api/threatmodel/:organisation/:repo/:branch/models', (_req, res) => {
        res.status(200).json({
            status: 200,
            data: ['Demo Threat Model', 'Web Application', 'API Gateway']
        });
    });

    return app;
};

module.exports = { createMockApp };
