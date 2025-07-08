import validate from '@/service/migration/tmBom/validate';
import tmBomModel from './test-model';
import tdModel from './v2-threat-model';

describe('service/migration/tmBom/validate.js', () => {
    describe('validates TM-BOM models', () => {
        it('valid threat model', () => {
            expect(validate.isValid(tmBomModel)).toBe(true);
        });

        it('invalid threat model', () => {
            expect(validate.isValid(tdModel)).toBe(false);
        });

    });
});
