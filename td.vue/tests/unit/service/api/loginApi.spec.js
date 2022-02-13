import api from '@/service/api/api.js';
import loginApi from '@/service/api/loginApi.js';

describe('service/loginApi.js', () => {
    const provider = 'github';
    const code = '12345-123456';

    beforeEach(() => {
        jest.spyOn(api, 'getAsync').mockResolvedValue({ data: '' });
        jest.spyOn(api, 'postAsync').mockResolvedValue({ data: '' });
    });

    describe('loginAsync', () => {
        beforeEach(async () => {
            await loginApi.loginAsync(provider);
        });

        it('calls the providers login endpoint', () => {
            expect(api.getAsync).toHaveBeenCalledWith(`/api/login/${provider}`);
        });
    });

    describe('completeLoginAsync', () => {
        beforeEach(async () => {
            await loginApi.completeLoginAsync(provider, code);
        });

        it('calls the complete login endpoint', () => {
            expect(api.getAsync).toHaveBeenCalledWith(`/api/oauth/${provider}?code=${code}`);
        });
    });

    describe('logoutAsync', () => {
        const refreshToken = 'foobar';
        beforeEach(async () => {
            await loginApi.logoutAsync(refreshToken);
        });

        it('calls the logout endpoint', () => {
            expect(api.postAsync).toHaveBeenCalledWith('/api/logout', expect.anything());
        });

        it('passes the refresh token', () => {
            expect(api.postAsync).toHaveBeenCalledWith(expect.anything(), { refreshToken });
        });
    });
});