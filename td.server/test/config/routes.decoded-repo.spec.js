import express from 'express';
import request from 'supertest';
import sinon from 'sinon';

import bearer from '../../src/config/bearer.config.js';
import routeConfig from '../../src/config/routes.config.js';
import threatmodelController from '../../src/controllers/threatmodelcontroller.js';

describe('config/routes.config.js decoded repository routes', () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        sinon.stub(bearer, 'middleware').callsFake((req, res, next) => next());
    });

    it('passes decoded GitLab subgroup repository paths to the branches controller', async () => {
        sinon.stub(threatmodelController, 'branches').callsFake((req, res) => res.status(200).send(req.params));

        routeConfig.config(app);
        const res = await request(app).get('/api/threatmodel/repos/foo/bar/baz/branches');

        sinon.assert.match(res.body.repo, 'foo/bar/baz');
    });

    it('keeps query parameters on decoded repository routes', async () => {
        sinon.stub(threatmodelController, 'branches').callsFake((req, res) => res.status(200).send(req.query));

        routeConfig.config(app);
        const res = await request(app).get('/api/threatmodel/repos/foo/bar/baz/branches?page=1');

        sinon.assert.match(res.body.page, '1');
    });

    it('passes decoded GitLab subgroup repository paths to the models controller', async () => {
        sinon.stub(threatmodelController, 'models').callsFake((req, res) => res.status(200).send(req.params));

        routeConfig.config(app);
        const res = await request(app).get('/api/threatmodel/repos/foo/bar/baz/main/models');

        sinon.assert.match(res.body.repo, 'foo/bar/baz');
        sinon.assert.match(res.body.branch, 'main');
    });

    it('passes decoded GitLab subgroup repository paths to the model data controller', async () => {
        sinon.stub(threatmodelController, 'model').callsFake((req, res) => res.status(200).send(req.params));

        routeConfig.config(app);
        const res = await request(app).get('/api/threatmodel/repos/foo/bar/baz/main/model/data');

        sinon.assert.match(res.body.repo, 'foo/bar/baz');
        sinon.assert.match(res.body.branch, 'main');
        sinon.assert.match(res.body.model, 'model');
    });

    it('passes decoded GitLab subgroup repository paths to the create branch controller', async () => {
        sinon.stub(threatmodelController, 'createBranch').callsFake((req, res) => res.status(200).send(req.params));

        routeConfig.config(app);
        const res = await request(app).post('/api/threatmodel/repos/foo/bar/baz/new-branch/createBranch');

        sinon.assert.match(res.body.repo, 'foo/bar/baz');
        sinon.assert.match(res.body.branch, 'new-branch');
    });

    it('passes decoded GitLab subgroup repository paths to the create model controller', async () => {
        sinon.stub(threatmodelController, 'create').callsFake((req, res) => res.status(200).send(req.params));

        routeConfig.config(app);
        const res = await request(app).post('/api/threatmodel/repos/foo/bar/baz/main/model/create');

        sinon.assert.match(res.body.repo, 'foo/bar/baz');
        sinon.assert.match(res.body.branch, 'main');
        sinon.assert.match(res.body.model, 'model');
    });

    it('passes decoded GitLab subgroup repository paths to the update model controller', async () => {
        sinon.stub(threatmodelController, 'update').callsFake((req, res) => res.status(200).send(req.params));

        routeConfig.config(app);
        const res = await request(app).put('/api/threatmodel/repos/foo/bar/baz/main/model/update');

        sinon.assert.match(res.body.repo, 'foo/bar/baz');
        sinon.assert.match(res.body.branch, 'main');
        sinon.assert.match(res.body.model, 'model');
    });
});
