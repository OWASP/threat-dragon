import models from '@/service/threats/models/index.js';

describe('service/threats/models/index.js', () => {
    describe('getByTranslationValue', () => {
        it('identifies a CIA threat', () => {
            expect(models.getByTranslationValue('threats.models.confidentiality'))
                .toEqual('CIA');
        });

        it('identifies a LINDUN threat', () => {
            expect(models.getByTranslationValue('threats.models.linkability'))
                .toEqual('LINDDUN');
        });

        it('identifies a STRIDE threat', () => {
            expect(models.getByTranslationValue('threats.models.tampering'))
                .toEqual('STRIDE');
        });

        it('returns an empty string for an unknown type', () => {
            expect(models.getByTranslationValue('threats.models.fake'))
                .toEqual('');
        });
    });

    describe('getThreatTypes', () => {
        it('gets the CIA threat types', () => {
            expect(Object.keys(models.getThreatTypes('CIA')).length).toEqual(3);
        });

        it('gets the LINDDUN threat types', () => {
            expect(Object.keys(models.getThreatTypes('linddun')).length).toEqual(7);
        });

        it('gets the STRIDE threat types', () => {
            expect(Object.keys(models.getThreatTypes('Stride')).length).toEqual(6);
        });

        it('returns an empty object if no threat types are found', () => {
            console.error = jest.fn();
            expect(models.getThreatTypes('fake')).toEqual({});
        });
    });
});
