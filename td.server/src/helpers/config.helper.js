import { isNullish, isString } from './validators.helper.js';
import { ERROR_CODES } from '../constants/errorCodes.js';

const DEFAULT_LOCALE = 'en';
const LOCALE_REGEX = /^[a-zA-Z]{2}(?:-[a-zA-Z]{2})?$/u;
const configError = (code, meta = {}) => ({ code, meta });

export const normalizeLocale = (locale, intl = Intl) => {
    if (!isString(locale)) {return null;}

    const trimmed = locale.trim();
    if (!LOCALE_REGEX.test(trimmed)) {return null;}

    try {
        return intl.getCanonicalLocales(trimmed)[0];
    } catch {
        return null;
    }
};

const toLocaleOrError = (entry, intl) => {
    if (!isString(entry)) {
        return { error: configError(ERROR_CODES.CONFIG_LOCALE_TYPE, { type: typeof entry }) };
    }

    const trimmed = entry.trim();

    if (!LOCALE_REGEX.test(trimmed)) {
        return { error: configError(ERROR_CODES.CONFIG_LOCALE_FORMAT, { locale: entry }) };
    }

    const normalized = normalizeLocale(trimmed, intl);

    return normalized
        ? { value: normalized }
        : { error: configError(ERROR_CODES.CONFIG_LOCALE_BCP47, { locale: entry }) };
};


const parseLocaleInput = (raw) => {
    if (isNullish(raw)) {
        return {
            value: null,
            errors: [configError(ERROR_CODES.CONFIG_LOCALE_MISSING)]
        };
    }

    try {
        const parsed = JSON.parse(raw);

        return Array.isArray(parsed)
            ? { value: parsed, errors: [] }
            : {
                value: null,
                errors: [configError(ERROR_CODES.CONFIG_LOCALE_NOT_ARRAY)]
            };
    } catch {
        return {
            value: null,
            errors: [configError(ERROR_CODES.CONFIG_LOCALE_PARSE)]
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
    const defaultLocale = normalizedDefault || DEFAULT_LOCALE;

    const defaultErrors =
        !normalizedDefault && hasDefault
            ? [configError(ERROR_CODES.CONFIG_LOCALE_FORMAT, { locale: config.LOCALE_DEFAULT })]
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

export const buildConfig = (config, { intl = Intl } = {}) => {
    const localeConfig = buildLocaleConfig(config, intl);

    return {
        value: Object.freeze({
            ...buildOAuthFlags(config),
            localEnabled: true,
            allowedLocales: Object.freeze([...localeConfig.allowedLocales]),
            defaultLocale: localeConfig.defaultLocale
        }),
        errors: Array.isArray(localeConfig.errors) ? localeConfig.errors : []
    };
};