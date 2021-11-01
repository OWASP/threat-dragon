import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import { AUTH_SET_JWT } from '@/store/actions/auth.js';
import loginApi from '@/service/loginApi.js';
import OAuthReturn from '@/views/OauthReturn.vue';
import router from '@/router/index.js';

describe('views/OauthReturn.vue', () => {
    const jwt = 'foobar';
    const code = '1234-12345';
    const provider = 'test';
    let localVue, mockStore;

    beforeEach(() => {
        console.error = jest.fn();
    });

    describe('expected path', () => {
        beforeEach(() => {
            localVue = createLocalVue();
            localVue.use(Vuex);
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
            router.push = jest.fn();
            router.query = { code: code };
            jest.spyOn(mockStore, 'dispatch');
            jest.spyOn(loginApi, 'completeLoginAsync').mockResolvedValue({ data: jwt });
            shallowMount(OAuthReturn, {
                localVue,
                store: mockStore,
                router
            });
        });

        it('completes the login', () => {
            expect(loginApi.completeLoginAsync).toHaveBeenCalled();
        });

        it('sets the jwt', () => {
            expect(mockStore.dispatch).toHaveBeenCalledWith(AUTH_SET_JWT, jwt);
        });

        it('navigates to the dashboard', () => {
            expect(router.push).toHaveBeenCalledWith('/dashboard');
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
            router.push = jest.fn();
            router.query = { code: code };
            jest.spyOn(loginApi, 'completeLoginAsync').mockRejectedValue('whoops');
            shallowMount(OAuthReturn, {
                localVue,
                store: mockStore,
                router
            });
        });

        it('re-throws the error', () => {
            expect(err).not.toBeUndefined();
        });
    });
});
