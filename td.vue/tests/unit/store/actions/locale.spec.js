import { LOCALE_SELECTED } from '@/store/actions/locale.js';

describe('store/actions/locale.js', () => {
    it('defines a selected action', () => {
        expect(LOCALE_SELECTED).not.toBeUndefined();
    });
});