import sinon from 'sinon';

/**
 * @name express.mocks
 * @description A collection of reusable mocks useful for testing an express application
 */

export const getMockApp = () => {
    const mockApp = {
        get: () => {},
        set: () => {},
        use: () => {}
    };

    sinon.spy(mockApp, 'get');
    sinon.spy(mockApp, 'set');
    sinon.spy(mockApp, 'use');

    return mockApp;
};

export const getMockRequest = () => {
    const mockRequest = {
        user: {
            accessToken: 'token',
            profile: {
                username: 'foobar',
                provider: 'fake idp'
            }
        },
        provider: {
            access_token: 'blah'
        },
        params: {},
        headers: {},
        query: {},
        body: {},
        get: () => {},
        session: {
            destroy: (cb) => { if(cb) { cb(); }}
        },
        csrfToken: () => 'some_token'
    };

    sinon.spy(mockRequest.session, 'destroy');
    sinon.stub(mockRequest, 'get');

    return mockRequest;
};

export const getMockResponse = () => {
    const mockResponse = {
        send: () => {},
        status: () => {},
        json: () => {},
        redirect: () => {},
        sendFile: () => {},
        cookie: () => {},
        clearCookie: () => {},
        render: () => {}
    };

    sinon.stub(mockResponse, 'status').returns(mockResponse);
    sinon.stub(mockResponse, 'json').returns(mockResponse);
    sinon.spy(mockResponse, 'send');
    sinon.spy(mockResponse, 'redirect');
    sinon.spy(mockResponse, 'sendFile');
    sinon.spy(mockResponse, 'cookie');
    sinon.spy(mockResponse, 'clearCookie');
    sinon.spy(mockResponse, 'render');

    return mockResponse;
};
