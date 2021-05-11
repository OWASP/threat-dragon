import axios from 'axios';

import httpClient from '@/service/httpClient.js';
import { LOADER_FINISHED, LOADER_STARTED } from '@/store/actions/loader';
import storeFactory from '@/store/index.js';

describe('service/httpClient.js', () => {
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

        describe('without an error', () => {
            beforeEach(() => {
                jest.spyOn(mockStore, 'dispatch');
                clientMock.interceptors.response.use = (fn) => fn();
                client = httpClient.createClient();
            });

            it('dispatches the loader finished event', () => {
                expect(mockStore.dispatch).toHaveBeenCalledWith(LOADER_FINISHED);
            });
        });

        describe('with error', () => {
            const err = new Error('whoops!');

            beforeEach(() => {
                clientMock.interceptors.response.use = (fn, errFn) => errFn(err).then(() => {}).catch(() => {});
                console.error = jest.fn();
                httpClient.createClient();
            });

            it('logs the error', () => {
                expect(console.error).toHaveBeenCalledWith(err);
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
