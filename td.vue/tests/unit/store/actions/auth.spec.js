import { AUTH_CLEAR, AUTH_SET_JWT, AUTH_SET_LOCAL } from '@/store/actions/auth.js';

describe('store/actions/auth.js', () => {
    it('defines a clear action', () => {
        expect(AUTH_CLEAR).not.toBeUndefined();
    });

    it('defines a set token action', () => {
        expect(AUTH_SET_JWT).not.toBeUndefined();
    });

    it('defines a set local action', () => {
        expect(AUTH_SET_LOCAL).not.toBeUndefined();
    });
});