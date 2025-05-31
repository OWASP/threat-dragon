import Ajv from 'ajv';
import Vue from 'vue';
import i18n from '@/i18n/index.js';

const schemaV1 = require('./owasp-threat-dragon-v1.schema');
const schemaV2 = require('./owasp-threat-dragon-v2.schema');
//const schemaTM = require('./threat-model.schema');
const schemaOTM = require('./open-threat-model.schema');

const ajv = new Ajv({'allowUnionTypes' : true});
const validateV1 = ajv.compile(schemaV1);
const validateV2 = ajv.compile(schemaV2);
const validateOTM = ajv.compile(schemaOTM);

export const isValidSchema = (jsonFile) => {

    // use the latest schema, otherwise try the original V1 schema
    let valid = validateV2(jsonFile);
    if (valid) {
        console.debug('Schema validate success');
        return true;
    }

    valid = validateV1(jsonFile);
    if (valid) {
        console.debug('Schema validate success for V1.x model');
        Vue.$toast.warning(i18n.get().t('threatmodel.warnings.v2Warning'), { timeout: false });
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

export const isValidV1 = (jsonFile) => {
    return validateV1(jsonFile);
};

export const isValidV2 = (jsonFile) => {
    return validateV2(jsonFile);
};

export const isValidOTM = (jsonFile) => {
    return validateOTM(jsonFile);
};

export default {
    isValidV1,
    isValidV2,
    isValidOTM,
    isValidSchema
};
