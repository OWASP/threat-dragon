import { expect } from 'chai';
import sinon from 'sinon';

import { getMockRequest, getMockResponse } from '../express.mocks.js';
import responseWrapper from '../../src/controllers/responseWrapper.js';
import threatModelController from '../../src/controllers/threatmodelcontroller.js';
import threatModelRepository from '../../src/repositories/threatmodelrepository.js';

describe('threat model controller tests', () => {
    const headers = {
        link: 'url1; rel="link", url2; rel="link"'
    };
    const err = new Error('whoops');
    const mockWrapper = async (p) => await p();
    let mockRequest, mockResponse;

    beforeEach(() => {
        sinon.stub(responseWrapper, 'sendResponseAsync').callsFake(mockWrapper);
        mockRequest = Object.assign(getMockRequest(), {
            params: {
                organisation: 'test org',
                repo: 'test repo',
                branch: 'test branch',
                model: { version: '2.0' }
            },
            query: {
                page: 'test page'
            },
            body: 'test body'
        });
        mockResponse = getMockResponse();
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
        let result;

        beforeEach(async () => {
            sinon.stub(threatModelRepository, 'reposAsync').resolves([repos, {}]);
            result = await threatModelController.repos(mockRequest, mockResponse);
        });

        it('should fetch the repos for the logged in user', () => {
            expect(threatModelRepository.reposAsync).to.have.been.calledWith(
                mockRequest.query.page,
                mockRequest.provider.access_token
            );
        });

        it('should return the repo data', () => {
            expect(result.repos).to.deep.equal(repos.map(x => x.full_name));
        });
    });

    describe('GET branches', () => {
        const branches = [
            { name: 'branch1' },
            { name: 'branch2' },
            { name: 'branch3' }
        ];
        let repoInfo, result;

        beforeEach(async () => {
            repoInfo = {
                organisation: mockRequest.params.organisation,
                repo: mockRequest.params.repo,
                page: mockRequest.query.page
            };
            sinon.stub(threatModelRepository, 'branchesAsync').resolves([branches, []]);
            result = await threatModelController.branches(mockRequest, mockResponse);
        });

        it('should fetch the branches for the specified repo', () => {
            expect(threatModelRepository.branchesAsync).to.have.been.calledWith(
                repoInfo,
                mockRequest.provider.access_token
            );
        });

        it('should return the branch data', () => {
            expect(result.branches).to.deep.equal(branches.map(x => x .name));
        });

    });

    describe('GET models', () => {
        const models = [
            { name: 'model1' },
            { name: 'model2' },
            { name: 'model3' }
        ];
        let branchInfo, result;

        beforeEach(async () => {
            branchInfo = {
                organisation: mockRequest.params.organisation,
                repo: mockRequest.params.repo,
                branch: mockRequest.params.branch
            };
            sinon.stub(threatModelRepository, 'modelsAsync').resolves([models]);
            result = await threatModelController.models(mockRequest, mockResponse);
        });


        it('should fetch the models for the specified repo', () => {
            expect(threatModelRepository.modelsAsync).to.have.been.calledWith(
                branchInfo,
                mockRequest.provider.access_token
            );
        });

        it('should return the model data', () => {
            expect(result).to.deep.equal(models.map(x => x.name));
        });
    });

    describe('GET model', () => {
        let modelInfo, encodedModel, result;

        beforeEach(async () => {
            modelInfo = {
                organisation: mockRequest.params.organisation,
                repo: mockRequest.params.repo,
                branch: mockRequest.params.branch,
                model: mockRequest.params.model
            };
            encodedModel = Buffer.from(JSON.stringify(modelInfo.model)).toString('base64');
            sinon.stub(threatModelRepository, 'modelAsync').resolves([{ content: encodedModel }]);
            result = await threatModelController.model(mockRequest, mockResponse);
        });

        it('should fetch the specified model', () => {
            expect(threatModelRepository.modelAsync).to.have.been.calledWith(
                modelInfo,
                mockRequest.provider.access_token
            );
        });

        it('should return the model data', () => {
            expect(result).to.deep.equal(mockRequest.params.model);
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
            beforeEach(async () => {
                sinon.stub(threatModelRepository, 'createAsync').resolves(modelInfo.model);
                await threatModelController.create(mockRequest, mockResponse);
            });

            it('should create the specified model', () => {
                expect(threatModelRepository.createAsync).to.have.been.calledWith(
                    modelInfo,
                    mockRequest.user.accessToken,
                );
            });

            it('should return the model data', () => {
                expect(mockResponse.send).to.have.been.calledWith(mockRequest.params.model);
            });
        });

        describe('with error', () => {
            beforeEach(async () => {
                sinon.stub(threatModelRepository, 'createAsync').throws(err);
                await threatModelController.create(mockRequest, mockResponse);
            });

            it('should return a 500 error if if fails to create the model', () => {
                expect(mockResponse.status).to.have.been.calledWith(500);
            });

            it('should return the error', () => {
                expect(mockResponse.json).to.have.been.calledWith({
                    status: 500,
                    message: 'Internal Server Error',
                    details: 'Error creating model'
                });
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
            beforeEach(async () => {
                sinon.stub(threatModelRepository, 'updateAsync').resolves(mockRequest.params.model);
                await threatModelController.update(mockRequest, mockResponse);
            });

            it('should update the specified model', () => {
                expect(threatModelRepository.updateAsync).to.have.been.calledWith(
                    modelInfo,
                    mockRequest.user.accessToken
                );
            });

            it('should return the model data', () => {
                expect(mockResponse.send).to.have.been.calledWith(mockRequest.params.model);
            });
        });

        describe('with error', () => {
            beforeEach(async () => {
                sinon.stub(threatModelRepository, 'updateAsync').throws(err);
                await threatModelController.update(mockRequest, mockResponse);
            });

            it('should return a 500 error if if fails to update the model', () => {
                expect(mockResponse.status).to.have.been.calledWith(500);
            });

            it('should return the error', () => {
                expect(mockResponse.json).to.have.been.calledWith({
                    status: 500,
                    message: 'Internal Server Error',
                    details: 'Error updating model'
                });
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
            beforeEach(async () => {
                sinon.stub(threatModelRepository, 'deleteAsync').resolves(mockRequest.params.model);
                await threatModelController.deleteModel(mockRequest, mockResponse);
            });

            it('should delete the specified model', () => {
                expect(threatModelRepository.deleteAsync).to.have.been.calledWith(
                    modelInfo,
                    mockRequest.user.accessToken
                );
            });

            it('should return data', () => {
                expect(mockResponse.send).to.have.been.calledWith(mockRequest.params.model);
            });
        });

        describe('with error', () => {

            beforeEach(async () => {
                sinon.stub(threatModelRepository, 'deleteAsync').throws(err);
                await threatModelController.deleteModel(mockRequest, mockResponse);
            });

            it('should return a 500 error if if fails to delete the model', () => {
                expect(mockResponse.status).to.have.been.calledWith(500);
            });

            it('should return the error', () => {
                expect(mockResponse.json).to.have.been.calledWith({
                    status: 500,
                    message: 'Internal Server Error',
                    details: 'Error deleting model'
                });
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
                sinon.stub(threatModelRepository, 'reposAsync').resolves([repos, headers]);
                sinon.stub(threatModelRepository, 'branchesAsync').resolves([[], []]);
            });

            it('should enable next and disable prev', async () => {
                headers.link = 'url1; rel="next", url2; rel="link"';
                const resp = await threatModelController.repos(mockRequest, mockResponse);
                expect(resp.pagination).to.deep.equal({
                    page: mockRequest.query.page,
                    prev: false,
                    next: true
                });
            });

            it('should enable next and enable prev', async () => {
                headers.link = 'url1; rel="next", url2; rel="prev"';
                const resp = await threatModelController.repos(mockRequest, mockResponse);
                expect(resp.pagination).to.deep.equal({
                    page: mockRequest.query.page,
                    prev: true,
                    next: true
                });
            });
            
            it('should disable next and enable prev', async () => {
                headers.link = 'url1; rel="link", url2; rel="prev"';
                const resp = await threatModelController.repos(mockRequest, mockResponse);
                expect(resp.pagination).to.deep.equal({
                    page: mockRequest.query.page,
                    prev: true,
                    next: false
                });
            });
            
            it('should disable next and disable prev', async () => {
                headers.link = 'url1; rel="link", url2; rel="link"';
                const resp = await threatModelController.repos(mockRequest, mockResponse);
                expect(resp.pagination).to.deep.equal({
                    page: mockRequest.query.page,
                    prev: false,
                    next: false
                });
            });

            it('should select repos page 1 if not specified', async () => {
                mockRequest.query.page = '';
                await threatModelController.repos(mockRequest, mockResponse);
                expect(threatModelRepository.reposAsync).to.have.been.calledWith(1, sinon.match.any);
            });

            it('should select branches page 1 if not specified', async () => {
                mockRequest.query.page = '';
                await threatModelController.branches(mockRequest, mockResponse);
                expect(threatModelRepository.branchesAsync).to.have.been.calledWith(
                    sinon.match({ page: 1 }),
                    sinon.match.any
                );
            });
        });
    });
});