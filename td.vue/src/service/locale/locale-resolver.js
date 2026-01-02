import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@/i18n/index';

// Guards against pathological input. 100 chars covers any valid BCP47 tag
// with room to spare; Intl.getCanonicalLocales will reject junk but we
// short-circuit before calling it.
const MAX_LOCALE_LENGTH = 100;

// Prevents processing unbounded arrays from untrusted input.
const MAX_ARRAY_SIZE = 100;

const LOCALE_METHOD = Object.freeze({
    SERVER: 'server',
    BROWSER: 'browser',
    FALLBACK: 'fallback',
    DEFAULT: 'default'
});

const sanitizeArray = (v) => {
    if (!Array.isArray(v)) return [];
    const limited = v.length > MAX_ARRAY_SIZE ? v.slice(0, MAX_ARRAY_SIZE) : v;
    return limited
        .filter((i) => typeof i === 'string' && i.length <= MAX_LOCALE_LENGTH * 2)
        .map((i) => i.normalize('NFC').trim())
        .filter((str) => str !== '');
};

const canonicalizeLocale = (locale) => {
    if (typeof locale !== 'string' || locale.length === 0) return null;
    if (locale.length > MAX_LOCALE_LENGTH) return null;
    try {
        return Intl.getCanonicalLocales(locale)[0] ?? null;
    } catch {
        return null;
    }
};

const CANONICAL_SUPPORTED_LOCALES = Object.freeze(
    SUPPORTED_LOCALES
        .map((l) => canonicalizeLocale(l))
        .filter((locale) => locale !== null)
);

const normalizeList = (list) => {
    if (list === CANONICAL_SUPPORTED_LOCALES) return list;
    return sanitizeArray(list)
        .map((l) => canonicalizeLocale(l))
        .filter((locale) => locale !== null);
};

const normalizeLocale = (locale, supportedLocales = CANONICAL_SUPPORTED_LOCALES) => {
    const canonical = canonicalizeLocale(locale);
    if (!canonical) return undefined;
    return supportedLocales.includes(canonical) ? canonical : undefined;
};

export const isSupportedLocale = (locale, supportedLocales = CANONICAL_SUPPORTED_LOCALES) => {
    return normalizeLocale(locale, supportedLocales) !== undefined;
};

const candidates = (locale) => {
    if (typeof locale !== 'string') return [];
    const parts = locale.split('-');
    if (parts.length === 1) return [locale];
    return [locale, parts[0]];
};

const isLocaleAccepted = (locale, allowed, supported) => {
    if (!supported.includes(locale)) return false;
    if (allowed.length === 0) return true;
    return allowed.includes(locale);
};

const findMatch = (locale, allowed, supported) => {
    const normalized = canonicalizeLocale(locale);
    if (!normalized) return undefined;
    return candidates(normalized).find((c) => isLocaleAccepted(c, allowed, supported));
};

const findBrowserMatch = (browsers, allowed, supported) => {
    for (const lang of browsers) {
        // Lang here is already canonical — skip re-canonicalization
        const match = candidates(lang).find((c) => isLocaleAccepted(c, allowed, supported));
        if (match) return match;
    }
    return undefined;
};

const selectDefaultLocale = (supported, preferred = DEFAULT_LOCALE) => {
    if (supported.includes(preferred)) return preferred;
    if (supported.length === 0) return preferred;
    return supported[0];
};


export const resolveLocale = ({
    browserLanguages,
    serverDefault,
    allowedLocales,
    supportedLocales = CANONICAL_SUPPORTED_LOCALES,
}) => {
    const allowed = normalizeList(allowedLocales);
    const browsers = normalizeList(browserLanguages);
    const supported = normalizeList(supportedLocales);

    const browserMatch = findBrowserMatch(browsers, allowed, supported);
    if (browserMatch) {
        return { locale: browserMatch, method: LOCALE_METHOD.BROWSER };
    }
    const serverMatch = findMatch(serverDefault, allowed, supported);
    if (serverMatch) {
        return { locale: serverMatch, method: LOCALE_METHOD.SERVER };
    }

    const fallbackLocale = selectDefaultLocale(supported);
    const fallbackMethod = fallbackLocale === DEFAULT_LOCALE
        ? LOCALE_METHOD.DEFAULT
        : LOCALE_METHOD.FALLBACK;
    return { locale: fallbackLocale, method: fallbackMethod };
};

export const getBrowserLanguages = (navigatorLike) => {
    if (!navigatorLike) {
        return [DEFAULT_LOCALE];
    }

    if (Array.isArray(navigatorLike.languages) && navigatorLike.languages.length > 0) {
        const limited = navigatorLike.languages.length > MAX_ARRAY_SIZE
            ? navigatorLike.languages.slice(0, MAX_ARRAY_SIZE)
            : navigatorLike.languages;
        const valid = limited
            .map((raw) => canonicalizeLocale(raw))
            .filter(Boolean);
        if (valid.length > 0) return valid;
    }

    if (navigatorLike.language) {
        const normalized = canonicalizeLocale(navigatorLike.language);
        if (normalized) return [normalized];
    }

    return [DEFAULT_LOCALE];
};
