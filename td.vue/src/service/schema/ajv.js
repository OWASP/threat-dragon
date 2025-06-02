import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import Vue from 'vue';
import i18n from '@/i18n/index.js';

const schemaV1 = require('./owasp-threat-dragon-v1.schema');
const schemaV2 = require('./owasp-threat-dragon-v2.schema');
const schemaTM = require('./threat-model.schema');
const schemaOTM = require('./open-threat-model.schema');

const ajv = new Ajv({'allowUnionTypes' : true});
addFormats(ajv);

const validateV1 = ajv.compile(schemaV1);
const validateV2 = ajv.compile(schemaV2);
const validateTM = ajv.compile(schemaTM);
const validateOTM = ajv.compile(schemaOTM);

export const isValidSchema = (jsonFile) => {

    // use the latest V2 schema, save errors for later if needed
    if (validateV2(jsonFile)) {
        console.debug('Schema validate success');
        return true;
    }

    // try the V1 schema
    if (isValidV1(jsonFile)) {
        console.debug('Schema validate success for V1.x model');
        Vue.$toast.warning(i18n.get().t('threatmodel.warnings.v2Warning'), { timeout: false });
        return true;
    }

    // if it is not in either Threat Dragon formats, maybe it is TM-BOM format
    if (isValidTM(jsonFile)) {
	    console.debug('Schema validate success for Threat Model in TM-BOM');
	    return true;
    }

    if (isValidOTM(jsonFile)) {
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

export const isValidTM = (jsonFile) => {
    return validateTM(jsonFile);
};

export const isValidOTM = (jsonFile) => {
    return validateOTM(jsonFile);
};

export default {
    isValidV1,
    isValidV2,
    isValidOTM,
    isValidTM,
    isValidSchema
};
