import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import { AUTH_SET_JWT } from '@/store/actions/auth.js';
import loginApi from '@/service/api/loginApi.js';
import OAuthReturn from '@/views/OauthReturn.vue';

describe('views/OauthReturn.vue', () => {
    const jwt = 'foobar';
    const code = '1234-12345';
    const provider = 'test';
    let localVue, mockStore, routerMock;

    beforeEach(() => {
        console.error = jest.fn();
    });

    describe('expected path', () => {
        beforeEach(() => {
            localVue = createLocalVue();
            localVue.use(Vuex);
            routerMock = {
                push: jest.fn(),
                query: { code: code }
            };
            mockStore = new Vuex.Store({
                state: {
                    provider: {
                        selected: provider
                    }
                },
                actions: {
                    [AUTH_SET_JWT]: () => {}
                }
            });
            jest.spyOn(mockStore, 'dispatch');
            jest.spyOn(loginApi, 'completeLoginAsync').mockResolvedValue({ data: jwt });
            shallowMount(OAuthReturn, {
                localVue,
                store: mockStore,
                mocks: {
                    $route: routerMock,
                    $router: routerMock
                }
            });
        });

        it('completes the login', () => {
            expect(loginApi.completeLoginAsync).toHaveBeenCalled();
        });

        it('sets the jwt', () => {
            expect(mockStore.dispatch).toHaveBeenCalledWith(AUTH_SET_JWT, jwt);
        });

        it('navigates to the dashboard', () => {
            expect(routerMock.push).toHaveBeenCalledWith('/dashboard');
        });
    });

    describe('with error', () => {
        let err;

        beforeEach(() => {
            localVue = createLocalVue({
                errorHandler(e) {
                    err = e;
                }
            });
            localVue.use(Vuex);
            routerMock = {
                push: jest.fn(),
                query: { code: code }
            };
            mockStore = new Vuex.Store({
                state: {
                    provider: {
                        selected: provider
                    }
                },
                actions: {
                    [AUTH_SET_JWT]: () => {}
                }
            });
            jest.spyOn(loginApi, 'completeLoginAsync').mockRejectedValue('whoops');
            shallowMount(OAuthReturn, {
                localVue,
                store: mockStore,
                mocks: {
                    $router: routerMock
                }
            });
        });

        it('re-throws the error', () => {
            expect(err).not.toBeUndefined();
        });
    });
});
