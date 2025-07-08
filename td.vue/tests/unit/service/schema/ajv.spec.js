import schema from '@/service/schema/ajv';
import tmModel from './test-threat-model';
import otmModel from './otm_example';
import v1Model from './test-v1-model';
import v2Model from './test-v2-model';

describe('service/schema/ajv.js', () => {
    let invalidV2Model = JSON.parse(JSON.stringify(v2Model));
    delete invalidV2Model.summary.title;

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

        it('detects no schema match', () => {
            expect(schema.isValid({'invalidJson': 'made up'})).toBe(false);
        });

        it('rejects invalid JSON', () => {
            expect(schema.isValid('invalidJson')).toBe(false);
        });
    });

    describe('checkV2', () => {
        it('reports V2 schema passing', () => {
            let report = schema.checkV2(v2Model);
            expect(report).toBe(null);
        });

        it('reports V2 schema errors', () => {
		    let report = schema.checkV2(invalidV2Model);
		    expect(report[0].message).toBe("must have required property 'title'");
        });

    });

    describe('isV1', () => {
        it('validates V1 Threat Dragon models', () => {
            expect(schema.isV1(v1Model)).toBe(true);
        });

        it('rejects invalid V1 Threat Dragon models', () => {
            let invalidModel = JSON.parse(JSON.stringify(v1Model));
            delete invalidModel.summary.title;
            expect(schema.isV1(invalidModel)).toBe(false);
        });

        it('rejects other models', () => {
            expect(schema.isV1(tmModel)).toBe(false);
            expect(schema.isV1(otmModel)).toBe(false);
            expect(schema.isV1(v2Model)).toBe(false);
        });

        it('rejects invalid JSON', () => {
            expect(schema.isV1('invalidJson')).toBe(false);
        });
    });

    describe('isV2', () => {
        it('validates V2 Threat Dragon models', () => {
            expect(schema.isV2(v2Model)).toBe(true);
        });

        it('rejects invalid V2 Threat Dragon models', () => {
            expect(schema.isV2(invalidV2Model)).toBe(false);
        });

        it('rejects other models', () => {
            expect(schema.isV2(tmModel)).toBe(false);
            expect(schema.isV2(otmModel)).toBe(false);
            expect(schema.isV2(v1Model)).toBe(false);
        });

        it('rejects invalid JSON', () => {
            expect(schema.isV2('invalidJson')).toBe(false);
        });
    });

    describe('isTmBom', () => {
        it('validates TM models', () => {
            expect(schema.isTmBom(tmModel)).toBe(true);
        });

        it('rejects invalid TM models', () => {
            let invalidModel = JSON.parse(JSON.stringify(tmModel));
            invalidModel['version'] = 0;
            expect(schema.isTmBom(invalidModel)).toBe(false);
        });

        it('rejects other models', () => {
            expect(schema.isTmBom(otmModel)).toBe(false);
            expect(schema.isTmBom(v1Model)).toBe(false);
            expect(schema.isTmBom(v2Model)).toBe(false);
        });

        it('rejects invalid JSON', () => {
            expect(schema.isTmBom('invalidJson')).toBe(false);
        });
    });

    describe('isOtm', () => {
        it('validates OTM models', () => {
            expect(schema.isOtm(otmModel)).toBe(true);
        });

        it('rejects invalid OTM models', () => {
            let invalidModel = JSON.parse(JSON.stringify(otmModel));
            invalidModel['otmVersion'] = 0;
            expect(schema.isOtm(invalidModel)).toBe(false);
        });

        it('rejects other models', () => {
            expect(schema.isOtm(tmModel)).toBe(false);
            expect(schema.isOtm(v1Model)).toBe(false);
            expect(schema.isOtm(v2Model)).toBe(false);
        });

        it('rejects invalid JSON', () => {
            expect(schema.isOtm('invalidJson')).toBe(false);
        });
    });

});
