import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({'allowUnionTypes' : true});
addFormats(ajv);

const schema = require('./threat-model.schema');
const validate = ajv.compile(schema);

export const isValid = (jsonFile) => {
    return validate(jsonFile);
};

export default {
    isValid
};
