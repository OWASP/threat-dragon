import { defaultLocale, supportedLocales } from '@/i18n/index';

// Guards against pathological input. 100 chars covers any valid BCP47 tag
// with room to spare; Intl.getCanonicalLocales will reject junk but we
// short-circuit before calling it.
const maxLocaleLength = 100;

// Prevents processing unbounded arrays from untrusted input.
const maxArraySize = 100;

const localeMethod = Object.freeze({
    SERVER: 'server',
    BROWSER: 'browser',
    FALLBACK: 'fallback',
    DEFAULT: 'default'
});

const sanitizeArray = (v) => {
    if (!Array.isArray(v)) return [];
    const limited = v.length > maxArraySize ? v.slice(0, maxArraySize) : v;
    return limited
        .filter((i) => typeof i === 'string' && i.length <= maxLocaleLength * 2)
        .map((i) => i.normalize('NFC').trim())
        .filter((str) => str !== '');
};

const canonicalizeLocale = (locale) => {
    if (typeof locale !== 'string' || locale.length === 0) return null;
    if (locale.length > maxLocaleLength) return null;
    try {
        return Intl.getCanonicalLocales(locale)[0] ?? null;
    } catch {
        return null;
    }
};

const canonicalSupportedLocales = Object.freeze(
    supportedLocales
        .map((l) => canonicalizeLocale(l))
        .filter((locale) => locale !== null)
);

const normalizeList = (list) => {
    if (list === canonicalSupportedLocales) return list;
    return sanitizeArray(list)
        .map((l) => canonicalizeLocale(l))
        .filter((locale) => locale !== null);
};

const normalizeLocale = (locale, supportedLocales = canonicalSupportedLocales) => {
    const canonical = canonicalizeLocale(locale);
    if (!canonical) return undefined;
    return supportedLocales.includes(canonical) ? canonical : undefined;
};

export const isSupportedLocale = (locale, supportedLocales = canonicalSupportedLocales) => {
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

const selectDefaultLocale = (supported, preferred = defaultLocale) => {
    if (supported.includes(preferred)) return preferred;
    if (supported.length === 0) return preferred;
    return supported[0];
};


export const resolveLocale = ({
    browserLanguages,
    serverDefault,
    allowedLocales,
    supportedLocales = canonicalSupportedLocales,
}) => {
    const allowed = normalizeList(allowedLocales);
    const browsers = normalizeList(browserLanguages);
    const supported = normalizeList(supportedLocales);

    const browserMatch = findBrowserMatch(browsers, allowed, supported);
    if (browserMatch) {
        return { locale: browserMatch, method: localeMethod.BROWSER };
    }
    const serverMatch = findMatch(serverDefault, allowed, supported);
    if (serverMatch) {
        return { locale: serverMatch, method: localeMethod.SERVER };
    }

    const fallbackLocale = selectDefaultLocale(supported);
    const fallbackMethod = fallbackLocale === defaultLocale
        ? localeMethod.DEFAULT
        : localeMethod.FALLBACK;
    return { locale: fallbackLocale, method: fallbackMethod };
};

export const getBrowserLanguages = (navigatorLike) => {
    if (!navigatorLike) {
        return [defaultLocale];
    }

    if (Array.isArray(navigatorLike.languages) && navigatorLike.languages.length > 0) {
        const limited = navigatorLike.languages.length > maxArraySize
            ? navigatorLike.languages.slice(0, maxArraySize)
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

    return [defaultLocale];
};
