import {expect} from 'chai';
import sinon from 'sinon';


import env from '../../src/env/Env.js';
import * as threatModelRepository from '../../src/repositories/gitlabrepo.js';
import {GitlabClientWrapper} from "../../src/repositories/gitlabrepo.js";
import {getClient, userAsync} from '../../src/repositories/gitlabrepo.js';

describe('repositories/gitlabrepo.js', () => {
    const workspace = 'threat-workspace';
    const repoPath = 'ThreatDragonModels';

    const info = {
        body: {
            content: 'test content',
            id: 1
        },
        ref: 'main',
        branch: 'testBranch',
        organisation: 'test org',
        page: 'testPage',
        listBranches: { page: 'repoInfo.page', showExpanded: true },        
        branchInfo: { path: repoPath, ref: 'main' },
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
        Users: {
            showCurrentUser: sinon.stub().returns(Promise.resolve({data: {}}))
        },
        Projects: {
            all: sinon.stub().returns(Promise.resolve({
                    data:
                        [
                            {path_with_namespace: 'Threat-Workspace/Repo1'},
                            {path_with_namespace: 'Threat-Workspace/Repo2'},
                            {path_with_namespace: 'Threat-Workspace/Repo3'},
],
                    paginationInfo: {next: null, previous: null}
                }
            )),
            getBranch: sinon.stub().returns(Promise.resolve({data: {target: {hash: info.readInfo.commit}}})),
            listBranches: sinon.stub().returns(Promise.resolve({data: {values: []}})),
        },
        Branches: {
            all: sinon.stub().returns(Promise.resolve({
                data: [],
                paginationInfo: {next: 3, previous: 1}

            })),
            create: sinon.stub().returns(Promise.resolve({

            })),
        },
        Repositories : {
            allRepositoryTrees : sinon.stub().returns(Promise.resolve({
                data: [],
                paginationInfo: {next: 3, previous: 1}

            })),
        },
        RepositoryFiles: {
            show : sinon.stub().returns(Promise.resolve({
                data: [],
                paginationInfo: {next: null, previous: null}

            })),
            create : sinon.stub().returns(Promise.resolve({
                data: [],
                paginationInfo: {next: null, previous: null}

            })),
            edit : sinon.stub().returns(Promise.resolve({
                data: [],
                paginationInfo: {next: null, previous: null}

            })),
            remove : sinon.stub().returns(Promise.resolve({
                data: [],
                paginationInfo: {next: null, previous: null}

            })),
        },

    };

    const clientOptions = {
        auth: {
            oauthToken: accessToken,
        },
    };


    beforeEach(() => {
        sinon.stub(GitlabClientWrapper, 'getClient').returns(mockClient);
    });

    describe('getClient', () => {
        beforeEach(async () => {

        });

        it('creates the gitlab client', async () => {
            sinon.stub(env, 'get').returns({config: {GITLAB_WORKSPACE: workspace, GITLAB_REPO_ROOT_DIRECTORY: repoPath}});
            await threatModelRepository.getClient(accessToken);
            expect(GitlabClientWrapper.getClient).to.have.been.calledWith(clientOptions.auth);
        });

    });

    describe('userAsync', () => {
        beforeEach(async () => {


        });

        it('creates the gitlab client', () => {
             threatModelRepository.userAsync(accessToken);
            sinon.stub(env, 'get').returns({config: {}});
            expect(GitlabClientWrapper.getClient).to.have.been.calledWith(clientOptions.auth);

        });
    });

    describe('reposAsync', () => {
        beforeEach(async () => {
            sinon.stub(env, 'get').returns({
                config: {
                    GITLAB_CLIENT_ID: '12345678',
                    GITLAB_CLIENT_SECRET: '098765432109865432',
                    GITLAB_REDIRECT_URI: 'http://localhost:3000/api/oauth/return'
                }
            });
            await threatModelRepository.reposAsync(info.page, accessToken);
        });

        it('creates the client', () => {
            expect(GitlabClientWrapper.getClient).to.have.been.calledWith(clientOptions.auth);
        });

        it('calls repository list', () => {
            expect(mockClient.Projects.all).to.have.been.called;
        });

        // Setup the transformed data
        const transformedReposData = [
            {full_name: 'Threat-Workspace/Repo1', path_with_namespace: 'Threat-Workspace/Repo1'},
            {full_name: 'Threat-Workspace/Repo2', path_with_namespace: 'Threat-Workspace/Repo2'},
            {full_name: 'Threat-Workspace/Repo3', path_with_namespace: 'Threat-Workspace/Repo3'},
        ];

        it('transforms the repos data correctly', async () => {
            // Call the reposAsync function
            const [repos] = await threatModelRepository.reposAsync(1, accessToken);

            // Check that the returned data is transformed correctly
            expect(repos).to.deep.equal(transformedReposData);
        });

    });

    describe('branchesAsync', () => {
        const repoInfo = {page: info.listBranches.page, repo: "repo", organisation: "org"};
        beforeEach(async () => {
            sinon.stub(env, 'get').returns({config: {GITLAB_WORKSPACE: workspace}});
            await threatModelRepository.branchesAsync(repoInfo, accessToken);
        });

        it('creates the client', () => {
            expect(GitlabClientWrapper.getClient).to.have.been.calledWith(clientOptions.auth);
        });

        it('gets the repo', () => {
            expect(mockClient.Branches.all).to.have.been.calledWith("org/repo", info.listBranches);
        });

    });

    describe('modelsAsync', () => {
        const branchInfo = {branch: "main", repo: "repo"};

        beforeEach(async () => {
            sinon.stub(env, 'get').returns({config: {GITLAB_WORKSPACE: workspace, GITLAB_REPO_ROOT_DIRECTORY: repoPath}});
            await threatModelRepository.modelsAsync(branchInfo, accessToken);
        });

        it('creates the client', () => {
            expect(GitlabClientWrapper.getClient).to.have.been.calledWith(clientOptions.auth);
        });

        it('should get the branch contents', () => {
            expect(mockClient.Repositories.allRepositoryTrees).to.have.been.calledWith("undefined/repo", info.branchInfo);
        });
    });

    describe('modelAsync', () => {
        const modelInfo = {page: info.listBranches.page, repo: "repo", organisation: "org", model: "model"};

        beforeEach(async () => {
            sinon.stub(env, 'get').returns({config: {GITLAB_WORKSPACE: workspace, GITLAB_REPO_ROOT_DIRECTORY: repoPath}});
            await threatModelRepository.modelAsync(modelInfo, accessToken);
        });

        it('creates the client', () => {
            expect(GitlabClientWrapper.getClient).to.have.been.calledWith(clientOptions.auth);
        });

        it('should get the contents', () => {
            expect(mockClient.RepositoryFiles.show).to.have.been.calledWith("org/repo", "ThreatDragonModels/model/model.json");
        });

    });

    describe('createAsync', () => {
        const createAysncInfo = {
            branch: info.createAsync.name,
            repo: info.createAsync.repo_slug,
            model: info.createAsync.model,
            body: info.createAsync.body,
            organisation: "org"
        };

        beforeEach(async () => {
            sinon.stub(env, 'get').returns({config: {GITLAB_WORKSPACE: workspace, GITLAB_REPO_ROOT_DIRECTORY: repoPath}});
            await threatModelRepository.createAsync(createAysncInfo, accessToken);
        });

        it('creates the client', () => {
            expect(GitlabClientWrapper.getClient).to.have.been.calledWith(clientOptions.auth);
        });


        it('create the file', () => {
            expect(mockClient.RepositoryFiles.create).to.have.been.calledWith(
                "org/repoInfo.repo",
                "ThreatDragonModels/my model/my model.json",
                "branch_name",
                "{\n  \"content\": \"test content\",\n  \"id\": 1\n}",
                "Created by OWASP Threat Dragon",

        );
        });
    });

    describe('updateAsync', () => {

        const updateAysncInfo = {
            branch: info.createAsync.name,
            repo: info.createAsync.repo_slug,
            model: info.createAsync.model,
            body: info.createAsync.body,
            organisation: "org"

        };

        beforeEach(async () => {
            sinon.stub(env, 'get').returns({config: {GITLAB_WORKSPACE: workspace, GITLAB_REPO_ROOT_DIRECTORY: repoPath}});
            await threatModelRepository.updateAsync(updateAysncInfo, accessToken);
        });


        it('creates the client', () => {
            expect(GitlabClientWrapper.getClient).to.have.been.calledWith(clientOptions.auth);
        });


        it('update the file', () => {
            expect(mockClient.RepositoryFiles.edit).to.have.been.calledWith(
                "org/repoInfo.repo",
                "ThreatDragonModels/my model/my model.json",
                "branch_name",
                "{\n  \"content\": \"test content\",\n  \"id\": 1\n}",
                "Updated by OWASP Threat Dragon",

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
            sinon.stub(env, 'get').returns({config: {GITLAB_WORKSPACE: workspace}});
            await threatModelRepository.createBranchAsync(info, accessToken);
        });
        it('create a new branch', () => {
            expect(mockClient.Branches.create).to.have.been.calledWith(`${info.organisation}/${info.repo}`, info.branch, info.ref);
        });
    });
});