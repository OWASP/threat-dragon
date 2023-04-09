import { LOCALE_SELECTED } from '@/stores/actions/locale.js';

describe('stores/actions/locale.js', () => {
    it('defines a selected action', () => {
        expect(LOCALE_SELECTED).not.toBeUndefined();
    });
});
