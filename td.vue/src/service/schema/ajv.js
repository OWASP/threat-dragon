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

export const isValid = (jsonFile) => {

    // use the latest V2 schema, save errors for later if needed
    if (validateV2(jsonFile)) {
        console.debug('Schema validate success');
        return true;
    }

    // try the V1 schema
    if (isV1(jsonFile)) {
        console.debug('Schema validate success for V1.x model');
        return true;
    }

    // if it is not in either Threat Dragon formats, maybe it is TM-BOM format
    if (isTM(jsonFile)) {
	    console.debug('Schema validate success for Threat Model in TM-BOM');
	    return true;
    }

    if (isOTM(jsonFile)) {
	    console.debug('Schema validate success for Open Threat Model');
	    return true;
    }

    console.warn('Failed to validate', validateV2.errors);
    return false;
};

export const isV1 = (jsonFile) => {
    return validateV1(jsonFile);
};

export const isV2 = (jsonFile) => {
    return validateV2(jsonFile);
};

export const isTM = (jsonFile) => {
    return validateTM(jsonFile);
};

export const isOTM = (jsonFile) => {
    return validateOTM(jsonFile);
};

export default {
    isV1,
    isV2,
    isOTM,
    isTM,
    isValid
};
