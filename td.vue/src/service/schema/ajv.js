import Ajv from 'ajv';
import Vue from 'vue';
import i18n from '@/i18n/index.js';

import { schema } from './threat-model-schema';
import { schema as schemaV2 } from './threat-model-schema.V2';
import { schema as schemaOTM } from './open-threat-model-schema';

const ajv = new Ajv({'allowUnionTypes' : true});
const validate = ajv.compile(schema);
const validateV2 = ajv.compile(schemaV2);
const validateOTM = ajv.compile(schemaOTM);

export const isValidSchema = (jsonFile) => {

    // use the latest schema, otherwise try the original V1 schema
    let valid = validateV2(jsonFile);
    if (valid) {
        console.debug('Schema validate success');
        return true;
    }

    valid = validate(jsonFile);
    if (valid) {
        console.debug('Schema validate success for V1.x model');
        Vue.$toast.warning(i18n.get().t('nav.v2Warning'), { timeout: false });
        return true;
    }

    // if it is not a valid Threat Dragon model, maybe it is an Open Threat Model
    valid = validateOTM(jsonFile);
    if (valid) {
        console.debug('Schema validate success for Open Threat Model');
        return true;
    }

    console.warn('Failed to validate', validateV2.errors);
    return false;
};

export const isValidOTM = (jsonFile) => {
    return validateOTM(jsonFile);
};

export default {
    isValidOTM,
    isValidSchema
};
