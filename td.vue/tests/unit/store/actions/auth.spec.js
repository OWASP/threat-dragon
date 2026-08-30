import { authClear, authSetJwt, authSetLocal, logout } from '@/store/actions/auth.js';

describe('store/actions/auth.js', () => {
    it('defines a clear action', () => {
        expect(authClear).not.toBeUndefined();
    });

    it('defines a set token action', () => {
        expect(authSetJwt).not.toBeUndefined();
    });

    it('defines a set local action', () => {
        expect(authSetLocal).not.toBeUndefined();
    });

    it('defines a logout action', () => {
        expect(logout).not.toBeUndefined();
    });
});