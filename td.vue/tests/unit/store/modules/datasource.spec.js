import { allProviders } from '@/service/providers.js';
import providerModule from '@/store/modules/datasource.js';
import {
    DATASOURCE_BRANCH_SELECTED,
    DATASOURCE_PROVIDER_CLEAR,
    DATASOURCE_PROVIDER_SELECTED,
    DATASOURCE_REPOSITORY_CLEAR,
    DATASOURCE_REPOSITORY_SELECTED
} from '@/store/actions/datasource.js';

describe('store/modules/datasource.js', () => {
    const mocks = {
        commit: () => {}
    };

    describe('state', () => {
        it('is an object', () => {
            expect(providerModule.state).toBeInstanceOf(Object);
        });

        it('has a provider property', () => {
            expect(providerModule.state.provider).not.toBeUndefined();
        });
    });

    describe('actions', () => {
        describe('provider', () => {
            describe('selected', () => {
                it('is a function', () => {
                    expect(providerModule.actions[DATASOURCE_PROVIDER_SELECTED]).toBeInstanceOf(Function);
                });
    
                it('commits the provider', () => {
                    const provider = 'foobar';
                    jest.spyOn(mocks, 'commit');
                    providerModule.actions[DATASOURCE_PROVIDER_SELECTED](mocks, provider);
                    expect(mocks.commit).toHaveBeenCalledWith(DATASOURCE_PROVIDER_SELECTED, provider);
                });
            });
    
            describe('clear', () => {
                it('is a function', () => {
                    expect(providerModule.actions[DATASOURCE_PROVIDER_CLEAR]).toBeInstanceOf(Function);
                });
    
                it('commits PROVIDER_CLEAR', () => {
                    jest.spyOn(mocks, 'commit');
                    providerModule.actions[DATASOURCE_PROVIDER_CLEAR](mocks);
                    expect(mocks.commit).toHaveBeenCalledWith(DATASOURCE_PROVIDER_CLEAR);
                });
            });
        });

        describe('repository', () => {
            describe('selected', () => {
                it('is a function', () => {
                    expect(providerModule.actions[DATASOURCE_REPOSITORY_SELECTED]).toBeInstanceOf(Function);
                });
    
                it('commits the repository', () => {
                    const repository = 'foobar';
                    jest.spyOn(mocks, 'commit');
                    providerModule.actions[DATASOURCE_REPOSITORY_SELECTED](mocks, repository);
                    expect(mocks.commit).toHaveBeenCalledWith(DATASOURCE_REPOSITORY_SELECTED, repository);
                });
            });
    
            describe('clear', () => {
                it('is a function', () => {
                    expect(providerModule.actions[DATASOURCE_REPOSITORY_CLEAR]).toBeInstanceOf(Function);
                });
    
                it('commits REPOSITORY_CLEAR', () => {
                    jest.spyOn(mocks, 'commit');
                    providerModule.actions[DATASOURCE_REPOSITORY_CLEAR](mocks);
                    expect(mocks.commit).toHaveBeenCalledWith(DATASOURCE_REPOSITORY_CLEAR);
                });
            });
        });

        describe('branch', () => {
            describe('selected', () => {
                it('is a function', () => {
                    expect(providerModule.actions[DATASOURCE_BRANCH_SELECTED]).toBeInstanceOf(Function);
                });
    
                it('commits the branch', () => {
                    const branch = 'foobar';
                    jest.spyOn(mocks, 'commit');
                    providerModule.actions[DATASOURCE_BRANCH_SELECTED](mocks, branch);
                    expect(mocks.commit).toHaveBeenCalledWith(DATASOURCE_BRANCH_SELECTED, branch);
                });
            });
        });
    });

    describe('mutations', () => {
        describe('provider', () => {
            describe('clear', () => {
                it('resets state.provider', () => {
                    providerModule.state.provider = 'foobar';
                    providerModule.mutations[DATASOURCE_PROVIDER_CLEAR](providerModule.state);
                    expect(providerModule.state.provider).toEqual('');
                });
            });
    
            describe('selected', () => {
                afterEach(() => {
                    providerModule.state.provider = '';
                });
    
                it('throws an error if an unrecognized provider is used', () => {
                    const fakeProvider = 'fake';
                    expect(
                        () => providerModule.mutations[DATASOURCE_PROVIDER_SELECTED](providerModule.state, fakeProvider)
                    ).toThrowError(`"${fakeProvider}" is not a recognized provider`);
                });
    
                it('sets the selected provider', () => {
                    const provider = allProviders.github;
                    providerModule.mutations[DATASOURCE_PROVIDER_SELECTED](providerModule.state, provider);
                    expect(providerModule.state.provider).toEqual(provider);
                });
    
                it('sets the provider config object', () => {
                    const provider = allProviders.github;
                    providerModule.mutations[DATASOURCE_PROVIDER_SELECTED](providerModule.state, provider);
                    expect(providerModule.state[provider]).toBeInstanceOf(Object);
                });
            });
        });

        describe('repository', () => {
            describe('clear', () => {
                it('resets state[provider].repository', () => {
                    providerModule.state.provider = 'github';
                    providerModule.state.github = {
                        repositoryName: 'foobar'
                    };
                    providerModule.mutations[DATASOURCE_REPOSITORY_CLEAR](providerModule.state);
                    expect(providerModule.state.github.repositoryName).toEqual('');
                });
            });
    
            describe('selected', () => {
                afterEach(() => {
                    providerModule.state.provider = 'github';
                    providerModule.state.github = {};
                });
    
                it('sets the selected repo', () => {
                    const repo = 'foobar';
                    providerModule.mutations[DATASOURCE_REPOSITORY_SELECTED](providerModule.state, repo);
                    expect(providerModule.state.github.repositoryName).toEqual(repo);
                });
            });
        });

        describe('branch', () => {
            describe('selected', () => {
                afterEach(() => {
                    providerModule.state.provider = 'github';
                    providerModule.state.github = {};
                });
    
                it('sets the selected repo', () => {
                    const branch = 'foobar';
                    providerModule.mutations[DATASOURCE_BRANCH_SELECTED](providerModule.state, branch);
                    expect(providerModule.state.github.branch).toEqual(branch);
                });
            });
        });
    });

    describe('getters', () => {
        it('is an object', () => {
            expect(providerModule.getters).toBeInstanceOf(Object);
        });
    });
});