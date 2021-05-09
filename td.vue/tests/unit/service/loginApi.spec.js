import api from '@/service/api.js';
import loginApi from '@/service/loginApi.js';

describe('service/loginApi.js', () => {
    const provider = 'github';

    beforeEach(async () => {
        jest.spyOn(api, 'getAsync').mockResolvedValue({ data: '' });
        await loginApi.loginAsync(provider);
    });

    it('calls the providers login endpoint', () => {
        expect(api.getAsync).toHaveBeenCalledWith(`/api/login/${provider}`);
    });
});