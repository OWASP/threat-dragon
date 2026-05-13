import { ERROR_CODES } from './errorCodes.js';

export const ERROR_MESSAGES = Object.freeze({
    [ERROR_CODES.CONFIG_INVALID_ENTRY]: 'Invalid error entry',
    [ERROR_CODES.CONFIG_LOCALE_MISSING]: 'LOCALES_ALLOWED not set, will not restrict locales',
    [ERROR_CODES.CONFIG_LOCALE_PARSE]: 'LOCALES_ALLOWED is not valid JSON',
    [ERROR_CODES.CONFIG_LOCALE_NOT_ARRAY]: 'LOCALES_ALLOWED must be a JSON array of strings',
    [ERROR_CODES.CONFIG_LOCALE_TYPE]: 'Invalid entry in LOCALES_ALLOWED: expected string',
    [ERROR_CODES.CONFIG_LOCALE_FORMAT]: 'Invalid locale format (expected en or en-US)',
    [ERROR_CODES.CONFIG_LOCALE_BCP47]: 'Invalid BCP47 locale in LOCALES_ALLOWED'
});
