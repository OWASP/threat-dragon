import schema from '@/service/schema/ajv';
import tmModel from './husky-ai-threat-model';
import otmModel from './otm_example';
import v1Model from './test-v1-model';
import v2Model from './test-v2-model';

describe('service/schema/ajv.js', () => {

    describe('isValid', () => {
        it('validates V1 models', () => {
            expect(schema.isValid(v1Model)).toBe(true);
        });

        it('validates V2 models', () => {
		    expect(schema.isValid(v2Model)).toBe(true);
        });

        it('validates TM models', () => {
		    expect(schema.isValid(tmModel)).toBe(true);
        });

        it('validates OTM models', () => {
            expect(schema.isValid(otmModel)).toBe(true);
        });
    });

    describe('isTmBom', () => {
	    it('validates TM models', () => {
	        expect(schema.isTmBom(tmModel)).toBe(true);
	    });

        it('rejects invalid TM models', () => {
            let invalidTmModel = tmModel;
            invalidTmModel['version'] = 0;
		    expect(schema.isTmBom(invalidTmModel)).toBe(false);
        });

	    it('rejects other models', () => {
	        expect(schema.isTmBom(otmModel)).toBe(false);
	    });
    });

});
