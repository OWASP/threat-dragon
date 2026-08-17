import { isNullish, isString } from './validators.helper.js';
import { errorCodes } from '../constants/errorCodes.js';

const fallbackLocale = 'en';
const localeRegex = /^[a-zA-Z]{2}(?:-[a-zA-Z]{2})?$/u;
const configError = (code, meta = {}) => ({ code, meta });

export const normalizeLocale = (locale, intl = Intl) => {
    if (!isString(locale)) {return null;}

    const trimmed = locale.trim();
    if (!localeRegex.test(trimmed)) {return null;}

    try {
        return intl.getCanonicalLocales(trimmed)[0];
    } catch {
        return null;
    }
};

const toLocaleOrError = (entry, intl) => {
    if (!isString(entry)) {
        return { error: configError(errorCodes.CONFIG_LOCALE_TYPE, { type: typeof entry }) };
    }

    const trimmed = entry.trim();

    if (!localeRegex.test(trimmed)) {
        return { error: configError(errorCodes.CONFIG_LOCALE_FORMAT, { locale: entry }) };
    }

    const normalized = normalizeLocale(trimmed, intl);

    return normalized
        ? { value: normalized }
        : { error: configError(errorCodes.CONFIG_LOCALE_BCP47, { locale: entry }) };
};


const parseLocaleInput = (raw) => {
    if (isNullish(raw)) {
        return {
            value: null,
            errors: [configError(errorCodes.CONFIG_LOCALE_MISSING)]
        };
    }

    try {
        const parsed = JSON.parse(raw);

        return Array.isArray(parsed)
            ? { value: parsed, errors: [] }
            : {
                value: null,
                errors: [configError(errorCodes.CONFIG_LOCALE_NOT_ARRAY)]
            };
    } catch {
        return {
            value: null,
            errors: [configError(errorCodes.CONFIG_LOCALE_PARSE)]
        };
    }
};

const validateLocales = (entries, intl) => {
    const values = [];
    const errors = [];

    for (const entry of entries) {
        const result = toLocaleOrError(entry, intl);

        if (result.value) {values.push(result.value);}
        if (result.error) {errors.push(result.error);}
    }

    return {
        value: [...new Set(values)],
        errors
    };
};

export const parseLocalesArray = (raw, intl = Intl) => {
    const { value, errors } = parseLocaleInput(raw);

    return errors.length
        ? { value: null, errors }
        : validateLocales(value, intl);
};

const buildLocaleConfig = (config, intl) => {
    const { value: allowedLocales, errors } =
        parseLocalesArray(config.LOCALES_ALLOWED, intl);

    const hasDefault =
        config.LOCALE_DEFAULT !== null &&
        config.LOCALE_DEFAULT !== undefined;

    const normalizedDefault = normalizeLocale(config.LOCALE_DEFAULT, intl);
    const defaultLocale = normalizedDefault || fallbackLocale;

    const defaultErrors =
        !normalizedDefault && hasDefault
            ? [configError(errorCodes.CONFIG_LOCALE_FORMAT, { locale: config.LOCALE_DEFAULT })]
            : [];

    let mergedAllowed = allowedLocales;

    if (
        Array.isArray(allowedLocales) &&
        allowedLocales.length > 0 &&
        !allowedLocales.includes(defaultLocale)
    ) {
        mergedAllowed = [...allowedLocales, defaultLocale];
    }

    return {
        allowedLocales: Array.isArray(mergedAllowed) ? mergedAllowed : [],
        defaultLocale,
        errors: [...errors, ...defaultErrors]
    };
};

const buildOAuthFlags = (config) => ({
    bitbucketEnabled: !isNullish(config.BITBUCKET_CLIENT_ID),
    githubEnabled: !isNullish(config.GITHUB_CLIENT_ID),
    gitlabEnabled: !isNullish(config.GITLAB_CLIENT_ID),
    googleEnabled: !isNullish(config.GOOGLE_CLIENT_ID)
});

const isTruthy = (val) => {
    if (isNullish(val)) {return false;}
    const str = String(val).toLowerCase().trim();
    return str === 'true' || str === '1';
};

export const buildPlausibleConfig = (config) => {
    if (!isTruthy(config.PLAUSIBLE_ENABLED)) {
        return { enabled: false };
    }

    const result = { enabled: true };

    if (isString(config.PLAUSIBLE_URL) && config.PLAUSIBLE_URL.trim().length > 0) {
        result.url = config.PLAUSIBLE_URL.trim();
    } else {
        result.url = 'https://plausible.io';
    }

    if (isString(config.PLAUSIBLE_DOMAIN) && config.PLAUSIBLE_DOMAIN.trim().length > 0) {
        result.domain = config.PLAUSIBLE_DOMAIN.trim();
    }

    return result;
};

export const buildConfig = (config, { intl = Intl } = {}) => {
    const localeConfig = buildLocaleConfig(config, intl);

    return {
        value: Object.freeze({
            ...buildOAuthFlags(config),
            localEnabled: true,
            allowedLocales: Object.freeze([...localeConfig.allowedLocales]),
            defaultLocale: localeConfig.defaultLocale,
            plausible: Object.freeze(buildPlausibleConfig(config))
        }),
        errors: Array.isArray(localeConfig.errors) ? localeConfig.errors : []
    };
};

