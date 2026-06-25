import { LOCALE_SELECTED, RESOLVE_LOCALE } from '@/store/actions/locale.js';
import localeModule from '@/store/modules/locale.js';

// NOTE: Using plain functions, not jest.fn(), because jest.config has
// resetMocks: true which resets jest.fn() implementations before each test.
// Plain functions survive resetMocks and don't lose their implementations.
jest.mock('@/service/locale/locale-resolver', () => {
    const localeResolver = {
        isSupportedLocale: (l) => typeof l === 'string' && l.length > 0 && !/^\d+$/.test(l),
        resolveLocale: () => ({ locale: 'en', method: 'default' }),
        getBrowserLanguages: () => ['en']
    };
    return localeResolver;
});

const mockGlobal = {
    locale: 'en',
    fallbackLocale: { default: 'en' },
    availableLocales: ['en', 'de', 'fr']
};

jest.mock('@/i18n/index', () => ({
    __esModule: true,
    default: { get: () => ({ global: mockGlobal }) },
    SUPPORTED_LOCALES: ['en', 'de', 'fr'],
    DEFAULT_LOCALE: 'en'
}));

describe('store/modules/locale.js', () => {
    const mocks = {
        commit: jest.fn(),
        state: localeModule.state,
        rootGetters: {
            availableLocales: ['en', 'de'],
            allowedLocales: null,
            defaultLocale: undefined
        }
    };

    beforeEach(() => {
        mockGlobal.locale = 'en';
        mockGlobal.fallbackLocale = { default: 'en' };
        mockGlobal.availableLocales = ['en', 'de', 'fr'];
    });

    describe('state', () => {
        it('defines a state object', () => {
            expect(localeModule.state).toBeInstanceOf(Object);
        });

        it('has a locale property set to a string', () => {
            expect(typeof localeModule.state.locale).toEqual('string');
        });
    });

    describe('actions', () => {
        describe('LOCALE_SELECTED', () => {
            it('commits a valid locale that is in the allowed set', () => {
                localeModule.actions[LOCALE_SELECTED](mocks, 'de');
                expect(mocks.commit).toHaveBeenCalledWith(LOCALE_SELECTED, 'de');
            });

            it('rejects a locale not in the allowed set', () => {
                localeModule.actions[LOCALE_SELECTED](mocks, 'fr');
                expect(mocks.commit).not.toHaveBeenCalled();
            });

            it('updates i18n.global.locale when locale is allowed', () => {
                localeModule.actions[LOCALE_SELECTED](mocks, 'de');
                expect(mockGlobal.locale).toBe('de');
            });

            it('does not update i18n.global.locale when locale is rejected', () => {
                localeModule.actions[LOCALE_SELECTED](mocks, 'fr');
                expect(mockGlobal.locale).toBe('en');
            });

            it('syncs fallbackLocale from server default onto i18n singleton', () => {
                const mocksWithDefault = {
                    ...mocks,
                    rootGetters: {
                        ...mocks.rootGetters,
                        allowedLocales: ['en', 'de'],
                        defaultLocale: 'de'
                    }
                };
                localeModule.actions[LOCALE_SELECTED](mocksWithDefault, 'de');
                expect(mockGlobal.fallbackLocale).toEqual({
                    default: 'de'
                });
            });

            it('preserves existing fallbackLocale entries when overriding default', () => {
                mockGlobal.fallbackLocale = {
                    pt: ['pt-BR'],
                    default: 'en'
                };
                const mocksWithDefault = {
                    ...mocks,
                    rootGetters: {
                        ...mocks.rootGetters,
                        allowedLocales: ['en', 'de', 'pt', 'pt-BR'],
                        availableLocales: ['en', 'de', 'pt', 'pt-BR'],
                        defaultLocale: 'de'
                    }
                };
                localeModule.actions[LOCALE_SELECTED](mocksWithDefault, 'pt');
                expect(mockGlobal.fallbackLocale).toEqual({
                    pt: ['pt-BR'],
                    default: 'de'
                });
            });

            it('does not override fallbackLocale when server default is undefined', () => {
                mockGlobal.fallbackLocale = {
                    pt: ['pt-BR'],
                    default: 'en'
                };
                localeModule.actions[LOCALE_SELECTED](mocks, 'en');
                expect(mockGlobal.fallbackLocale).toEqual({
                    pt: ['pt-BR'],
                    default: 'en'
                });
            });
        });

        describe('RESOLVE_LOCALE', () => {
            it('dispatches LOCALE_SELECTED with resolved locale when no user preference', () => {
                const dispatch = jest.fn();
                const ctx = { ...mocks, dispatch };
                localeModule.actions[RESOLVE_LOCALE](ctx);
                expect(dispatch).toHaveBeenCalledWith(LOCALE_SELECTED, 'en');
            });

            it('short-circuits with persisted locale when user has a preference in allowed set', () => {
                const dispatch = jest.fn();
                const ctx = {
                    ...mocks,
                    dispatch,
                    state: { locale: 'de' }
                };
                localeModule.actions[RESOLVE_LOCALE](ctx);
                expect(dispatch).toHaveBeenCalledWith(LOCALE_SELECTED, 'de');
                expect(dispatch).toHaveBeenCalledTimes(1);
            });

            it('falls through to resolution when persisted locale is not in allowed set', () => {
                const dispatch = jest.fn();
                const ctx = {
                    ...mocks,
                    dispatch,
                    state: { locale: 'fr' },
                    rootGetters: {
                        availableLocales: ['en', 'de'],
                        allowedLocales: null,
                        defaultLocale: undefined
                    }
                };
                localeModule.actions[RESOLVE_LOCALE](ctx);
                expect(dispatch).not.toHaveBeenCalledWith(LOCALE_SELECTED, 'fr');
                expect(dispatch).toHaveBeenCalledWith(LOCALE_SELECTED, 'en');
                expect(dispatch).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe('mutations', () => {
        let state;

        beforeEach(() => {
            state = { locale: 'en' };
        });

        describe('selected', () => {
            it('sets the locale', () => {
                localeModule.mutations[LOCALE_SELECTED](state, 'de');
                expect(state.locale).toEqual('de');
            });
        });

        it('rejects locale with invalid format (numeric string)', () => {
            localeModule.mutations[LOCALE_SELECTED](state, '12345');
            expect(state.locale).toEqual('en');
        });

        it('does not update state when locale is not supported', () => {
            localeModule.mutations[LOCALE_SELECTED](state, '');
            expect(state.locale).toBe('en');
        });
    });

    describe('getters', () => {
        it('returns all supported locales when no allowedLocales are set', () => {
            const result = localeModule.getters.availableLocales(
                {}, {}, {}, { allowedLocales: null }
            );
            expect(result).toEqual(['en', 'de', 'fr']);
        });

        it('returns full SUPPORTED_LOCALES when allowedLocales is an empty array', () => {
            const result = localeModule.getters.availableLocales(
                {}, {}, {}, { allowedLocales: [] }
            );
            expect(result).toEqual(['en', 'de', 'fr']);
        });

        it('returns full SUPPORTED_LOCALES when allowedLocales is undefined', () => {
            const result = localeModule.getters.availableLocales(
                {}, {}, {}, {}
            );
            expect(result).toEqual(['en', 'de', 'fr']);
        });

        it('ignores invalid allowedLocales types in getter', () => {
            const result = localeModule.getters.availableLocales(
                {}, {}, {}, { allowedLocales: 'not-an-array' }
            );
            expect(result).toEqual(['en', 'de', 'fr']);
        });

        it('filters to allowed locales when configured', () => {
            const result = localeModule.getters.availableLocales(
                {}, {}, {}, { allowedLocales: ['en', 'de'] }
            );
            expect(result).toEqual(['en', 'de']);
        });

        it('excludes locales not in supported list', () => {
            const result = localeModule.getters.availableLocales(
                {}, {}, {}, { allowedLocales: ['en', 'xx'] }
            );
            expect(result).toEqual(['en']);
        });
    });

    it('defines a getters object', () => {
        expect(localeModule.getters).toBeInstanceOf(Object);
    });

    describe('LOCALE_SELECTED edge cases', () => {
        it('skips syncI18nWithServerPolicy when serverDefault is falsy', () => {
            mockGlobal.fallbackLocale = { pt: ['pt-BR'], default: 'en' };
            localeModule.actions[LOCALE_SELECTED](
                {
                    commit: jest.fn(),
                    rootGetters: {
                        availableLocales: ['en', 'de'],
                        defaultLocale: undefined
                    }
                },
                'en'
            );
            expect(mockGlobal.fallbackLocale).toEqual({
                pt: ['pt-BR'],
                default: 'en'
            });
        });
    });

    describe('RESOLVE_LOCALE edge cases', () => {
        it('keeps current locale when already set and valid', () => {
            const dispatch = jest.fn();
            localeModule.actions[RESOLVE_LOCALE]({
                dispatch,
                rootGetters: {
                    availableLocales: ['en', 'fr'],
                    defaultLocale: 'en',
                    allowedLocales: ['en']
                },
                state: { locale: 'fr' }
            });
            expect(dispatch).toHaveBeenCalledWith(LOCALE_SELECTED, 'fr');
        });

        it('falls through when persisted locale is not in availableLocales', () => {
            const dispatch = jest.fn();
            localeModule.actions[RESOLVE_LOCALE]({
                dispatch,
                state: { locale: 'fr' },
                rootGetters: {
                    availableLocales: ['en', 'de'],
                    allowedLocales: ['en', 'de'],
                    defaultLocale: 'en'
                }
            });
            expect(dispatch).toHaveBeenCalledWith(LOCALE_SELECTED, 'en');
        });
    });
});
