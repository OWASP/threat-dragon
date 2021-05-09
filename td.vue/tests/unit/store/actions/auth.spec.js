import { AUTH_CLEAR, AUTH_SET_JWT } from '@/store/actions/auth.js';

describe('store/actions/auth.js', () => {
    it('defines a clear action', () => {
        expect(AUTH_CLEAR).not.toBeUndefined();
    });

    it('defines a set token action', () => {
        expect(AUTH_SET_JWT).not.toBeUndefined();
    });
});