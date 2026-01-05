import { LOCALE_SELECTED, RESOLVE_LOCALE } from '@/store/actions/locale.js';
import localeActions from '@/store/actions/locale.js';

describe('store/actions/locale.js', () => {
    it('defines the selected action', () => {
        expect(LOCALE_SELECTED).not.toBeUndefined();
        expect(typeof LOCALE_SELECTED).toBe('string');
    });

    it('defines the resolve action', () => {
        expect(RESOLVE_LOCALE).not.toBeUndefined();
        expect(typeof RESOLVE_LOCALE).toBe('string');
    });

    it('exports exactly 2 actions under the default export', () => {
        expect(Object.keys(localeActions)).toHaveLength(2);
        expect(localeActions.selected).toBe(LOCALE_SELECTED);
        expect(localeActions.resolve).toBe(RESOLVE_LOCALE);
    });
});