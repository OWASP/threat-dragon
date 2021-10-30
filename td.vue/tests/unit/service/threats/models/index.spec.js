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
});
