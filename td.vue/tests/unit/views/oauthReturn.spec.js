import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

jest.mock('@/service/analytics.js', () => ({
    track: jest.fn()
}));

import { authSetJwt } from '@/store/actions/auth.js';
import analytics from '@/service/analytics.js';
import { configFetch } from '@/store/actions/config.js';
import loginApi from '@/service/api/loginApi.js';
import OAuthReturn from '@/views/OauthReturn.vue';

describe('views/OauthReturn.vue', () => {
    const jwt = 'foobar';
    const code = '1234-12345';
    const provider = 'github';
    let localVue, mockStore, routerMock;

    beforeEach(() => {
        jest.clearAllMocks();
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
                    [authSetJwt]: () => {},
                    [configFetch]: () => {}
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

        it('refreshes server configuration before authentication', () => {
            expect(mockStore.dispatch).toHaveBeenCalledWith(configFetch);
        });

        it('sets the jwt', () => {
            expect(mockStore.dispatch).toHaveBeenCalledWith(authSetJwt, jwt);
        });

        it('navigates to the dashboard', () => {
            expect(routerMock.push).toHaveBeenCalledWith('/dashboard');
        });

        it('tracks successful provider authentication', () => {
            expect(analytics.track).toHaveBeenCalledWith(
                'PROVIDER_AUTHENTICATION_SUCCEEDED',
                { provider }
            );
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
                    [authSetJwt]: () => {},
                    [configFetch]: () => {}
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

        it('does not track failed provider authentication', () => {
            expect(analytics.track).not.toHaveBeenCalled();
        });
    });
});
