import Ajv from 'ajv';
import { schema } from '../assets/threat-model-schema';

const ajv = new Ajv({strict : false});
const validate = ajv.compile(schema);

export const isValidSchema = (jsonFile) => {


    const valid = validate(jsonFile);

    if (valid.errors) {
        console.error("Failed to validate", validate.errors);
        return false;
    } else {
        return true;
    }
}
