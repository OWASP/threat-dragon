import authModule from '@/store/modules/auth.js';
import { AUTH_SET_JWT } from '@/store/actions/auth.js';

describe('store/modules/auth.js', () => {
    const mocks = {
        commit: () => {}
    };
    const jwtBody = { foo: 'bar', user: { username: 'whatever' }};
    const jwt = 'blah.eyJmb28iOiJiYXIiLCJ1c2VyIjp7InVzZXJuYW1lIjoid2hhdGV2ZXIifX0.blah';

    describe('state', () => {
        it('is an object', () => {
            expect(authModule.state).toBeInstanceOf(Object);
        });

        it('has a jwt property', () => {
            expect(authModule.state.jwt).not.toBeUndefined();
        });

        it('has a user property', () => {
            expect(authModule.state.user).not.toBeUndefined();
        });

        it('has a jwtBody property', () => {
            expect(authModule.state.jwtBody).not.toBeUndefined();
        });
    });

    describe('actions', () => {
        describe('set jwt', () => {
                it('is a function', () => {
                    expect(authModule.actions[AUTH_SET_JWT]).toBeInstanceOf(Function);
                });

                it('commits the jwt', () => {
                    jest.spyOn(mocks, 'commit');
                    authModule.actions[AUTH_SET_JWT](mocks, jwt);
                    expect(mocks.commit).toHaveBeenCalledWith(AUTH_SET_JWT, jwt);
                });
        });
    });

    describe('mutations', () => {
        describe('set jwt', () => {
            beforeEach(() => {
                authModule.state.jwt = '';
                authModule.state.user = {};
                authModule.state.jwtBody = {};
                authModule.mutations[AUTH_SET_JWT](authModule.state, jwt);
            });

            it('sets the jwt', () => {
                expect(authModule.state.jwt).toEqual(jwt);
            });

            it('sets the user', () => {
                expect(authModule.state.user).toEqual(jwtBody.user);
            });

            it('sets the jwtBody', () => {
                expect(authModule.state.jwtBody).toEqual(jwtBody);
            });
        });
    });

    describe('getters', () => {
        it('is an object', () => {
            expect(authModule.getters).toBeInstanceOf(Object);
        });
    });
});