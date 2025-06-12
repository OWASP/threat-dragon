import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import otm from '@/service/migration/otm/openThreatModel';
import tmBom from '@/service/migration/tmBom/threatModelBom';

const schemaV1 = require('./owasp-threat-dragon-v1.schema');
const schemaV2 = require('./owasp-threat-dragon-v2.schema');

const ajv = new Ajv({'allowUnionTypes' : true});
addFormats(ajv);

const validateV1 = ajv.compile(schemaV1);
const validateV2 = ajv.compile(schemaV2);

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

    // if it is not in either Threat Dragon formats, maybe another format
    if (isTmBom(jsonFile)) {
	    console.debug('Schema validate success for Threat Model in TM-BOM');
	    return true;
    }

    if (isOtm(jsonFile)) {
	    console.debug('Schema validate success for Open Threat Model');
	    return true;
    }

    console.warn('Failed to validate', validateV2.errors);
    return false;
};

export const checkV2 = (jsonFile) => {
    validateV2(jsonFile);
    return validateV2.errors;
};

export const isV1 = (jsonFile) => {
    return validateV1(jsonFile);
};

export const isV2 = (jsonFile) => {
    return validateV2(jsonFile);
};

export const isTmBom = (jsonFile) => {
    return tmBom.isValid(jsonFile);
};

export const isOtm = (jsonFile) => {
    return otm.isValid(jsonFile);
};

export default {
    checkV2,
    isV1,
    isV2,
    isOtm,
    isTmBom,
    isValid
};
