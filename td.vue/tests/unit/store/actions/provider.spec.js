import {
    PROVIDER_CLEAR,
    PROVIDER_FETCH,
    PROVIDER_SELECTED
} from '@/stores/actions/provider.js';

describe('stores/actions/provider.js', () => {
    it('defines a clear action', () => {
        expect(PROVIDER_CLEAR).not.toBeUndefined();
    });

    it('defines a fetch action', () => {
        expect(PROVIDER_FETCH).not.toBeUndefined();
    });

    it('defines a selected action', () => {
        expect(PROVIDER_SELECTED).not.toBeUndefined();
    });
});
