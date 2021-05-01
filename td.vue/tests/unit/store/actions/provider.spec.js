import { PROVIDER_SELECTED, PROVIDER_CLEAR } from '@/store/actions/provider.js';

describe('store/actions/provider.js', () => {
    it('defines a selected action', () => {
        expect(PROVIDER_SELECTED).not.toBeUndefined();
    });

    it('defines a clear action', () => {
        expect(PROVIDER_CLEAR).not.toBeUndefined();
    });
});