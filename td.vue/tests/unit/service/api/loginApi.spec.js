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
        beforeEach(() => {
            console.log = jest.fn();
            console.error = jest.fn();
            
            api.postAsync.mockResolvedValue({
                data: {
                    accessToken: 'test-access-token',
                    refreshToken: 'test-refresh-token'
                }
            });
        });
        
        it('calls the complete login endpoint with valid code', async () => {
            await loginApi.completeLoginAsync(provider, code);
            expect(api.postAsync).toHaveBeenCalledWith(`/api/oauth/${provider}/completeLogin`, { code });
        });
        
        it('throws error when code is missing', async () => {
            await expect(loginApi.completeLoginAsync(provider, null))
                .rejects.toThrow('No authorization code provided');
        });
        
        it('validates response format and throws error for invalid responses', async () => {
            // Mock invalid response (missing tokens)
            api.postAsync.mockResolvedValue({ data: {} });
            
            await expect(loginApi.completeLoginAsync(provider, code))
                .rejects.toThrow('Invalid server response format');
        });
        
        it('handles API errors', async () => {
            const testError = new Error('API error');
            api.postAsync.mockRejectedValue(testError);
            
            await expect(loginApi.completeLoginAsync(provider, code))
                .rejects.toThrow('API error');
                
            expect(console.error).toHaveBeenCalled();
        });
        
        it('logs securely without exposing tokens', async () => {
            await loginApi.completeLoginAsync(provider, code);
            
            // Check that no log contains the actual code or tokens
            const allCalls = console.log.mock.calls.flat();
            // Filter to only include string messages
            const stringLogs = allCalls.filter(logMsg => typeof logMsg === 'string');
            const sensitiveData = [code, 'test-access-token', 'test-refresh-token'];
            
            sensitiveData.forEach(data => {
                stringLogs.forEach(logMsg => {
                    expect(logMsg).not.toContain(data);
                });
            });
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