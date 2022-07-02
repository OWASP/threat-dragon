import axios from 'axios';
import Vue from 'vue';

import { AUTH_SET_JWT } from '@/store/actions/auth.js';
import httpClient from '@/service/httpClient.js';
import i18n from '@/i18n/index.js';
import { LOADER_FINISHED, LOADER_STARTED } from '@/store/actions/loader';
import router from '@/router/index.js';
import storeFactory from '@/store/index.js';

describe('service/httpClient.js', () => {
    let routerMock;

    const mockStore = {
        dispatch: () => {},
        state: {
            auth: { jwt: '' }
        }
    };

    const clientMock = {
        defaults: {
            headers: {
                common: {},
                post: {}
            }
        },
        interceptors: {
            request: {
                use: () => {}
            },
            response: {
                use: () => {}
            }
        }
    };
    let client;

    beforeEach(() => {
        axios.create = jest.fn().mockReturnValue(clientMock);
        jest.spyOn(clientMock.interceptors.request, 'use');
        jest.spyOn(clientMock.interceptors.response, 'use');
        jest.spyOn(storeFactory, 'get').mockReturnValue(mockStore);
        routerMock = { push: jest.fn() };
        router.get = jest.fn().mockReturnValue(routerMock);
        i18n.get = jest.fn().mockReturnValue({ t: jest.fn() });
        Vue.$toast = { info: jest.fn() };
    });

    describe('defaults', () => {
        beforeEach(() => {
            client = httpClient.createClient();
        });
    
        it('adds the accept header to everything', () => {
            expect(client.defaults.headers.common.Accept).toEqual('application/json');
        });
    
        it('adds the content type header to post requests', () => {
            expect(client.defaults.headers.post['Content-Type']).toEqual('application/json');
        });
    
        it('adds an interceptor', () => {
            expect(client.interceptors.request.use).toHaveBeenCalled();
        });
    });

    describe('interceptors', () => {
        let config;

        beforeEach(() => {
            config = {
                headers: {
                    common: {},
                    post: {}
                }
            };
        });

        describe('request', () => {

            describe('with a jwt', () => {
                beforeEach(() => {
                    storeFactory.get.mockReturnValue({ dispatch: () => {}, state: { auth: { jwt: 'foobar' }}});
                    clientMock.interceptors.request.use = (fn) => fn(config);
                    client = httpClient.createClient();
                });
    
                it('adds the authorization header', () => {
                    expect(config.headers.authorization).toEqual('Bearer foobar');
                });
            });
    
            describe('without a JWT', () => {
                beforeEach(() => {
                    jest.spyOn(mockStore, 'dispatch');
                    clientMock.interceptors.request.use = (fn) => fn(config);
                    client = httpClient.createClient();
                });
    
                it('does not add the authorization header', () => {
                    expect(config.headers.authorization).toBeUndefined();
                });

                it('dispatches the loader started event', () => {
                    expect(mockStore.dispatch).toHaveBeenCalledWith(LOADER_STARTED);
                });
            });
    
            describe('with error', () => {
                const err = new Error('whoops!');
    
                beforeEach(() => {
                    clientMock.interceptors.request.use = (fn, errFn) => errFn(err).then(() => {}).catch(() => {});
                    console.error = jest.fn();
                    httpClient.createClient();
                });
    
                it('logs the error', () => {
                    expect(console.error).toHaveBeenCalledWith(err);
                });
            });
        });
    });

    describe('response', () => {
        const errorIntercept = (err) => (fn, errFn) => errFn(err).then(() => {}).catch(() => {});
        const tokens = { accessToken: 'token', refreshToken: 'refresh' };

        beforeEach(() => {
            jest.spyOn(mockStore, 'dispatch');
            console.error = jest.fn();
        });

        describe('without an error', () => {
            beforeEach(() => {
                clientMock.interceptors.response.use = (fn) => fn();
                client = httpClient.createClient();
            });

            it('dispatches the loader finished event', () => {
                expect(mockStore.dispatch).toHaveBeenCalledWith(LOADER_FINISHED);
            });
        });

        describe('with error', () => {

            describe('with a non-401 error', () => {
                const error = { response: { status: 500 }};
                
                beforeEach(() => {
                    clientMock.interceptors.response.use = errorIntercept(error);
                    httpClient.createClient();
                });

                it('logs the error', () => {
                    expect(console.error).toHaveBeenCalledTimes(1);
                });
                
                it('dispatches the loader finished event', () => {
                    expect(mockStore.dispatch).toHaveBeenCalledWith(LOADER_FINISHED);
                });
            });

            describe('without a refresh token present', () => {
                const error = { response: { status: 401 }};

                beforeEach(() => {
                    clientMock.interceptors.response.use = errorIntercept(error);
                    httpClient.createClient();
                });

                it('logs the error', () => {
                    expect(console.error).toHaveBeenCalledTimes(1);
                });

                it('dispatches the loader finished event', () => {
                    expect(mockStore.dispatch).toHaveBeenCalledWith(LOADER_FINISHED);
                });
            });

            describe('with a successful refresh attempt', () => {
                const error = { response: { status: 401 }, config: { foo: 'bar', headers: {} }};

                beforeEach(() => {
                    mockStore.state.auth.refreshToken = tokens.refreshToken;
                    clientMock.interceptors.response.use = errorIntercept(error);
                    const postResp = {
                        data: {
                            data: {
                                accessToken: tokens.accessToken,
                                refreshToken: tokens.refreshToken
                            }
                        }
                    };
                    axios.post = jest.fn().mockReturnValue(postResp);
                    axios.request = jest.fn();
                    httpClient.createClient();
                });

                it('attempts to get a new JWT', () => {
                    expect(axios.post).toHaveBeenCalledWith('/api/token/refresh', { refreshToken: tokens.refreshToken });
                });

                it('dispatches the set jwt event', () => {
                    expect(mockStore.dispatch).toHaveBeenCalledWith(AUTH_SET_JWT, tokens);
                });

                it('sets the bearer token on the config', () => {
                    expect(error.config.headers.authorization).toEqual(`Bearer ${tokens.accessToken}`);
                });

                it('retries the request', () => {
                    expect(axios.request).toHaveBeenCalledWith(error.config);
                });

                it('dispatches the loader finished event', () => {
                    expect(mockStore.dispatch).toHaveBeenCalledWith(LOADER_FINISHED);
                });
            });
        });

        describe('with unsucessful refresh attempt', () => {
            const error = { response: { status: 401 }, config: { foo: 'bar', headers: {} }};

            beforeEach(() => {
                mockStore.state.auth.refreshToken = tokens.refreshToken;
                clientMock.interceptors.response.use = errorIntercept(error);
                console.warn = jest.fn();
                axios.post = jest.fn().mockRejectedValue('whoops!');
                httpClient.createClient();
            });

            it('attempts to refresh the token', () => {
                expect(axios.post).toHaveBeenCalledWith('/api/token/refresh', { refreshToken: tokens.refreshToken });
            });

            it('logs the error', () => {
                expect(console.warn).toHaveBeenCalled();
            });

            it('navigates to the home page', () => {
                expect(routerMock.push).toHaveBeenCalledWith({ name: 'HomePage' });
            });

            it('creates a toast message', () => {
                expect(Vue.$toast.info).toHaveBeenCalledTimes(1);
            });

            it('uses the translation service for the toast message', () => {
                expect(i18n.get().t).toHaveBeenCalledWith('auth.sessionExpired');
            });
        });
    });

    describe('get / caching', () => {
        beforeEach(() => {
            httpClient.get();
        });

        it('should only create a single client', () => {
            httpClient.get();
            httpClient.get();
            httpClient.get();
            expect(axios.create).toHaveBeenCalledTimes(1);
        });
    });
});
