import { resolveLocale, getBrowserLanguages, isSupportedLocale } from '@/service/locale/locale-resolver';

const supported = () => ['en', 'es', 'de', 'fr', 'pt', 'pt-BR', 'ja'];

describe('service/locale/locale-resolver.js', () => {
    // Mock Intl.getCanonicalLocales so tests validate resolver logic
    const mockIntl = (l) => {
        if (!l || l === '???') throw new RangeError('invalid');
        return [String(l)];
    };

    const resolve = (overrides = {}) =>
        resolveLocale({
            browserLanguages: [],
            serverDefault: undefined,
            allowedLocales: [],
            supportedLocales: supported(),
            ...overrides,
        });

    beforeEach(() => {
        jest.spyOn(Intl, 'getCanonicalLocales').mockImplementation(mockIntl);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });


    describe('resolution order', () => {
        it('returns browser locale with BROWSER method when browser language matches allowed and supported locales', () => {
            expect(
                resolve({
                    browserLanguages: ['es'],
                    allowedLocales: ['es']
                })
            ).toEqual({
                locale: 'es',
                method: 'browser'
            });
        });

        it('matches browser base language when region-specific variant is not in allowed locales', () => {
            expect(
                resolve({
                    browserLanguages: ['pt-BR', 'en'],
                    serverDefault: 'es',
                    allowedLocales: ['en', 'pt']
                })
            ).toEqual({
                locale: 'pt',
                method: 'browser'
            });
        });

        it('prioritizes exact browser locale match over base language fallback when both are allowed', () => {
            expect(
                resolve({
                    browserLanguages: ['fr-FR', 'en'],
                    serverDefault: 'es',
                    allowedLocales: ['en', 'fr', 'de']
                })
            ).toEqual({
                locale: 'fr',
                method: 'browser'
            });
        });

        it('falls back to SERVER method when no browser locale matches allowed set', () => {
            expect(
                resolve({
                    browserLanguages: ['fr', 'ja'],
                    serverDefault: 'de',
                    allowedLocales: ['de', 'en']
                })
            ).toEqual({
                locale: 'de',
                method: 'server'
            });
        });

        it('prioritizes BROWSER method over SERVER method when both match allowed set', () => {
            expect(
                resolve({
                    browserLanguages: ['pt-BR'],
                    serverDefault: 'en',
                    allowedLocales: ['pt-BR', 'en']
                })
            ).toEqual({
                locale: 'pt-BR',
                method: 'browser'
            });
        });

        it('uses BROWSER method when server default is not in allowed set', () => {
            expect(
                resolve({
                    browserLanguages: ['de'],
                    serverDefault: 'fr',
                    allowedLocales: ['en', 'de']
                })
            ).toEqual({
                locale: 'de',
                method: 'browser'
            });
        });

        it('uses BROWSER method when server default is undefined', () => {
            expect(
                resolve({
                    browserLanguages: ['fr'],
                    serverDefault: undefined
                })
            ).toEqual({
                locale: 'fr',
                method: 'browser'
            });
        });
    });


    describe('default supported locales', () => {
        it('uses CANONICAL_SUPPORTED_LOCALES when supportedLocales is not provided', () => {
            expect(
                resolveLocale({
                    browserLanguages: ['en'],
                    allowedLocales: []
                })
            ).toEqual({
                locale: 'en',
                method: 'browser'
            });
        });
    });


    describe('input filtering', () => {
        it('skips browser locales that fail canonicalization and uses the next valid one', () => {
            expect(
                resolve({
                    browserLanguages: ['???', 'es'],
                    allowedLocales: ['es']
                })
            ).toEqual({
                locale: 'es',
                method: 'browser'
            });
        });

        it('ignores server default when it fails canonicalization', () => {
            expect(
                resolve({
                    browserLanguages: ['es'],
                    serverDefault: '???',
                    supportedLocales: ['es', 'en']
                })
            ).toEqual({
                locale: 'es',
                method: 'browser'
            });
        });

        it('returns DEFAULT method when all locale inputs fail canonicalization', () => {
            expect(
                resolve({
                    browserLanguages: ['???'],
                    serverDefault: '???',
                    supportedLocales: []
                })
            ).toEqual({
                locale: 'en',
                method: 'default'
            });
        });

        it('uses SERVER method when browserLanguages is undefined', () => {
            expect(
                resolve({
                    browserLanguages: undefined,
                    serverDefault: 'en'
                })
            ).toEqual({
                locale: 'en',
                method: 'server'
            });
        });

        it('returns DEFAULT method when browserLanguages is a string instead of an array', () => {
            expect(
                resolve({
                    browserLanguages: 'string'
                })
            ).toEqual({
                locale: 'en',
                method: 'default'
            });
        });

        it('uses BROWSER method when allowedLocales is undefined', () => {
            expect(
                resolve({
                    browserLanguages: ['es'],
                    serverDefault: undefined
                })
            ).toEqual({
                locale: 'es',
                method: 'browser'
            });
        });

        it('uses BROWSER method when allowedLocales is a string instead of an array', () => {
            expect(
                resolve({
                    browserLanguages: ['es'],
                    serverDefault: undefined,
                    allowedLocales: 'string'
                })
            ).toEqual({
                locale: 'es',
                method: 'browser'
            });
        });

        it('filters out null and undefined entries from browserLanguages', () => {
            expect(
                resolve({
                    browserLanguages: [null, undefined],
                    serverDefault: 'en'
                })
            ).toEqual({
                locale: 'en',
                method: 'server'
            });
        });

        it('filters out whitespace-only strings from browserLanguages', () => {
            expect(
                resolve({
                    browserLanguages: ['   ']
                })
            ).toEqual({
                locale: 'en',
                method: 'default'
            });
        });

        it('trims whitespace from browser locale strings before matching', () => {
            expect(
                resolve({
                    browserLanguages: [' es '],
                    allowedLocales: ['es']
                })
            ).toEqual({
                locale: 'es',
                method: 'browser'
            });
        });

        it('trims whitespace from allowed locale strings before matching', () => {
            expect(
                resolve({
                    browserLanguages: ['es'],
                    allowedLocales: [' es ']
                })
            ).toEqual({
                locale: 'es',
                method: 'browser'
            });
        });

        it('trims whitespace from supported locale strings before matching', () => {
            expect(
                resolve({
                    browserLanguages: ['es'],
                    supportedLocales: [' es ']
                })
            ).toEqual({
                locale: 'es',
                method: 'browser'
            });
        });

        it('filters out non-string and whitespace-only entries from allowedLocales', () => {
            expect(
                resolve({
                    browserLanguages: ['es'],
                    allowedLocales: [null, 'es', '   ']
                })
            ).toEqual({
                locale: 'es',
                method: 'browser'
            });
        });

        it('returns DEFAULT method when serverDefault is null', () => {
            expect(
                resolve({
                    browserLanguages: []
                })
            ).toEqual({
                locale: 'en',
                method: 'default'
            });
        });

        it('returns DEFAULT method when supportedLocales is null', () => {
            expect(
                resolve({
                    browserLanguages: ['xx'],
                    supportedLocales: null
                })
            ).toEqual({
                locale: 'en',
                method: 'default'
            });
        });

        it('returns DEFAULT method when no browser locale matches allowed set', () => {
            expect(
                resolve({
                    browserLanguages: ['xx-YY'],
                    allowedLocales: ['en']
                })
            ).toEqual({
                locale: 'en',
                method: 'default'
            });
        });

        it('handles duplicate browser locale entries without errors or duplication issues', () => {
            expect(
                resolve({
                    browserLanguages: ['es', 'es'],
                    allowedLocales: ['es']
                })
            ).toEqual({
                locale: 'es',
                method: 'browser'
            });
        });

        it('truncates browserLanguages array to MAX_ARRAY_SIZE when larger than limit', () => {
            // 100 '???' followed by 'es' at position 101; truncation cuts
            // 'es' off so no match is found → default
            const locales = Array.from({ length: 100 }, () => '???');
            locales.push('es');
            expect(
                resolve({
                    browserLanguages: locales,
                    allowedLocales: ['es']
                })
            ).toEqual({
                locale: 'en',
                method: 'default'
            });
        });

        it('processes browserLanguages array when exactly at MAX_ARRAY_SIZE', () => {
            // 99 '???' then 'es' at position 100; 'es' is within the limit
            // and should match
            const locales = Array.from({ length: 99 }, () => '???');
            locales.push('es');
            expect(
                resolve({
                    browserLanguages: locales,
                    allowedLocales: ['es']
                })
            ).toEqual({
                locale: 'es',
                method: 'browser'
            });
        });
    });


    describe('locale acceptance', () => {
        it('rejects locale that is in allowedLocales but not in supportedLocales', () => {
            expect(
                resolve({
                    allowedLocales: ['it'],
                    supportedLocales: ['en', 'es']
                })
            ).toEqual({
                locale: 'en',
                method: 'default'
            });
        });

        it('rejects browser locale that is supported but not in allowedLocales', () => {
            expect(
                resolve({
                    browserLanguages: ['fr'],
                    allowedLocales: ['de']
                })
            ).toEqual({
                locale: 'en',
                method: 'default'
            });
        });

        it('rejects server default that is in allowedLocales but not in supportedLocales', () => {
            expect(
                resolve({
                    serverDefault: 'it',
                    supportedLocales: ['en', 'es']
                })
            ).toEqual({
                locale: 'en',
                method: 'default'
            });
        });

        it('uses FALLBACK method when locale is supported but not allowed', () => {
            expect(
                resolve({
                    allowedLocales: ['fr'],
                    supportedLocales: ['es', 'fr']
                })
            ).toEqual({
                locale: 'es',
                method: 'fallback'
            });
        });
    });


    describe('fallback locale selection', () => {
        it('uses DEFAULT method with DEFAULT_LOCALE when it exists in supportedLocales', () => {
            expect(
                resolve({
                    browserLanguages: ['xx'],
                    supportedLocales: ['en', 'fr']
                })
            ).toEqual({
                locale: 'en',
                method: 'default'
            });
        });

        it('uses FALLBACK method with first supported locale when DEFAULT_LOCALE is not in supportedLocales', () => {
            expect(
                resolve({
                    browserLanguages: ['xx'],
                    supportedLocales: ['fr', 'de']
                })
            ).toEqual({
                locale: 'fr',
                method: 'fallback'
            });
        });

        it('uses DEFAULT method with DEFAULT_LOCALE even when supportedLocales list is empty', () => {
            expect(
                resolve({
                    browserLanguages: ['xx'],
                    supportedLocales: []
                })
            ).toEqual({
                locale: 'en',
                method: 'default'
            });
        });
    });


    describe('getBrowserLanguages', () => {
        it('returns canonicalized languages from navigator.languages array in order', () => {
            expect(
                getBrowserLanguages({
                    languages: ['en-US', 'pt-BR', 'en']
                })
            ).toEqual(['en-US', 'pt-BR', 'en']);
        });

        it('preserves case of region as returned by Intl canonicalization', () => {
            expect(
                getBrowserLanguages({
                    languages: ['pt-br']
                })
            ).toEqual(['pt-br']);
        });

        it('falls back to navigator.language when navigator.languages is empty array', () => {
            expect(
                getBrowserLanguages({
                    languages: [],
                    language: 'fr'
                })
            ).toEqual(['fr']);
        });

        it('returns DEFAULT_LOCALE when navigator object is null', () => {
            expect(
                getBrowserLanguages(null)
            ).toEqual(['en']);
        });

        it('returns DEFAULT_LOCALE when navigator.languages is empty and navigator.language is undefined', () => {
            expect(
                getBrowserLanguages({
                    languages: []
                })
            ).toEqual(['en']);
        });

        it('returns DEFAULT_LOCALE when languages array contains only non-string values', () => {
            expect(
                getBrowserLanguages({
                    languages: [null, undefined]
                })
            ).toEqual(['en']);
        });

        it('uses navigator.language when navigator.languages is undefined', () => {
            expect(
                getBrowserLanguages({
                    language: 'es-ES'
                })
            ).toEqual(['es-ES']);
        });

        it('uses navigator.language when navigator.languages is null', () => {
            expect(
                getBrowserLanguages({
                    languages: null,
                    language: 'fr'
                })
            ).toEqual(['fr']);
        });

        it('returns DEFAULT_LOCALE when all locale sources fail canonicalization and no valid language exists', () => {
            expect(
                getBrowserLanguages({
                    languages: ['???', null, undefined]
                })
            ).toEqual(['en']);
        });

        it('returns DEFAULT_LOCALE when both languages and language contain invalid values', () => {
            expect(
                getBrowserLanguages({
                    languages: ['???'],
                    language: '???'
                })
            ).toEqual(['en']);
        });

        it('falls back to navigator.language when languages array entries all fail canonicalization but language is valid', () => {
            expect(
                getBrowserLanguages({
                    languages: ['???', null, undefined],
                    language: 'de'
                })
            ).toEqual(['de']);
        });

        it('filters out invalid locales from languages array while preserving valid ones', () => {
            expect(
                getBrowserLanguages({
                    languages: ['???', 'en-US'],
                    language: '???'
                })
            ).toEqual(['en-US']);
        });

        it('truncates navigator.languages array to MAX_ARRAY_SIZE when larger than limit', () => {
            // 101 valid entries should be truncated to 100
            const languages = Array.from({ length: 101 }, () => 'en');
            expect(
                getBrowserLanguages({
                    languages: languages
                })
            ).toHaveLength(100);
        });

        it('preserves navigator.languages array when exactly at MAX_ARRAY_SIZE', () => {
            const languages = Array.from({ length: 100 }, () => 'en');
            expect(
                getBrowserLanguages({
                    languages: languages
                })
            ).toHaveLength(100);
        });
    });


    describe('isSupportedLocale', () => {
        it('returns true when locale exists in supportedLocales after canonicalization', () => {
            expect(
                isSupportedLocale('en', ['en', 'de'])
            ).toBe(true);
        });

        it('returns false when locale does not exist in supportedLocales after canonicalization', () => {
            expect(
                isSupportedLocale('it', ['en', 'de'])
            ).toBe(false);
        });

        it('returns false when locale is null', () => {
            expect(
                isSupportedLocale(null)
            ).toBe(false);
        });

        it('returns false when locale is empty string', () => {
            expect(
                isSupportedLocale('')
            ).toBe(false);
        });

        it('returns false when locale is non-string value', () => {
            expect(
                isSupportedLocale(123)
            ).toBe(false);
        });

        it('uses CANONICAL_SUPPORTED_LOCALES when supportedLocales not provided', () => {
            expect(
                isSupportedLocale('en')
            ).toBe(true);
        });

        it('returns false when Intl.getCanonicalLocales returns empty array', () => {
            jest.restoreAllMocks();
            jest.spyOn(Intl, 'getCanonicalLocales').mockImplementation(() => []);

            expect(
                isSupportedLocale('en', ['en'])
            ).toBe(false);
        });

        it('returns false when locale string length exceeds MAX_LOCALE_LENGTH', () => {
            expect(
                isSupportedLocale('a'.repeat(101), ['en'])
            ).toBe(false);
        });

        it('allows locale string length at MAX_LOCALE_LENGTH to reach canonicalization', () => {
            const locale = 'a'.repeat(100);
            expect(
                isSupportedLocale(locale, [locale])
            ).toBe(true);
        });

        it('removes locale string from sanitizeArray when length exceeds MAX_LOCALE_LENGTH * 2', () => {
            const longEntry = 'x'.repeat(201);
            expect(
                resolve({ browserLanguages: [longEntry, 'es'], allowedLocales: ['es'] })
            ).toEqual({
                locale: 'es',
                method: 'browser'
            });
        });

        it('preserves locale string in sanitizeArray when length is at MAX_LOCALE_LENGTH * 2', () => {
            const edgeEntry = 'x'.repeat(200);
            expect(
                resolve({ browserLanguages: [edgeEntry], serverDefault: 'en' })
            ).toEqual({
                locale: 'en',
                method: 'server'
            });
        });
    });


    // If ever flaky, we want to know!
    describe('real Intl canonicalization', () => {
        it('matches base language from canonicalized browser locale when region differs', () => {
            jest.restoreAllMocks();

            expect(
                resolveLocale({
                    browserLanguages: ['PT-br'],
                    allowedLocales: ['pt'],
                    supportedLocales: ['pt']
                })
            ).toEqual({
                locale: 'pt',
                method: 'browser'
            });
        });

        it('prioritizes BROWSER method over SERVER method when both are allowed', () => {
            jest.restoreAllMocks();

            expect(
                resolveLocale({
                    browserLanguages: ['en'],
                    serverDefault: 'fr',
                    allowedLocales: ['en', 'fr'],
                    supportedLocales: ['en', 'fr']
                })
            ).toEqual({
                locale: 'en',
                method: 'browser'
            });
        });

        it('canonicalizes locale casing in getBrowserLanguages', () => {
            jest.restoreAllMocks();

            expect(
                getBrowserLanguages({
                    languages: ['PT-br']
                })
            ).toEqual(['pt-BR']);
        });
    });
});