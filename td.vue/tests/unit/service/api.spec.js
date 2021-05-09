import api from '@/service/api.js';

describe('service/api.js', () => {
    const url = 'http://threatdragon.org/api/foobar';

    const successMock = () => ({
        status: 200,
        json: () => Promise.resolve({})
    });

    describe('getAsync', () => {
        describe('without JWT', () => {
            beforeEach(async () => {
                global.fetch = jest.fn().mockImplementation(successMock);
                await api.getAsync(url);
            });

            it('passes the provided url to fetch', () => {
                expect(global.fetch).toHaveBeenCalledWith(url, expect.anything());
            });
    
            it('sets the method to GET', () => {
                expect(global.fetch).toHaveBeenCalledWith(
                    expect.anything(),
                    expect.objectContaining({ method: 'GET' })
                );
            });

            it('sets the accept header', () => {
                expect(global.fetch).toHaveBeenCalledWith(
                    expect.anything(),
                    expect.objectContaining({ headers: { Accept: 'application/json' }})
                );
            });
        });

        describe('with JWT', () => {
            const jwt = 'blah';

            beforeEach(async () => {
                global.fetch = jest.fn().mockImplementation(successMock);
                await api.getAsync(url, jwt);
            });

            it('sets the authorization header', () => {
                expect(global.fetch).toHaveBeenCalledWith(
                    expect.anything(),
                    expect.objectContaining({
                        headers: expect.objectContaining({ authorization: `Bearer ${jwt}` })
                    })
                );
            });
        });
    });

    describe('postAsync', () => {
        describe('without JWT or body', () => {
            beforeEach(async () => {
                global.fetch = jest.fn().mockImplementation(successMock);
                await api.postAsync(url);
            });

            it('passes the provided url to fetch', () => {
                expect(global.fetch).toHaveBeenCalledWith(url, expect.anything());
            });
    
            it('sets the method to POST', () => {
                expect(global.fetch).toHaveBeenCalledWith(
                    expect.anything(),
                    expect.objectContaining({ method: 'POST' })
                );
            });

            it('sets the accept header', () => {
                expect(global.fetch).toHaveBeenCalledWith(
                    expect.anything(),
                    expect.objectContaining({
                        headers: expect.objectContaining({ Accept: 'application/json' })
                    })
                );
            });

            it('sets the Content-Type header', () => {
                expect(global.fetch).toHaveBeenCalledWith(
                    expect.anything(),
                    expect.objectContaining({
                        headers: expect.objectContaining({ 'Content-Type': 'application/json' })
                    })
                );
            });
        });

        describe('with JWT and body', () => {
            const jwt = 'blah';
            const body = { foo: 'bar' };

            beforeEach(async () => {
                global.fetch = jest.fn().mockImplementation(successMock);
                await api.postAsync(url, body, jwt);
            });

            it('sets the authorization header', () => {
                expect(global.fetch).toHaveBeenCalledWith(
                    expect.anything(),
                    expect.objectContaining({
                        headers: expect.objectContaining({ authorization: `Bearer ${jwt}` })
                    })
                );
            });

            it('sets the post body', () => {
                expect(global.fetch).toHaveBeenCalledWith(
                    expect.anything(),
                    expect.objectContaining({ body: JSON.stringify(body) })
                );
            });
        });
    });
});
