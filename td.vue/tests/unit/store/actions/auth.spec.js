import { AUTH_SET_JWT } from '@/store/actions/auth.js';

describe('store/actions/auth.js', () => {
    it('defines a set token action', () => {
        expect(AUTH_SET_JWT).not.toBeUndefined();
    });
});