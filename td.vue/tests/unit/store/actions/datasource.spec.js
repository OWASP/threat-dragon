import { DATASOURCE_PROVIDER_SELECTED, DATASOURCE_PROVIDER_CLEAR } from '@/store/actions/datasource.js';

describe('store/actions/datasource.js', () => {
    it('defines a selected action', () => {
        expect(DATASOURCE_PROVIDER_SELECTED).not.toBeUndefined();
    });

    it('defines a clear action', () => {
        expect(DATASOURCE_PROVIDER_CLEAR).not.toBeUndefined();
    });
});