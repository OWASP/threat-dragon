import Ajv from 'ajv';
import { schema } from '../assets/threat-model-schema';

export const isValidSchema = (jsonFile) => {

    const ajv = new Ajv({strict : false});
    const validate = ajv.compile(schema);

    const valid = validate(jsonFile);

    if (valid.errors) {
        console.error("Failed to validate", validate.errors);
        return false;
    } else {
        return true;
    }
}
