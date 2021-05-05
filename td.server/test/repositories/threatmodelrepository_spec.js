import { expect } from 'chai';
import github from 'octonode';
import sinon from 'sinon';

import threatModelRepository from '../../src/repositories/threatmodelrepository.js';

describe('threatmodel repository tests', () => {
    const accessToken = 'access token';
    const testPage = 'testPage'

    let mockCb;

    const mockClient = {
        me: () => {},
        repo: () => {}
    };

    beforeEach(() => {
        mockCb = sinon.spy();
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should fetch the logged in users repos', () => {
        const mockMe = { repos: () => {} };
        sinon.stub(mockClient, 'me').returns(mockMe);
        sinon.stub(github, 'client').returns(mockClient);
        sinon.spy(mockMe, 'repos');
        threatModelRepository.repos(testPage, accessToken, mockCb);

        expect(github.client).to.have.been.calledWith(accessToken);
        expect(mockMe.repos).to.have.been.calledWith(testPage, mockCb);
    });
    
    it('should fetch the branches for the specified repo', () => {
        const info = {
            organisation: 'test org',
            repo: 'test repo',
            page: testPage
        };

        const mockRepo = { branches: () => {} };
        sinon.stub(mockClient, 'repo').returns(mockRepo);
        sinon.stub(github, 'client').returns(mockClient);
        sinon.spy(mockRepo, 'branches');

        threatModelRepository.branches(info, accessToken, mockCb);
        
        expect(github.client).to.have.been.calledWith(accessToken);
        expect(mockClient.repo).to.have.been.calledWith(`${info.organisation}/${info.repo}`);
        expect(mockRepo.branches).to.have.been.calledWith(info.page, mockCb);
    });
    
    it('should fetch the models for the specified repo and branch', () => {
        const info = {
            organisation: 'test org',
            repo: 'test repo',
            branch: 'test branch'
        };

        const mockRepo = { contents: () => {} };
        sinon.stub(mockClient, 'repo').returns(mockRepo);
        sinon.stub(github, 'client').returns(mockClient);
        sinon.spy(mockRepo, 'contents');

        threatModelRepository.models(info, accessToken, mockCb);

        expect(github.client).to.have.been.calledWith(accessToken);
        expect(mockClient.repo).to.have.been.calledWith(`${info.organisation}/${info.repo}`);
        expect(mockRepo.contents).to.have.been.calledWith('ThreatDragonModels', info.branch, mockCb);
    });

    it('should fetch the specified model', () => {
        const info = {
            organisation: 'test org',
            repo: 'test repo',
            branch: 'test branch',
            model: 'test model'
        };
        const modelPath = `ThreatDragonModels/${info.model}/${info.model}.json`;

        const mockRepo = { contents: () => {} };
        sinon.stub(mockClient, 'repo').returns(mockRepo);
        sinon.stub(github, 'client').returns(mockClient);
        sinon.spy(mockRepo, 'contents');

        threatModelRepository.model(info, accessToken, mockCb);

        expect(github.client).to.have.been.calledWith(accessToken);
        expect(mockClient.repo).to.have.been.calledWith(`${info.organisation}/${info.repo}`);
        expect(mockRepo.contents).to.have.been.calledWith(modelPath, info.branch, mockCb);
    });

    it('should create the specified model', () => {
        const info = {
            organisation: 'test org',
            repo: 'test repo',
            branch: 'test branch',
            model: 'test model',
            body: {
                content: 'test content',
                id: 1
            }
        };
        const modelPath = `ThreatDragonModels/${info.model}/${info.model}.json`;

        const mockRepo = { createContents: () => {} };
        sinon.stub(mockClient, 'repo').returns(mockRepo);
        sinon.stub(github, 'client').returns(mockClient);
        sinon.spy(mockRepo, 'createContents');

        threatModelRepository.create(info, accessToken, mockCb);

        expect(github.client).to.have.been.calledWith(accessToken);
        expect(mockClient.repo).to.have.been.calledWith(`${info.organisation}/${info.repo}`);
        expect(mockRepo.createContents).to.have.been.calledWith(
            modelPath,
            'Created by OWASP Threat Dragon',
            JSON.stringify(info.body, null, '  '),
            info.branch,
            mockCb
        );
    });

    describe('update', () => {
        const info = {
            organisation: 'test org',
            repo: 'test repo',
            branch: 'test branch',
            model: 'test model',
            body: {
                content: 'test content',
                id: 1
            }
        };
        const modelPath = `ThreatDragonModels/${info.model}/${info.model}.json`;

        describe('with error', () => {
            const err = new Error('whoops!');

            beforeEach(() => {
                const modelMock = (mInfo, token, cb) => { cb(err); };
                sinon.stub(threatModelRepository, 'model').callsFake(modelMock);

                threatModelRepository.update(info, accessToken, mockCb);
            });

            it('calls the callback with an error', () => {
                expect(mockCb).to.have.been.calledWith(err);
            });
        });

        describe('without error', () => {
            const content = {
                sha: 'asdf'
            };
            let mockRepo;

            beforeEach(() => {
                const modelMock = (mInfo, token, cb) => { cb(null, content); };
                mockRepo = { updateContents: () => {} };
                sinon.stub(threatModelRepository, 'model').callsFake(modelMock);
                sinon.stub(github, 'client').returns(mockClient);
                sinon.stub(mockClient, 'repo').returns(mockRepo);
                sinon.spy(mockRepo, 'updateContents');

                threatModelRepository.update(info, accessToken, mockCb);
            });

            it('creates a github client', () => {
                expect(github.client).to.have.been.calledWith(accessToken);
            });

            it('calls client.repo', () => {
                expect(mockClient.repo).to.have.been.calledWith(`${info.organisation}/${info.repo}`);
            });

            it('calls repo.updateContents', () => {
                expect(mockRepo.updateContents).to.have.been.calledWith(
                    modelPath,
                    'Updated by OWASP Threat Dragon',
                    JSON.stringify(info.body, null, '  '),
                    content.sha,
                    info.branch,
                    mockCb
                );
            });
        });
    });


    describe('delete', () => {
        const info = {
            organisation: 'test org',
            repo: 'test repo',
            branch: 'test branch',
            model: 'test model',
            body: {
                content: 'test content',
                id: 1
            }
        };
        const modelPath = `ThreatDragonModels/${info.model}/${info.model}.json`;

        describe('with error', () => {
            const err = new Error('whoops!');

            beforeEach(() => {
                const modelMock = (mInfo, token, cb) => { cb(err); };
                sinon.stub(threatModelRepository, 'model').callsFake(modelMock);

                threatModelRepository.deleteModel(info, accessToken, mockCb);
            });

            it('calls the callback with an error', () => {
                expect(mockCb).to.have.been.calledWith(err);
            });
        });

        describe('without error', () => {
            const content = {
                sha: 'asdf'
            };
            let mockRepo;

            beforeEach(() => {
                const modelMock = (mInfo, token, cb) => { cb(null, content); };
                mockRepo = { deleteContents: () => {} };
                sinon.stub(threatModelRepository, 'model').callsFake(modelMock);
                sinon.stub(github, 'client').returns(mockClient);
                sinon.stub(mockClient, 'repo').returns(mockRepo);
                sinon.spy(mockRepo, 'deleteContents');

                threatModelRepository.deleteModel(info, accessToken, mockCb);
            });

            it('creates a github client', () => {
                expect(github.client).to.have.been.calledWith(accessToken);
            });

            it('calls client.repo', () => {
                expect(mockClient.repo).to.have.been.calledWith(`${info.organisation}/${info.repo}`);
            });

            it('calls repo.deleteContents', () => {
                expect(mockRepo.deleteContents).to.have.been.calledWith(
                    modelPath,
                    'Deleted by OWASP Threat Dragon',
                    content.sha,
                    info.branch,
                    mockCb
                );
            });
        });
    });
});