import { authClear, authSetJwt, authSetLocal, logout } from '@/store/actions/auth.js';
import authModule, { clearState } from '@/store/modules/auth.js';
import { branchClear } from '@/store/actions/branch.js';
import loginApi from '@/service/api/loginApi.js';
import { providerClear } from '@/store/actions/provider.js';
import { repositoryClear } from '@/store/actions/repository.js';
import { threatmodelClear } from '@/store/actions/threatmodel.js';

describe('store/modules/auth.js', () => {
    const getMocks = () => ({
        commit: () => {},
        dispatch: () => {},
        rootState: {}
    });
    const jwtBody = { foo: 'bar', user: { username: 'whatever' }};
    const apiResp = {
        accessToken: 'blah.eyJmb28iOiJiYXIiLCJ1c2VyIjp7InVzZXJuYW1lIjoid2hhdGV2ZXIifX0.blah',
        refreshToken: 'howrefreshing'
    };
    let mocks;

    beforeEach(() => {
        console.log = jest.fn();
        mocks = getMocks();
        loginApi.logoutAsync = jest.fn();
        jest.spyOn(mocks, 'commit');
        jest.spyOn(mocks, 'dispatch');
    });

    afterEach(() => {
        clearState(authModule.state);
    });

    describe('state', () => {
        it('is an object', () => {
            expect(authModule.state).toBeInstanceOf(Object);
        });

        it('has a jwt property', () => {
            expect(authModule.state.jwt).not.toBeUndefined();
        });

        it('has a refreshToken property', () => {
            expect(authModule.state.refreshToken).not.toBeUndefined();
        });

        it('has a user property', () => {
            expect(authModule.state.user).not.toBeUndefined();
        });

        it('has a jwtBody property', () => {
            expect(authModule.state.jwtBody).not.toBeUndefined();
        });
    });

    describe('actions', () => {
        it('commits clear', () => {
            authModule.actions[authClear](mocks);
            expect(mocks.commit).toHaveBeenCalledWith(authClear);
        });

        it('commits set jwt', () => {
            authModule.actions[authSetJwt](mocks, apiResp);
            expect(mocks.commit).toHaveBeenCalledWith(authSetJwt, apiResp);
        });

        it('commits set local', () => {
            authModule.actions[authSetLocal](mocks);
            expect(mocks.commit).toHaveBeenCalledWith(authSetLocal);
        });
        
        describe('logout', () => {

            describe('local provider', () => {     
                beforeEach(() => {
                    mocks.rootState.provider = { selected: 'local' };
                    authModule.actions[logout](mocks);
                });

                it('should not call the API', () => {
                    expect(loginApi.logoutAsync).not.toHaveBeenCalled();
                });

                it('dispatches the AUTH_CLEAR action', () => {
                    expect(mocks.dispatch).toHaveBeenCalledWith(authClear);
                });

                it('dispatches the BRANCH_CLEAR action', () => {
                    expect(mocks.dispatch).toHaveBeenCalledWith(branchClear);
                });

                it('dispatches the PROVIDER_CLEAR action', () => {
                    expect(mocks.dispatch).toHaveBeenCalledWith(providerClear);
                });

                it('dispatches the REPOSITORY_CLEAR action', () => {
                    expect(mocks.dispatch).toHaveBeenCalledWith(repositoryClear);
                });

                it('dispatches the THREATMODEL_CLEAR action', () => {
                    expect(mocks.dispatch).toHaveBeenCalledWith(threatmodelClear);
                });
            });

            describe('remote provider', () => {  
                describe('without error', () => {
                    beforeEach(() => {
                        mocks.rootState.provider = { selected: 'github' };
                        mocks.state = { refreshToken: 'token' };
                        authModule.actions[logout](mocks);
                    });

                    it('calls the API', () => {
                        expect(loginApi.logoutAsync).toHaveBeenCalledWith(mocks.state.refreshToken);
                    });
    
                    it('dispatches the AUTH_CLEAR action', () => {
                        expect(mocks.dispatch).toHaveBeenCalledWith(authClear);
                    });
    
                    it('dispatches the BRANCH_CLEAR action', () => {
                        expect(mocks.dispatch).toHaveBeenCalledWith(branchClear);
                    });
    
                    it('dispatches the PROVIDER_CLEAR action', () => {
                        expect(mocks.dispatch).toHaveBeenCalledWith(providerClear);
                    });
    
                    it('dispatches the REPOSITORY_CLEAR action', () => {
                        expect(mocks.dispatch).toHaveBeenCalledWith(repositoryClear);
                    });
    
                    it('dispatches the THREATMODEL_CLEAR action', () => {
                        expect(mocks.dispatch).toHaveBeenCalledWith(threatmodelClear);
                    });
                });

                describe('with error', () => {
                    const err = new Error('whoops!');

                    beforeEach(() => {
                        mocks.rootState.provider = { selected: 'github' };
                        mocks.state = { refreshToken: 'token' };
                        console.error = jest.fn();
                        loginApi.logoutAsync.mockRejectedValue(err);
                        authModule.actions[logout](mocks);
                    });

                    it('calls the API', () => {
                        expect(loginApi.logoutAsync).toHaveBeenCalledWith(mocks.state.refreshToken);
                    });

                    it('logs the error', () => {
                        expect(console.error).toHaveBeenCalledWith('Error calling logout api', err);
                    });
    
                    it('dispatches the AUTH_CLEAR action', () => {
                        expect(mocks.dispatch).toHaveBeenCalledWith(authClear);
                    });
    
                    it('dispatches the BRANCH_CLEAR action', () => {
                        expect(mocks.dispatch).toHaveBeenCalledWith(branchClear);
                    });
    
                    it('dispatches the PROVIDER_CLEAR action', () => {
                        expect(mocks.dispatch).toHaveBeenCalledWith(providerClear);
                    });
    
                    it('dispatches the REPOSITORY_CLEAR action', () => {
                        expect(mocks.dispatch).toHaveBeenCalledWith(repositoryClear);
                    });
    
                    it('dispatches the THREATMODEL_CLEAR action', () => {
                        expect(mocks.dispatch).toHaveBeenCalledWith(threatmodelClear);
                    });
                });
            });
        });
    });

    describe('mutations', () => {
        describe('clear', () => {
            beforeEach(() => {
                authModule.state.jwt = 'test';
                authModule.state.user = { foo: 'bar' };
                authModule.state.jwtBody = { bar: 'baz' };
                authModule.state.refreshToken = 'refresh';
                authModule.mutations[authClear](authModule.state);
            });

            it('clears the jwt', () => {
                expect(authModule.state.jwt).toEqual('');
            });

            it('clears the refresh token', () => {
                expect(authModule.state.refreshToken).toEqual('');
            });

            it('clears the user', () => {
                expect(authModule.state.user).toEqual({});
            });

            it('clears the jwtBody', () => {
                expect(authModule.state.jwtBody).toEqual({});
            });
        });

        describe('set jwt', () => {
            describe('happy path', () => {
                beforeEach(() => {
                    authModule.mutations[authSetJwt](authModule.state, apiResp);
                });
    
                it('sets the jwt', () => {
                    expect(authModule.state.jwt).toEqual(apiResp.accessToken);
                });
    
                it('sets the refreshToken', () => {
                    expect(authModule.state.refreshToken).toEqual(apiResp.refreshToken);
                });
    
                it('sets the user', () => {
                    expect(authModule.state.user).toEqual(jwtBody.user);
                });
    
                it('sets the jwtBody', () => {
                    expect(authModule.state.jwtBody).toEqual(jwtBody);
                });
            });

            describe('with error', () => {
                it('re-throws the error', () => {
                    expect(() => {
                        authModule.mutations[authSetJwt](authModule.state, 'someBadData');
                    }).toThrow();
                });
            });
        });

        describe('set local', () => {
            beforeEach(() => {
                authModule.mutations[authSetLocal](authModule.state);
            });

            it('sets the username to "local-user"', () => {
                expect(authModule.state.user.username).toEqual('local-user');
            });

            it('does not set the jwt', () => {
                expect(authModule.state.jwt).toEqual('');
            });

            it('does not set the jwt body', () => {
                expect(authModule.state.jwtBody).toEqual({});
            });

            it('does not set the refresh token', () => {
                expect(authModule.state.refreshToken).toEqual('');
            });
        });
    });

    describe('getters', () => {
        beforeEach(() => {
            const now = new Date().getTime();
            authModule.state.user = { username: 'foo' };
            authModule.state.jwtBody = {
                exp: now + 5000,
                iat: now - 1000
            };
        });

        it('gets the username', () => {
            expect(authModule.getters.username(authModule.state)).toEqual('foo');
        });

        it('gets an empty string when there is no username', () => {
            authModule.state.user = {};
            expect(authModule.getters.username(authModule.state)).toEqual('');
        });
    });
});