import axios from 'axios';

import httpClient from '@/service/httpClient.js';
import storeFactory from '@/store/index.js';

describe('service/httpClient.js', () => {
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
            }
        }
    };
    let client;

    beforeEach(() => {
        axios.create = jest.fn().mockReturnValue(clientMock);
        jest.spyOn(storeFactory, 'get').mockReturnValue({ state: { auth: { jwt: '' }}});
    });

    describe('defaults', () => {
        beforeEach(() => {
            jest.spyOn(clientMock.interceptors.request, 'use');
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

        describe('with a jwt', () => {
            beforeEach(() => {
                storeFactory.get.mockReturnValue({ state: { auth: { jwt: 'foobar' }}});
                clientMock.interceptors.request.use = (fn) => fn(config);
                client = httpClient.createClient();
            });

            it('adds the authorization header', () => {
                expect(config.headers.authorization).toEqual('Bearer foobar');
            });
        });

        describe('without a JWT', () => {
            beforeEach(() => {
                clientMock.interceptors.request.use = (fn) => fn(config);
                client = httpClient.createClient();
            });

            it('does not add the authorization header', () => {
                expect(config.headers.authorization).toBeUndefined();
            });
        });

        describe('with error', () => {
            const err = new Error('whoops!');

            beforeEach(() => {
                clientMock.interceptors.request.use = (fn, errFn) => errFn(err);
                console.error = jest.fn();
                client = httpClient.createClient();
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
