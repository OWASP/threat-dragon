import Ajv from 'ajv';
import { schema } from '@/assets/threat-model-schema';
import { schema as schemaV2 } from '@/assets/threat-model-schema.V2';

const ajv = new Ajv({'allowUnionTypes' : true , "strict" : false});
const validate = ajv.compile(schema);
const validateV2 = ajv.compile(schemaV2);

export const isValidSchema = (jsonFile) => {

    // use the latest schema, otherwise try the original V1 schema
    let valid = validateV2(jsonFile);

    if (!valid) {
        valid = validate(jsonFile);
        if (!valid) {
            console.error('Failed to validate', validate.errors);
            return false;
        }
    }

    console.debug('Schema validate success');
    return true;
}
