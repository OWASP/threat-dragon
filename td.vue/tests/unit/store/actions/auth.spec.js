import { AUTH_PROVIDER_SELECTED, AUTH_PROVIDER_CLEAR } from '@/store/actions/auth.js';

describe('store/actions/auth.js', () => {
    it('defines a selected action', () => {
        expect(AUTH_PROVIDER_SELECTED).not.toBeUndefined();
    });

    it('defines a clear action', () => {
        expect(AUTH_PROVIDER_CLEAR).not.toBeUndefined();
    });
});