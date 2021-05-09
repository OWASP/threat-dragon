import api from '@/service/api.js';
import store from '@/store/index.js';
import threatmodelApi from '@/service/threatmodelApi.js';

describe('service/threatmodelApi.js', () => {
    const authMock = {
        jwt: 'foo'
    };

    beforeEach(() => {
        jest.spyOn(api, 'getAsync').mockImplementation(() => {});
        store.state.auth = authMock;
    });

    describe('reposAsync', () => {
        beforeEach(async () => {
            await threatmodelApi.reposAsync();
        });

        it('calls the repos endpoint', () => {
            expect(api.getAsync).toHaveBeenCalledWith('/api/threatmodel/repos', expect.anything());
        });

        it('uses the bearer token', () => {
            expect(api.getAsync).toHaveBeenCalledWith(expect.anything(), authMock.jwt);
        });
    });
});
