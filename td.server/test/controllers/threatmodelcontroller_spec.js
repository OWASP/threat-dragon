import { expect } from 'chai';
import sinon from 'sinon';

import threatModelController from '../../src/controllers/threatmodelcontroller.js';
import threatModelRepository from '../../src/repositories/threatmodelrepository.js';

describe('threat model controller tests', () => {
    const headers = {
        link: 'url1; rel="link", url2; rel="link"'
    };
    const mockResponse = {
        send: () => {},
        status: () => {},
        json: () => {}
    };
    let mockRequest;

    beforeEach(() => {
        mockRequest = {
            user: {
                accessToken: 'token'
            },
            params: {
                organisation: 'test org',
                repo: 'test repo',
                branch: 'test branch',
                model: 'test model'
            },
            query: {
                page: 'test page'
            },
            body: 'test body'
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('GET repos', () => {
        const repos = [
            { full_name: 'repo1' },
            { full_name: 'repo2' },
            { full_name: 'repo3' }
        ];

        describe('without error', () => {
            beforeEach(() => {
                const mockRepo = (page, token, cb) => { cb(null, repos, headers); };
                sinon.stub(threatModelRepository, 'repos').callsFake(mockRepo);
                sinon.spy(mockResponse, 'send');
                threatModelController.repos(mockRequest, mockResponse);
            });

            it('should fetch the repos for the logged in user', () => {
                expect(threatModelRepository.repos).to.have.been.calledWith(
                    mockRequest.query.page,
                    mockRequest.user.accessToken,
                    sinon.match.any
                );
            });

            it('should send a response', () => {
                expect(mockResponse.send).to.have.been.calledOnce;
            });

            it('should return the repo data', () => {
                expect(mockResponse.send).to.have.been.calledWith(sinon.match({
                    repos: sinon.match.array.deepEquals(repos.map(x => x.full_name))
                }));
            });
        });

        describe('with error', () => {
            const err = new Error('whoops');

            beforeEach(() => {
                const mockRepo = (page, token, cb) => { cb(err, null, null); };
                sinon.stub(threatModelRepository, 'repos').callsFake(mockRepo);
                sinon.stub(mockResponse, 'status').returns(mockResponse);
                sinon.spy(mockResponse, 'json');
                threatModelController.repos(mockRequest, mockResponse);
            });

            it('should return a 500 error if if fails to fetch the repos', () => {
                expect(mockResponse.status).to.have.been.calledWith(500);
            });

            it('should return the error', () => {
                expect(mockResponse.json).to.have.been.calledWith(err);
            });
        });
    });

    describe('GET branches', () => {
        const branches = [
            { name: 'branch1' },
            { name: 'branch2' },
            { name: 'branch3' }
        ];
        let repoInfo;

        beforeEach(() => {
            repoInfo = {
                organisation: mockRequest.params.organisation,
                repo: mockRequest.params.repo,
                page: mockRequest.query.page
            };
        });

        describe('without error', () => {
            beforeEach(() => {
                const mockRepo = (page, token, cb) => { cb(null, branches, headers); };
                sinon.stub(threatModelRepository, 'branches').callsFake(mockRepo);
                sinon.spy(mockResponse, 'send');
                threatModelController.branches(mockRequest, mockResponse);
            });

            it('should fetch the branches for the specified repo', () => {
                expect(threatModelRepository.branches).to.have.been.calledWith(
                    repoInfo,
                    mockRequest.user.accessToken,
                    sinon.match.any
                );
            });

            it('should return the branch data', () => {
                expect(mockResponse.send).to.have.been.calledWith(sinon.match({
                    branches: sinon.match.array.deepEquals(branches.map(x => x.name))
                }));
            });
        });

        describe('with error', () => {
            const err = new Error('whoops');

            beforeEach(() => {
                const mockRepo = (page, token, cb) => { cb(err, null, null); };
                sinon.stub(threatModelRepository, 'branches').callsFake(mockRepo);
                sinon.stub(mockResponse, 'status').returns(mockResponse);
                sinon.spy(mockResponse, 'json');
                threatModelController.branches(mockRequest, mockResponse);
            });

            it('should return a 500 error if if fails to fetch the branches', () => {
                expect(mockResponse.status).to.have.been.calledWith(500);
            });

            it('should return the error', () => {
                expect(mockResponse.json).to.have.been.calledWith(err);
            });
        });
    });

    describe('GET models', () => {
        const models = [
            { name: 'model1' },
            { name: 'model2' },
            { name: 'model3' }
        ];
        let branchInfo;

        beforeEach(() => {
            branchInfo = {
                organisation: mockRequest.params.organisation,
                repo: mockRequest.params.repo,
                branch: mockRequest.params.branch
            };
        });

        describe('without error', () => {
            beforeEach(() => {
                const mockRepo = (page, token, cb) => { cb(null, models); };
                sinon.stub(threatModelRepository, 'models').callsFake(mockRepo);
                sinon.spy(mockResponse, 'send');
                threatModelController.models(mockRequest, mockResponse);
            });

            it('should fetch the models for the specified repo', () => {
                expect(threatModelRepository.models).to.have.been.calledWith(
                    branchInfo,
                    mockRequest.user.accessToken,
                    sinon.match.any
                );
            });

            it('should return the model data', () => {
                expect(mockResponse.send).to.have.been.calledWith(
                    sinon.match(sinon.match.array.deepEquals(models.map(x => x.name))));
            });
        });

        describe('with error', () => {
            const err = new Error('whoops');

            beforeEach(() => {
                const mockRepo = (page, token, cb) => { cb(err, null); };
                sinon.stub(threatModelRepository, 'models').callsFake(mockRepo);
                sinon.stub(mockResponse, 'status').returns(mockResponse);
                sinon.spy(mockResponse, 'json');
                threatModelController.models(mockRequest, mockResponse);
            });

            it('should return a 500 error if if fails to fetch the models', () => {
                expect(mockResponse.status).to.have.been.calledWith(500);
            });

            it('should return the error', () => {
                expect(mockResponse.json).to.have.been.calledWith(err);
            });
        });
    });

    describe('GET model', () => {
        let modelInfo, encodedModel;

        beforeEach(() => {
            modelInfo = {
                organisation: mockRequest.params.organisation,
                repo: mockRequest.params.repo,
                branch: mockRequest.params.branch,
                model: mockRequest.params.model
            };
            encodedModel = Buffer.from(modelInfo.model).toString('base64');
        });

        describe('without error', () => {
            beforeEach(() => {
                const mockRepo = (page, token, cb) => { cb(null, { content: encodedModel }); };
                sinon.stub(threatModelRepository, 'model').callsFake(mockRepo);
                sinon.spy(mockResponse, 'send');
                threatModelController.model(mockRequest, mockResponse);
            });

            it('should fetch the specified model', () => {
                expect(threatModelRepository.model).to.have.been.calledWith(
                    modelInfo,
                    mockRequest.user.accessToken,
                    sinon.match.any
                );
            });

            it('should return the model data', () => {
                expect(mockResponse.send).to.have.been.calledWith(mockRequest.params.model);
            });
        });

        describe('with error', () => {
            const err = new Error('whoops');

            beforeEach(() => {
                const mockRepo = (page, token, cb) => { cb(err, null); };
                sinon.stub(threatModelRepository, 'model').callsFake(mockRepo);
                sinon.stub(mockResponse, 'status').returns(mockResponse);
                sinon.spy(mockResponse, 'json');
                threatModelController.model(mockRequest, mockResponse);
            });

            it('should return a 500 error if if fails to fetch the model', () => {
                expect(mockResponse.status).to.have.been.calledWith(500);
            });

            it('should return the error', () => {
                expect(mockResponse.json).to.have.been.calledWith(err);
            });
        });
    });

    describe('CREATE model', () => {
        let modelInfo;

        beforeEach(() => {
            modelInfo = {
                organisation: mockRequest.params.organisation,
                repo: mockRequest.params.repo,
                branch: mockRequest.params.branch,
                model: mockRequest.params.model,
                body: mockRequest.body
            };
        });

        describe('without error', () => {
            beforeEach(() => {
                const mockRepo = (page, token, cb) => { cb(null, modelInfo.model); };
                sinon.stub(threatModelRepository, 'create').callsFake(mockRepo);
                sinon.spy(mockResponse, 'send');
                threatModelController.create(mockRequest, mockResponse);
            });

            it('should create the specified model', () => {
                expect(threatModelRepository.create).to.have.been.calledWith(
                    modelInfo,
                    mockRequest.user.accessToken,
                    sinon.match.any
                );
            });

            it('should return the model data', () => {
                expect(mockResponse.send).to.have.been.calledWith(mockRequest.params.model);
            });
        });

        describe('with error', () => {
            const err = new Error('whoops');

            beforeEach(() => {
                const mockRepo = (page, token, cb) => { cb(err, null); };
                sinon.stub(threatModelRepository, 'create').callsFake(mockRepo);
                sinon.stub(mockResponse, 'status').returns(mockResponse);
                sinon.spy(mockResponse, 'json');
                threatModelController.create(mockRequest, mockResponse);
            });

            it('should return a 500 error if if fails to create the model', () => {
                expect(mockResponse.status).to.have.been.calledWith(500);
            });

            it('should return the error', () => {
                expect(mockResponse.json).to.have.been.calledWith(err);
            });
        });
    });

    describe('UPDATE model', () => {
        let modelInfo;

        beforeEach(() => {
            modelInfo = {
                organisation: mockRequest.params.organisation,
                repo: mockRequest.params.repo,
                branch: mockRequest.params.branch,
                model: mockRequest.params.model,
                body: mockRequest.body
            };
        });

        describe('without error', () => {
            beforeEach(() => {
                const mockRepo = (page, token, cb) => { cb(null, modelInfo.model); };
                sinon.stub(threatModelRepository, 'update').callsFake(mockRepo);
                sinon.spy(mockResponse, 'send');
                threatModelController.update(mockRequest, mockResponse);
            });

            it('should update the specified model', () => {
                expect(threatModelRepository.update).to.have.been.calledWith(
                    modelInfo,
                    mockRequest.user.accessToken,
                    sinon.match.any
                );
            });

            it('should return the model data', () => {
                expect(mockResponse.send).to.have.been.calledWith(mockRequest.params.model);
            });
        });

        describe('with error', () => {
            const err = new Error('whoops');

            beforeEach(() => {
                const mockRepo = (page, token, cb) => { cb(err, null); };
                sinon.stub(threatModelRepository, 'update').callsFake(mockRepo);
                sinon.stub(mockResponse, 'status').returns(mockResponse);
                sinon.spy(mockResponse, 'json');
                threatModelController.update(mockRequest, mockResponse);
            });

            it('should return a 500 error if if fails to update the model', () => {
                expect(mockResponse.status).to.have.been.calledWith(500);
            });

            it('should return the error', () => {
                expect(mockResponse.json).to.have.been.calledWith(err);
            });
        });
    });

    describe('DELETE model', () => {
        let modelInfo;

        beforeEach(() => {
            modelInfo = {
                organisation: mockRequest.params.organisation,
                repo: mockRequest.params.repo,
                branch: mockRequest.params.branch,
                model: mockRequest.params.model
            };
        });

        describe('without error', () => {
            beforeEach(() => {
                const mockRepo = (page, token, cb) => { cb(null, modelInfo.model); };
                sinon.stub(threatModelRepository, 'deleteModel').callsFake(mockRepo);
                sinon.spy(mockResponse, 'send');
                threatModelController.deleteModel(mockRequest, mockResponse);
            });

            it('should delete the specified model', () => {
                expect(threatModelRepository.deleteModel).to.have.been.calledWith(
                    modelInfo,
                    mockRequest.user.accessToken,
                    sinon.match.any
                );
            });

            it('should return data', () => {
                expect(mockResponse.send).to.have.been.calledWith(mockRequest.params.model);
            });
        });

        describe('with error', () => {
            const err = new Error('whoops');

            beforeEach(() => {
                const mockRepo = (page, token, cb) => { cb(err, null); };
                sinon.stub(threatModelRepository, 'deleteModel').callsFake(mockRepo);
                sinon.stub(mockResponse, 'status').returns(mockResponse);
                sinon.spy(mockResponse, 'json');
                threatModelController.deleteModel(mockRequest, mockResponse);
            });

            it('should return a 500 error if if fails to delete the model', () => {
                expect(mockResponse.status).to.have.been.calledWith(500);
            });

            it('should return the error', () => {
                expect(mockResponse.json).to.have.been.calledWith(err);
            });
        });
    });

    describe('pagination tests', () => {
        const repos = [
            { full_name: 'repo1' },
            { full_name: 'repo2' },
            { full_name: 'repo3' }
        ];
    
        describe('repos', () => {
            beforeEach(() => {
                const mockRepo = (page, token, cb) => { cb(null, repos, headers); };
                sinon.stub(threatModelRepository, 'repos').callsFake(mockRepo);
                sinon.stub(threatModelRepository, 'branches').callsFake(mockRepo);
                sinon.spy(mockResponse, 'send');
            });

            it('should enable next and disable prev', () => {
                headers.link = 'url1; rel="next", url2; rel="link"';
                threatModelController.repos(mockRequest, mockResponse);
                expect(mockResponse.send).to.have.been.calledWith({
                    repos: sinon.match.any,
                    pagination: {
                        page: mockRequest.query.page,
                        prev: false,
                        next: true
                    }
                });
            });

            it('should enable next and enable prev', () => {
                headers.link = 'url1; rel="next", url2; rel="prev"';
                threatModelController.repos(mockRequest, mockResponse);
                expect(mockResponse.send).to.have.been.calledWith({
                    repos: sinon.match.any,
                    pagination: {
                        page: mockRequest.query.page,
                        prev: true,
                        next: true
                    }
                });
            });
            
            it('should disable next and enable prev', () => {
                headers.link = 'url1; rel="link", url2; rel="prev"';
                threatModelController.repos(mockRequest, mockResponse);
                expect(mockResponse.send).to.have.been.calledWith({
                    repos: sinon.match.any,
                    pagination: {
                        page: mockRequest.query.page,
                        prev: true,
                        next: false
                    }
                });
            });
            
            it('should disable next and disable prev', () => {
                headers.link = 'url1; rel="link", url2; rel="link"';
                threatModelController.repos(mockRequest, mockResponse);
                expect(mockResponse.send).to.have.been.calledWith({
                    repos: sinon.match.any,
                    pagination: {
                        page: mockRequest.query.page,
                        prev: false,
                        next: false
                    }
                });
            });

            it('should select repos page 1 if not specified', () => {
                mockRequest.query.page = '';
                threatModelController.repos(mockRequest, mockResponse);
                expect(threatModelRepository.repos).to.have.been.calledWith(1, sinon.match.any, sinon.match.any);
            });

            it('should select branches page 1 if not specified', () => {
                mockRequest.query.page = '';
                threatModelController.branches(mockRequest, mockResponse);
                expect(threatModelRepository.branches).to.have.been.calledWith(
                    sinon.match({ page: 1 }),
                    sinon.match.any,
                    sinon.match.any
                );
            });
        });
    });
});