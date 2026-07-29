import { errorCodes } from './errorCodes.js';

export const errorMessages = Object.freeze({
    [errorCodes.CONFIG_INVALID_ENTRY]: 'Invalid error entry',
    [errorCodes.CONFIG_LOCALE_MISSING]: 'LOCALES_ALLOWED not set, will not restrict locales',
    [errorCodes.CONFIG_LOCALE_PARSE]: 'LOCALES_ALLOWED is not valid JSON',
    [errorCodes.CONFIG_LOCALE_NOT_ARRAY]: 'LOCALES_ALLOWED must be a JSON array of strings',
    [errorCodes.CONFIG_LOCALE_TYPE]: 'Invalid entry in LOCALES_ALLOWED: expected string',
    [errorCodes.CONFIG_LOCALE_FORMAT]: 'Invalid locale format (expected en or en-US)',
    [errorCodes.CONFIG_LOCALE_BCP47]: 'Invalid BCP47 locale in LOCALES_ALLOWED'
});
