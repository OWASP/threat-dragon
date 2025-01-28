import {expect} from 'chai';
import sinon from 'sinon';


import env from '../../src/env/Env.js';
import * as threatModelRepository from '../../src/repositories/bitbucketrepo.js';
import {BitbucketClientWrapper} from "../../src/repositories/bitbucketrepo.js";
import {getClient, userAsync} from '../../src/repositories/bitbucketrepo.js';

describe('repositories/bitbucketrepo.js', () => {
    const workspace = 'threat-workspace';
    const repoPath = 'ThreatDragonModels';

    const info = {
        body: {
            content: 'test content',
            id: 1
        },
        branch: 'testBranch',
        organisation: 'test org',
        page: 'testPage',
        repo: 'test repo',
        ref: 'testRef',
        listBranches: {
            workspace: workspace,
            repo_slug: 'repoInfo.repo',
            page: 'repoInfo.page',
            pagelen: 10
        },
        branchInfo: {
            workspace: workspace,
            repo_slug: 'repoInfo.repo',
            name: 'branch_name'
        },
        readInfo: {
            path: repoPath,
            workspace: workspace,
            repo_slug: 'repoInfo.repo',
            commit: '123'
        },
        modelReadInfo: {
            path: `${repoPath}/my model/my model.json`,
            workspace: workspace,
            repo_slug: 'repoInfo.repo',
            commit: '123'
        },
        modelInfo: {
            repo_slug: 'repoInfo.repo',
            name: 'branch_name',
            model: 'my model'
        },
        createAsync: {
            repo_slug: 'repoInfo.repo',
            name: 'branch_name',
            model: 'my model',
            data: "abc",
            body: {
                content: 'test content',
                id: 1
            }
        },

    };
    const accessToken = 'access token';

    const mockClient = {
        repositories: {
            list: sinon.stub().returns(Promise.resolve({
                data: {
                    values: [
                        {full_name: 'Threat-Workspace/Repo1'},
                        {full_name: 'Threat-Workspace/Repo2'},
                        {full_name: 'Threat-Workspace/Repo3'},
]
                }
            })),
            getBranch: sinon.stub().returns(Promise.resolve({data: {target: {hash: info.readInfo.commit}}})),
            listBranches: sinon.stub().returns(Promise.resolve({data: {values: []}})),
        },
        source: {
            read: function () {
            },
            createFileCommit: sinon.stub().returns(Promise.resolve({data: {values: []}})),
        },
        users: {
            getAuthedUser: sinon.stub().returns(Promise.resolve({data: {id: 1, username: 'Test User'}})),
        },
        refs:{
            createBranch: sinon.stub().returns(Promise.resolve({data: {values: []}})),
        }
    };

    const clientOptions = {
        auth: {
            token: accessToken,
        },
    };


    beforeEach(() => {
        sinon.stub(BitbucketClientWrapper, 'getClient').returns(mockClient);
    });

    describe('getClient', () => {
        beforeEach(async () => {

        });

        it('creates the bitbucket client', async () => {
            sinon.stub(env, 'get').returns({config: {BITBUCKET_WORKSPACE: workspace}});
            await threatModelRepository.getClient(accessToken);
            expect(BitbucketClientWrapper.getClient).to.have.been.calledWith(clientOptions);
        });

        it('throws an error for enterprise', async () => {
            sinon.stub(env, 'get').returns({
                config: {
                    BITBUCKET_WORKSPACE: workspace,
                    BITBUCKET_ENTERPRISE_HOSTNAME: "ENTERPRISE"
                }
            });
            expect(() => threatModelRepository.getClient(accessToken)).to.throw('Bitbucket Enterprise is not supported yet');
        });
    });

    describe('userAsync', () => {
        beforeEach(async () => {


        });

        it('creates the bitbucket client', () => {
            threatModelRepository.userAsync(accessToken);
            sinon.stub(env, 'get').returns({config: {BITBUCKET_WORKSPACE: workspace}});
            expect(BitbucketClientWrapper.getClient).to.have.been.calledWith(clientOptions);

        });
    });

    describe('reposAsync', () => {
        beforeEach(async () => {
            sinon.stub(env, 'get').returns({config: {BITBUCKET_WORKSPACE: workspace}});
            await threatModelRepository.reposAsync(info.page, accessToken);
        });

        it('creates the client', () => {
            expect(BitbucketClientWrapper.getClient).to.have.been.calledWith(clientOptions);
        });

        it('calls repository list', () => {
            expect(mockClient.repositories.list).to.have.been.called;
        });

        // Setup the transformed data
        const transformedReposData = [
            {full_name: 'repo1'},
            {full_name: 'repo2'},
            {full_name: 'repo3'},
        ];

        it('transforms the repos data correctly', async () => {
            // Call the reposAsync function
            const [repos] = await threatModelRepository.reposAsync(1, accessToken);

            // Check that the returned data is transformed correctly
            expect(repos).to.deep.equal(transformedReposData);
        });

    });

    describe('branchesAsync', () => {
        const repoInfo = {page: info.listBranches.page, repo: info.listBranches.repo_slug};

        beforeEach(async () => {
            sinon.stub(env, 'get').returns({config: {BITBUCKET_WORKSPACE: workspace}});
            await threatModelRepository.branchesAsync(repoInfo, accessToken);
        });

        it('creates the client', () => {
            expect(BitbucketClientWrapper.getClient).to.have.been.calledWith(clientOptions);
        });

        it('gets the repo', () => {
            expect(mockClient.repositories.listBranches).to.have.been.calledWith(info.listBranches);
        });

    });

    describe('modelsAsync', () => {
        const branchInfo = {branch: info.branchInfo.name, repo: info.branchInfo.repo_slug};

        beforeEach(async () => {
            sinon.stub(env, 'get').returns({config: {BITBUCKET_WORKSPACE: workspace, BITBUCKET_REPO_ROOT_DIRECTORY: repoPath}});
            sinon.stub(mockClient.source, 'read').returns(Promise.resolve({data: {values: [
{path: 'ThreatDragonModels/model1'},
                        {path: 'ThreatDragonModels/model2'},
                        {path: 'ThreatDragonModels/model3'}
]}}));
            await threatModelRepository.modelsAsync(branchInfo, accessToken);
        });

        it('creates the client', () => {
            expect(BitbucketClientWrapper.getClient).to.have.been.calledWith(clientOptions);
        });

        it('should get the branch', () => {
            expect(mockClient.repositories.getBranch).to.have.been.calledWith(info.branchInfo);
        });

        it('should get the contents', () => {
            expect(mockClient.source.read).to.have.been.calledWith(info.readInfo);
        });


        it('transforms the models data correctly', async () => {
            // Call the modelsAsync function
            const [models] = await threatModelRepository.modelsAsync(branchInfo, accessToken);

            // Setup the transformed data
            const transformedModelsData = [
                {name: 'model1', path: 'ThreatDragonModels/model1'},
                {name: 'model2', path: 'ThreatDragonModels/model2'},
                {name: 'model3', path: 'ThreatDragonModels/model3'}
            ];

            // Check that the returned data is transformed correctly
            expect(models).to.deep.equal(transformedModelsData);
        });

    });

    describe('modelAsync', () => {
        const modelInfo = {branch: info.modelInfo.name, repo: info.modelInfo.repo_slug, model: info.modelInfo.model};

        beforeEach(async () => {
            sinon.stub(env, 'get').returns({config: {BITBUCKET_WORKSPACE: workspace, BITBUCKET_REPO_ROOT_DIRECTORY: repoPath}});
            sinon.stub(mockClient.source, 'read').returns(Promise.resolve({data: "m34o1m"}));
            await threatModelRepository.modelAsync(modelInfo, accessToken);
        });

        it('creates the client', () => {
            expect(BitbucketClientWrapper.getClient).to.have.been.calledWith(clientOptions);
        });

        it('should get the branch', () => {
            expect(mockClient.repositories.getBranch).to.have.been.calledWith(info.branchInfo);
        });

        it('should get the contents', () => {
            expect(mockClient.source.read).to.have.been.calledWith(info.modelReadInfo);
        });

    });

    describe('createAsync', () => {
        const createAysncInfo = {
            branch: info.createAsync.name,
            repo: info.createAsync.repo_slug,
            model: info.createAsync.model,
            body: info.createAsync.body
        };

        const createFileCommitInfo = {
            'ThreatDragonModels/my model/my model.json': JSON.stringify(createAysncInfo.body, null, '  '),
            repo_slug: createAysncInfo.repo,
            files: 'ThreatDragonModels/my model/my model.json',
            branch: createAysncInfo.branch,
            workspace: workspace,
            message: 'Created by OWASP Threat Dragon',

        };
        beforeEach(async () => {
            sinon.stub(env, 'get').returns({config: {BITBUCKET_WORKSPACE: workspace, BITBUCKET_REPO_ROOT_DIRECTORY: repoPath}});
            await threatModelRepository.createAsync(createAysncInfo, accessToken);
        });

        it('creates the client', () => {
            expect(BitbucketClientWrapper.getClient).to.have.been.calledWith(clientOptions);
        });


        it('create the file', () => {
            expect(mockClient.source.createFileCommit).to.have.been.calledWith(
                createFileCommitInfo
            );
        });
    });

    describe('updateAsync', () => {

        const updateAysncInfo = {
            branch: info.createAsync.name,
            repo: info.createAsync.repo_slug,
            model: info.createAsync.model,
            body: info.createAsync.body
        };

        const updateFileCommitInfo = {
            'ThreatDragonModels/my model/my model.json': JSON.stringify(updateAysncInfo.body, null, '  '),
            repo_slug: updateAysncInfo.repo,
            files: 'ThreatDragonModels/my model/my model.json',
            branch: updateAysncInfo.branch,
            workspace: workspace,
            message: 'Created by OWASP Threat Dragon',

        };

        beforeEach(async () => {
            sinon.stub(env, 'get').returns({config: {BITBUCKET_WORKSPACE: workspace, BITBUCKET_REPO_ROOT_DIRECTORY: repoPath}});
            await threatModelRepository.updateAsync(updateAysncInfo, accessToken);
        });


        it('creates the client', () => {
            expect(BitbucketClientWrapper.getClient).to.have.been.calledWith(clientOptions);
        });


        it('update the file', () => {
            expect(mockClient.source.createFileCommit).to.have.been.calledWith(
                updateFileCommitInfo
            );
        });
    });


    describe('deleteAsync', () => {

        it('throws an error', async () => {
            expect(threatModelRepository.deleteAsync(info, accessToken)).to.eventually.throw();
        });

    });

    describe('create branch', () => {
        beforeEach(async () => {
            sinon.stub(env, 'get').returns({config: {BITBUCKET_WORKSPACE: workspace, BITBUCKET_REPO_ROOT_DIRECTORY: repoPath}});
            await threatModelRepository.createBranchAsync(info, accessToken);
        });
        it('creates a new branch', () => {
            expect(mockClient.refs.createBranch).to.have.been.calledWith(
                {
                    _body: { name: info.branch, target: { hash: info.ref } },
                    repo_slug: info.repo,
                    workspace: workspace
                }
            );
        });
    });

});

