import {
    providerClear,
    providerFetch,
    providerSelected
} from '@/store/actions/provider.js';

describe('store/actions/provider.js', () => {
    it('defines a clear action', () => {
        expect(providerClear).not.toBeUndefined();
    });

    it('defines a fetch action', () => {
        expect(providerFetch).not.toBeUndefined();
    });

    it('defines a selected action', () => {
        expect(providerSelected).not.toBeUndefined();
    });
});
