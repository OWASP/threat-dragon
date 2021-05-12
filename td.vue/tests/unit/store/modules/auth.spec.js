import { AUTH_CLEAR, AUTH_SET_JWT, AUTH_SET_LOCAL } from '@/store/actions/auth.js';
import authModule, { clearState } from '@/store/modules/auth.js';

describe('store/modules/auth.js', () => {
    const mocks = {
        commit: () => {}
    };
    const jwtBody = { foo: 'bar', user: { username: 'whatever' }};
    const apiResp = {
        accessToken: 'blah.eyJmb28iOiJiYXIiLCJ1c2VyIjp7InVzZXJuYW1lIjoid2hhdGV2ZXIifX0.blah',
        refreshToken: 'howrefreshing'
    };

    beforeEach(() => {
        jest.spyOn(mocks, 'commit');
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
            authModule.actions[AUTH_CLEAR](mocks);
            expect(mocks.commit).toHaveBeenCalledWith(AUTH_CLEAR);
        });

        it('commits set jwt', () => {
            authModule.actions[AUTH_SET_JWT](mocks, apiResp);
            expect(mocks.commit).toHaveBeenCalledWith(AUTH_SET_JWT, apiResp);
        });

        it('commits set local', () => {
            authModule.actions[AUTH_SET_LOCAL](mocks);
            expect(mocks.commit).toHaveBeenCalledWith(AUTH_SET_LOCAL);
        });

    });

    describe('mutations', () => {
        describe('clear', () => {
            beforeEach(() => {
                authModule.state.jwt = 'test';
                authModule.state.user = { foo: 'bar' };
                authModule.state.jwtBody = { bar: 'baz' };
                authModule.state.refreshToken = 'refresh';
                authModule.mutations[AUTH_CLEAR](authModule.state);
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
            beforeEach(() => {
                authModule.mutations[AUTH_SET_JWT](authModule.state, apiResp);
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

        describe('set local', () => {
            beforeEach(() => {
                authModule.mutations[AUTH_SET_LOCAL](authModule.state);
            });

            it('sets the username to "Guest"', () => {
                expect(authModule.state.user.username).toEqual('Guest');
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