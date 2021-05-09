import { allProviders } from '@/service/providers.js';
import datasourceModule from '@/store/modules/datasource.js';
import {
    DATASOURCE_PROVIDER_SELECTED,
    DATASOURCE_PROVIDER_CLEAR,
    DATASOURCE_REPOSITORY_FETCH,
    DATASOURCE_REPOSITORY_SELECTED,
    DATASOURCE_REPOSITORY_CLEAR,
    DATASOURCE_BRANCH_FETCH,
    DATASOURCE_BRANCH_SELECTED,
    DATASOURCE_BRANCH_CLEAR,
    DATASOURCE_THREATMODELS_FETCH,
    DATASOURCE_THREATMODEL_SELECTED,
    DATASOURCE_THREATMODEL_CLEAR
} from '@/store/actions/datasource.js';
import threatmodelApi from '@/service/threatmodelApi.js';
import datasource from '../../../../src/store/modules/datasource';

describe('store/modules/datasource.js', () => {
    const mocks = {
        commit: () => {},
        rootState: {
            auth: {
                jwt: 'foo'
            }
        }
    };

    beforeEach(() => {
        jest.spyOn(mocks, 'commit');
    });

    describe('state', () => {
        it('is an object', () => {
            expect(datasourceModule.state).toBeInstanceOf(Object);
        });

        it('has a provider property', () => {
            expect(datasourceModule.state.provider).not.toBeUndefined();
        });

        it('has a repos property', () => {
            expect(datasourceModule.state.repos).not.toBeUndefined();
        });

        it('has a branches property', () => {
            expect(datasourceModule.state.branches).not.toBeUndefined();
        });

        it('has a models property', () => {
            expect(datasourceModule.state.models).not.toBeUndefined();
        });

        it('has a threatModel property', () => {
            expect(datasourceModule.state.threatModel).not.toBeUndefined();
        });
    });

    describe('actions', () => {
        describe('provider', () => {

            describe('clear', () => {
                it('is a function', () => {
                    expect(datasourceModule.actions[DATASOURCE_PROVIDER_CLEAR]).toBeInstanceOf(Function);
                });
    
                it('commits PROVIDER_CLEAR', () => {
                    datasourceModule.actions[DATASOURCE_PROVIDER_CLEAR](mocks);
                    expect(mocks.commit).toHaveBeenCalledWith(DATASOURCE_PROVIDER_CLEAR);
                });
            });

            describe('selected', () => {
                it('is a function', () => {
                    expect(datasourceModule.actions[DATASOURCE_PROVIDER_SELECTED]).toBeInstanceOf(Function);
                });
    
                it('commits the provider', () => {
                    const provider = 'foobar';
                    datasourceModule.actions[DATASOURCE_PROVIDER_SELECTED](mocks, provider);
                    expect(mocks.commit).toHaveBeenCalledWith(DATASOURCE_PROVIDER_SELECTED, provider);
                });
            });
        });

        describe('repository', () => {
            describe('fetch', () => {
                const resp = {
                    data: {
                        repos: [ 'foo', 'bar' ]
                    }
                };

                beforeEach(async () => {
                    jest.spyOn(threatmodelApi, 'reposAsync').mockResolvedValue(resp);
                    await datasourceModule.actions[DATASOURCE_REPOSITORY_FETCH](mocks);
                });

                it('calls the repos api', () => {
                    expect(threatmodelApi.reposAsync).toHaveBeenCalledWith(mocks.rootState.auth.jwt);
                });

                it('commits the repositories', () => {
                    expect(mocks.commit).toHaveBeenCalledWith(
                        DATASOURCE_REPOSITORY_FETCH,
                        resp.data.repos
                    );
                });
            });

            describe('selected', () => {
                it('is a function', () => {
                    expect(datasourceModule.actions[DATASOURCE_REPOSITORY_SELECTED]).toBeInstanceOf(Function);
                });
    
                it('commits the repository', () => {
                    const repository = 'foobar';
                    datasourceModule.actions[DATASOURCE_REPOSITORY_SELECTED](mocks, repository);
                    expect(mocks.commit).toHaveBeenCalledWith(DATASOURCE_REPOSITORY_SELECTED, repository);
                });
            });
    
            describe('clear', () => {
                it('is a function', () => {
                    expect(datasourceModule.actions[DATASOURCE_REPOSITORY_CLEAR]).toBeInstanceOf(Function);
                });
    
                it('commits REPOSITORY_CLEAR', () => {
                    datasourceModule.actions[DATASOURCE_REPOSITORY_CLEAR](mocks);
                    expect(mocks.commit).toHaveBeenCalledWith(DATASOURCE_REPOSITORY_CLEAR);
                });
            });
        });

        describe('branch', () => {

            describe('fetch', () => {
                const resp = {
                    data: {
                        branches: [ 'branch1', 'branch2' ]
                    }
                };
                const repo = 'foobar';

                beforeEach(async () => {
                    jest.spyOn(threatmodelApi, 'branchesAsync').mockResolvedValue(resp);
                    await datasourceModule.actions[DATASOURCE_BRANCH_FETCH](mocks, repo);
                });

                it('calls the branches api', () => {
                    expect(threatmodelApi.branchesAsync).toHaveBeenCalledWith(repo, mocks.rootState.auth.jwt);
                });

                it('commits the branches', () => {
                    expect(mocks.commit).toHaveBeenCalledWith(
                        DATASOURCE_BRANCH_FETCH,
                        resp.data.branches
                    );
                });
            });

            describe('selected', () => {
                it('is a function', () => {
                    expect(datasourceModule.actions[DATASOURCE_BRANCH_SELECTED]).toBeInstanceOf(Function);
                });
    
                it('commits the branch', () => {
                    const branch = 'foobar';
                    jest.spyOn(mocks, 'commit');
                    datasourceModule.actions[DATASOURCE_BRANCH_SELECTED](mocks, branch);
                    expect(mocks.commit).toHaveBeenCalledWith(DATASOURCE_BRANCH_SELECTED, branch);
                });
            });
    
            describe('clear', () => {
                it('is a function', () => {
                    expect(datasourceModule.actions[DATASOURCE_BRANCH_CLEAR]).toBeInstanceOf(Function);
                });
    
                it('commits REPOSITORY_CLEAR', () => {
                    jest.spyOn(mocks, 'commit');
                    datasourceModule.actions[DATASOURCE_BRANCH_CLEAR](mocks);
                    expect(mocks.commit).toHaveBeenCalledWith(DATASOURCE_BRANCH_CLEAR);
                });
            });
        });

        describe('threatmodel', () => {

            describe('fetch', () => {
                const resp = {
                    data: [ 'blah', 'blah2' ]
                };
                const deets = {
                    repoName: 'repo',
                    branch: 'branch'
                };

                beforeEach(async () => {
                    jest.spyOn(threatmodelApi, 'modelsAsync').mockResolvedValue(resp);
                    await datasourceModule.actions[DATASOURCE_THREATMODELS_FETCH](mocks, deets);
                });

                it('calls the models api', () => {
                    expect(threatmodelApi.modelsAsync).toHaveBeenCalledWith(deets.repoName, deets.branch, mocks.rootState.auth.jwt);
                });

                it('commits the models', () => {
                    expect(mocks.commit).toHaveBeenCalledWith(
                        DATASOURCE_THREATMODELS_FETCH,
                        resp.data
                    );
                });
            });

            describe('selected', () => {
                const resp = {
                    data: {
                        foo: 'bar'
                    }
                };
                const deets = {
                    repoName: 'repo',
                    branch: 'branch',
                    threatModel: 'my awesome model'
                };

                beforeEach(async () => {
                    jest.spyOn(threatmodelApi, 'modelAsync').mockResolvedValue(resp);
                    await datasourceModule.actions[DATASOURCE_THREATMODEL_SELECTED](mocks, deets);
                });

                it('retrieves the threat model', () => {
                    expect(threatmodelApi.modelAsync).toHaveBeenCalledWith(
                        deets.repoName,
                        deets.branch,
                        deets.threatModel,
                        mocks.rootState.auth.jwt
                    );
                });
    
                it('commits the threatmodel', () => {
                    expect(mocks.commit).toHaveBeenCalledWith(DATASOURCE_THREATMODEL_SELECTED, resp.data);
                });
            });
    
            describe('clear', () => {
                it('is a function', () => {
                    expect(datasourceModule.actions[DATASOURCE_THREATMODEL_CLEAR]).toBeInstanceOf(Function);
                });
    
                it('commits THREATMODEL_CLEAR', () => {
                    jest.spyOn(mocks, 'commit');
                    datasourceModule.actions[DATASOURCE_THREATMODEL_CLEAR](mocks);
                    expect(mocks.commit).toHaveBeenCalledWith(DATASOURCE_THREATMODEL_CLEAR);
                });
            });
        });
    });

    describe('mutations', () => {
        afterEach(() => {
            datasourceModule.state.provider = '';
        });
        describe('provider', () => {
            describe('clear', () => {
                it('resets state.provider', () => {
                    datasourceModule.state.provider = 'foobar';
                    datasourceModule.state.foobar = {};
                    datasourceModule.mutations[DATASOURCE_PROVIDER_CLEAR](datasourceModule.state);
                    expect(datasourceModule.state.provider).toEqual('');
                });
            });
    
            describe('selected', () => {
                it('throws an error if an unrecognized provider is used', () => {
                    const fakeProvider = 'fake';
                    expect(
                        () => datasourceModule.mutations[DATASOURCE_PROVIDER_SELECTED](datasourceModule.state, fakeProvider)
                    ).toThrowError(`"${fakeProvider}" is not a recognized provider`);
                });
    
                it('sets the selected provider', () => {
                    const provider = allProviders.github;
                    datasourceModule.mutations[DATASOURCE_PROVIDER_SELECTED](datasourceModule.state, provider);
                    expect(datasourceModule.state.provider).toEqual(provider);
                });
    
                it('sets the provider config object', () => {
                    const provider = allProviders.github;
                    datasourceModule.mutations[DATASOURCE_PROVIDER_SELECTED](datasourceModule.state, provider);
                    expect(datasourceModule.state[provider]).toBeInstanceOf(Object);
                });
            });
        });

        describe('repository', () => {
            afterEach(() => {
                datasourceModule.state.provider = '';
                datasource.state.repos.length = 0;
                delete datasourceModule.state.github;
            });

            describe('fetch', () => {
                const repos = [ 'one', 'two', 'three' ];
                
                beforeEach(() => {
                    datasourceModule.mutations[DATASOURCE_REPOSITORY_FETCH](datasourceModule.state, repos);
                });

                it('sets the repos', () => {
                    expect(datasource.state.repos).toEqual(repos);
                });
            });
    
            describe('selected', () => {
                beforeEach(() => {
                    datasourceModule.state.provider = 'github';
                    datasourceModule.state.github = {};
                });
    
                it('sets the selected repo', () => {
                    const repo = 'foobar';
                    datasourceModule.mutations[DATASOURCE_REPOSITORY_SELECTED](datasourceModule.state, repo);
                    expect(datasourceModule.state.github.repositoryName).toEqual(repo);
                });
            });

            describe('clear', () => {
                it('resets state[provider].repository', () => {
                    datasourceModule.state.provider = 'github';
                    datasourceModule.state.github = {
                        repositoryName: 'foobar'
                    };
                    datasourceModule.mutations[DATASOURCE_REPOSITORY_CLEAR](datasourceModule.state);
                    expect(datasourceModule.state.github.repositoryName).toEqual('');
                });

                it('resets state[provider].branch', () => {
                    datasourceModule.state.provider = 'github';
                    datasourceModule.state.github = {
                        repositoryName: 'foobar',
                        branch: 'baz'
                    };
                    datasourceModule.mutations[DATASOURCE_REPOSITORY_CLEAR](datasourceModule.state);
                    expect(datasourceModule.state.github.branch).toEqual('');
                });
            });
        });

        describe('branch', () => {
            beforeEach(() => {
                datasourceModule.state.provider = 'github';
                datasourceModule.state.github = {
                    repositoryName: 'foobar'
                };
            });

            describe('fetch', () => {
                const branches = [ 'b1', 'b2' ];
                beforeEach(() => {
                    datasourceModule.mutations[DATASOURCE_BRANCH_FETCH](datasourceModule.state, branches);
                });

                afterEach(() => {
                    datasourceModule.state.branches.length = 0;
                })

                it('sets the branches', () => {
                    expect(datasourceModule.state.branches).toEqual(branches);
                });
            });
            
            describe('selected', () => {
                it('sets the selected repo', () => {
                    const branch = 'foobar';
                    datasourceModule.mutations[DATASOURCE_BRANCH_SELECTED](datasourceModule.state, branch);
                    expect(datasourceModule.state.github.branch).toEqual(branch);
                });
            });

            describe('clear', () => {
                it('resets state[provider].branch', () => {
                    datasourceModule.state.github.branch = 'baz';
                    datasourceModule.mutations[DATASOURCE_BRANCH_CLEAR](datasourceModule.state);
                    expect(datasourceModule.state.github.branch).toEqual('');
                });
            });
        });

        describe('threatmodel', () => {
            beforeEach(() => {
                datasourceModule.state.provider = 'github';
                datasourceModule.state.github = {};
                datasourceModule.state.models.length = 0;
                delete datasourceModule.state.threatModel;
            });

            describe('fetch', () => {
                const models = [ 'tm1', 'tm2' ];

                beforeEach(() => {
                    datasourceModule.mutations[DATASOURCE_THREATMODELS_FETCH](datasourceModule.state, models);
                });

                it('sets the threat models', () => {
                    expect(datasourceModule.state.models).toEqual(models);
                });
            });

            describe('selected', () => {
                it('sets the selected threatmodel', () => {
                    const threatModel = 'foobar';
                    datasourceModule.mutations[DATASOURCE_THREATMODEL_SELECTED](datasourceModule.state, threatModel);
                    expect(datasourceModule.state.threatModel).toEqual(threatModel);
                });
            });

            describe('clear', () => {
                it('resets state[provider].threatmodel', () => {
                    datasourceModule.state.github = {
                        threatModel: 'foo'
                    };
                    datasourceModule.mutations[DATASOURCE_THREATMODEL_CLEAR](datasourceModule.state);
                    expect(datasourceModule.state.github.threatModel).toEqual('');
                });
            });
        });
    });

    describe('getters', () => {
        it('is an object', () => {
            expect(datasourceModule.getters).toBeInstanceOf(Object);
        });
    });
});