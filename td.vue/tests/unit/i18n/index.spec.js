import { DEFAULT_LOCALE, SUPPORTED_LOCALES, t, tc } from '@/i18n/index.js';
import i18nFactory from '@/i18n/index.js';

describe('i18n/index.js', () => {
    describe('DEFAULT_LOCALE', () => {
        it('uses en as the supported default locale', () => {
            expect(DEFAULT_LOCALE).toBe('en');
            expect(SUPPORTED_LOCALES).toContain(DEFAULT_LOCALE);
        });
    });

    describe('SUPPORTED_LOCALES', () => {
        it('is a frozen array of all expected locales', () => {
            const expected = [
                'ar', 'de', 'el', 'en', 'es', 'fi', 'fr',
                'hi', 'id', 'ja', 'ms', 'pt', 'pt-BR', 'zh'
            ];

            expect(Array.isArray(SUPPORTED_LOCALES)).toBe(true);
            expect(Object.isFrozen(SUPPORTED_LOCALES)).toBe(true);
            expect(SUPPORTED_LOCALES).toEqual(expect.arrayContaining(expected));
            expect(SUPPORTED_LOCALES.length).toEqual(expected.length);
        });

        it('excludes ru and uk (hidden locales)', () => {
            expect(SUPPORTED_LOCALES).not.toContain('ru');
            expect(SUPPORTED_LOCALES).not.toContain('uk');
        });

        it('includes both pt and pt-BR', () => {
            expect(SUPPORTED_LOCALES).toContain('pt');
            expect(SUPPORTED_LOCALES).toContain('pt-BR');
        });
    });

    describe('singleton lifecycle', () => {
        it('returns the same instance on repeated calls', () => {
            expect(i18nFactory.get()).toBe(i18nFactory.get());
        });
    });

    describe('compatibility layer (installLegacyCompat)', () => {
        afterEach(() => {
            // Restore the default locale to avoid leaking mutations
            i18nFactory.get().locale = DEFAULT_LOCALE;
        });

        it('proxies locale through legacy getter/setter', () => {
            const instance = i18nFactory.get();

            expect(instance.locale).toBe('en');
            expect(instance.global.locale).toBe('en');

            instance.locale = 'fr';
            expect(instance.global.locale).toBe('fr');
            expect(instance.locale).toBe('fr');
        });

        it('provides instance.t() bound to global.t', () => {
            const instance = i18nFactory.get();

            expect(typeof instance.t).toBe('function');
            expect(instance.t('home.title'))
                .toEqual(instance.global.t('home.title'));
        });
    });

    describe('fallback chain', () => {
        it('configures pt fallback to pt-BR', () => {
            const instance = i18nFactory.get();
            const fallback = instance.global.fallbackLocale;

            expect(fallback).toBeDefined();
            expect(fallback.pt).toEqual(['pt-BR']);
            expect(fallback.default).toBe('en');
        });
    });

    describe('installLegacyCompat branch coverage', () => {
        beforeEach(() => {
            jest.resetModules();
        });

        it('adds missing t property when vue-i18n does not provide it', async () => {
            jest.doMock('vue-i18n', () => ({
                createI18n: jest.fn(() => ({
                    global: {
                        t: jest.fn(() => 'ok'),
                        locale: 'en'
                    }
                }))
            }));

            const module = await import('@/i18n/index.js');
            const instance = module.default.get();
            const descriptor = Object.getOwnPropertyDescriptor(instance, 'locale');

            expect(typeof instance.t).toBe('function');
            expect(descriptor).toBeDefined();
            expect(typeof descriptor.get).toBe('function');
            expect(typeof descriptor.set).toBe('function');
        });
    });

    describe('createI18n initialization path', () => {
        beforeEach(() => {
            jest.resetModules();
        });

        it('creates the singleton on first get() with real vue-i18n', async () => {
            const module = await import('@/i18n/index.js');
            const instance = module.default.get();
            const descriptor = Object.getOwnPropertyDescriptor(instance, 'locale');

            expect(instance).toBeDefined();
            expect(instance.global.locale).toBe('en');

            expect(descriptor).toBeDefined();
            expect(typeof descriptor.get).toBe('function');
            expect(typeof descriptor.set).toBe('function');
            expect(typeof instance.t).toBe('function');
            expect(instance.t('home.title'))
                .toEqual(instance.global.t('home.title'));
        });
    });

    describe('t()', () => {
        it('translates a known key to a non-empty string', () => {
            const result = t('home.title');

            expect(typeof result).toBe('string');
            expect(result.length).toBeGreaterThan(0);
        });
    });

    describe('tc()', () => {
        it('delegates to t() on the composer', () => {
            const spy = jest.spyOn(i18nFactory.get().global, 't');
            tc('home.title');

            expect(spy).toHaveBeenCalledWith('home.title');

            spy.mockRestore();
        });
    });
});

