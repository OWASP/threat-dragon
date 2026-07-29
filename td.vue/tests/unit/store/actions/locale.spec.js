import localeActions, { localeSelected, resolveLocale } from '@/store/actions/locale.js';
describe('store/actions/locale.js', () => {
    it('defines the selected action', () => {
        expect(localeSelected).not.toBeUndefined();
        expect(typeof localeSelected).toBe('string');
    });

    it('defines the resolve action', () => {
        expect(resolveLocale).not.toBeUndefined();
        expect(typeof resolveLocale).toBe('string');
    });

    it('exports exactly 2 actions under the default export', () => {
        expect(Object.keys(localeActions)).toHaveLength(2);
        expect(localeActions.selected).toBe(localeSelected);
        expect(localeActions.resolve).toBe(resolveLocale);
    });
});