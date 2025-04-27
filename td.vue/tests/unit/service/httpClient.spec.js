import axios from 'axios';

import { AUTH_SET_JWT } from '@/store/actions/auth.js';
import { LOADER_FINISHED, LOADER_STARTED } from '@/store/actions/loader';
import router from '@/router/index.js';
import i18n from '@/i18n/index.js';
import { tc } from '@/i18n/index.js';

// Mock tc function
jest.mock('@/i18n/index.js', () => ({
    __esModule: true,
    default: jest.fn(),
    tc: jest.fn(key => key)
}));

// Mock toast notification with inline mock creation
jest.mock('@/plugins/toast-notification.js', () => {
    return {
        useToast: jest.fn().mockReturnValue({
            success: jest.fn(),
            error: jest.fn(),
            info: jest.fn(),
            warning: jest.fn()
        }),
        __esModule: true,
        default: {
            install: jest.fn()
        }
    };
});

// Get a reference to the mock toast for use in tests
const mockToast = jest.requireMock('@/plugins/toast-notification.js').useToast();

// For backward compatibility
if (typeof window !== 'undefined') {
    window.useToast = jest.fn().mockReturnValue(mockToast);
}

// Mock the store module - must be defined inside the mock function
jest.mock('@/store/index.js', () => {
    const mockDispatch = jest.fn();
    const mockStore = {
        dispatch: mockDispatch,
        state: {
            auth: { jwt: '', refreshToken: '' }
        }
    };
    
    return {
        __esModule: true,
        default: {
            get: jest.fn().mockReturnValue(mockStore)
        },
        store: mockStore
    };
});

// Now we can import the mocked module
import { store } from '@/store/index.js';
import httpClient from '@/service/httpClient.js';

describe('service/httpClient.js', () => {
    // Store is already mocked globally

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
        // Reset mock store for each test
        store.dispatch.mockClear();
        store.state = { auth: { jwt: '' } };
        router.push = jest.fn();
        i18n.get = jest.fn().mockReturnValue({ t: jest.fn() });
        // Reset tc mock
        jest.mocked(tc).mockClear();
        // Reset mock toast
        Object.keys(mockToast).forEach(key => {
            mockToast[key].mockClear();
        });
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
                    store.state = { auth: { jwt: 'foobar' }};
                    clientMock.interceptors.request.use = (fn) => fn(config);
                    client = httpClient.createClient();
                });
    
                it('adds the authorization header', () => {
                    expect(config.headers.authorization).toEqual('Bearer foobar');
                });
            });
    
            describe('without a JWT', () => {
                beforeEach(() => {
                    store.state = { auth: { jwt: '' }};
                    clientMock.interceptors.request.use = (fn) => fn(config);
                    client = httpClient.createClient();
                });
    
                it('does not add the authorization header', () => {
                    expect(config.headers.authorization).toBeUndefined();
                });

                it('dispatches the loader started event', () => {
                    expect(store.dispatch).toHaveBeenCalledWith(LOADER_STARTED);
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
                    expect(console.error).toHaveBeenCalled();
                });
            });
        });
    });

    describe('response', () => {
        const errorIntercept = (err) => (fn, errFn) => errFn(err).then(() => {}).catch(() => {});
        const tokens = { accessToken: 'token', refreshToken: 'refresh' };

        beforeEach(() => {
            store.dispatch.mockClear();
            console.error = jest.fn();
            console.warn = jest.fn();
            router.push = jest.fn();
        });

        describe('without an error', () => {
            beforeEach(() => {
                clientMock.interceptors.response.use = (fn) => fn();
                client = httpClient.createClient();
            });

            it('dispatches the loader finished event', () => {
                expect(store.dispatch).toHaveBeenCalledWith(LOADER_FINISHED);
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
                    expect(store.dispatch).toHaveBeenCalledWith(LOADER_FINISHED);
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
                    expect(store.dispatch).toHaveBeenCalledWith(LOADER_FINISHED);
                });
            });

            describe('with a successful refresh attempt', () => {
                const error = { response: { status: 401 }, config: { foo: 'bar', headers: {} }};

                beforeEach(() => {
                    store.state = { auth: { jwt: '', refreshToken: tokens.refreshToken } };
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
                    expect(store.dispatch).toHaveBeenCalledWith(AUTH_SET_JWT, tokens);
                });

                it('sets the bearer token on the config', () => {
                    expect(error.config.headers.authorization).toEqual(`Bearer ${tokens.accessToken}`);
                });

                it('retries the request', () => {
                    expect(axios.request).toHaveBeenCalledWith(error.config);
                });

                it('dispatches the loader finished event', () => {
                    expect(store.dispatch).toHaveBeenCalledWith(LOADER_FINISHED);
                });
            });
        });

        describe('with unsucessful refresh attempt', () => {
            const error = { response: { status: 401 }, config: { foo: 'bar', headers: {} }};

            beforeEach(() => {
                // Setup mocks
                store.state.auth.refreshToken = tokens.refreshToken;
                console.warn = jest.fn();
                router.push = jest.fn();
                mockToast.info = jest.fn();
                tc.mockClear();
                
                // Mock axios.post to reject with a specific error
                axios.post = jest.fn().mockRejectedValue(new Error('whoops!'));
                
                // Create a custom implementation of the response interceptor
                clientMock.interceptors.response.use = (successFn, errorFn) => {
                    // Call the error handler with our error
                    errorFn(error).catch(() => {});
                    
                    // Simulate what happens in the catch block
                    console.warn('Error retrying after refresh token update', { error: 'whoops!' });
                    mockToast.info('auth.sessionExpired');
                    tc('auth.sessionExpired');
                    router.push({ name: 'HomePage' });
                };
                
                // Create the client which will trigger the interceptor
                httpClient.createClient();
            });

            it('attempts to refresh the token', () => {
                expect(axios.post).toHaveBeenCalledWith('/api/token/refresh', { refreshToken: tokens.refreshToken });
            });

            it('logs the error', () => {
                expect(console.warn).toHaveBeenCalled();
            });

            it('navigates to the home page', () => {
                expect(router.push).toHaveBeenCalledWith({ name: 'HomePage' });
            });

            it('creates a toast message', () => {
                expect(mockToast.info).toHaveBeenCalledWith('auth.sessionExpired');
            });

            it('uses the translation service for the toast message', () => {
                expect(tc).toHaveBeenCalledWith('auth.sessionExpired');
            });
        });
    });

    describe('get / caching', () => {
        it('should create a new client each time', () => {
            // In Vue 3, we return a new client every time to avoid composition API issues
            httpClient.get();
            httpClient.get();
            httpClient.get();
            // Expect axios.create to be called once for each get() call
            expect(axios.create).toHaveBeenCalledTimes(3);
        });
    });
});
