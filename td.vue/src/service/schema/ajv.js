import Ajv from 'ajv';
import i18n from '@/i18n/index.js';
import logger from '@/utils/logger.js';

import { schema } from './threat-model-schema';
import { schema as schemaV2 } from './threat-model-schema.V2';
import { schema as schemaOTM } from './open-threat-model-schema';

// Create a context-specific logger
const log = logger.getLogger('service:schema:ajv');

const ajv = new Ajv({ allowUnionTypes: true });
const validate = ajv.compile(schema);
const validateV2 = ajv.compile(schemaV2);
const validateOTM = ajv.compile(schemaOTM);

export const isValidSchema = (jsonFile) => {
    // use the latest schema, otherwise try the original V1 schema
    let valid = validateV2(jsonFile);
    if (valid) {
        log.debug('Schema validate success');
        return true;
    }

    valid = validate(jsonFile);
    if (valid) {
        log.debug('Schema validate success for V1.x model');
        // Using import to avoid direct reference to Vue instance
        // Will be called from component context
        const warningMessage = i18n.get().t('nav.v2Warning');
        setTimeout(() => {
            // Emit a custom event for the warning that components can listen for
            document.dispatchEvent(
                new CustomEvent('schema-warning', {
                    detail: { message: warningMessage }
                })
            );
        }, 0);
        return true;
    }

    // if it is not a valid Threat Dragon model, maybe it is an Open Threat Model
    valid = validateOTM(jsonFile);
    if (valid) {
        log.debug('Schema validate success for Open Threat Model');
        return true;
    }

    log.warn('Failed to validate', { errors: validateV2.errors });
    return false;
};

export const isValidOTM = (jsonFile) => {
    return validateOTM(jsonFile);
};

export default {
    isValidOTM,
    isValidSchema
};
